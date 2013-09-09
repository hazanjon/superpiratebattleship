<?php
/**
 * class to encapsulate all game related functions
 *
 */
class gameController {
    protected $db;
    protected $pusher;

    public function __construct($db=false) {
        if(!empty($db)) {
            $this->db = $db;
        }
    }

    /**
     * check this game exists
     * @param int $game_id
     */
    public function exists($game_id) {
        $result = $this->db->query("SELECT * FROM games WHERE game_id='{$game_id}'");
        return ($result->num_rows > 0);
    }

    /**
     * add a new player to the db
     * @param int $number
     * @param string $name
     * @param int $game_id
     */
    public function createPlayer($number, $name, $game_id) {
        return $this->db->query("INSERT INTO players (number, name, game_id, status) VALUES ('{$number}', '{$name}', '{$game_id}', '1')");

    }

    public function getPlayer($number, $game_id) {
        $player = $this->db->query("SELECT * FROM players WHERE number='{$number}' AND game_id='{$game_id}'");
        if($player->num_rows > 0) {
            $player = $player->fetch_assoc();
        }
        else {
            $player = false;
        }

        return $player;
    }

    public function getPlayerName($game_id) {
        $name	 = false;
        $players = $this->db->query("SELECT * FROM players WHERE game_id='{$game_id}'");
        if(empty($players->num_rows) || $players->num_rows <= PLAYER_THRESHOLD) {
            $name = 'PLAYER '.($players->num_rows + 1);
        }

        return $name;
    }

    /**
     * show this user on the game page
     * @param unknown_type $number
     * @param unknown_type $name
     */
    public function displayPlayer($game_id, $number, $name) {
        $this->initPusher();
        try {
            $params  = array('id'=>$number, 'name'=>$name);
            $channel = PUSHER_CHANNEL.sprintf('%04u',$game_id);
            error_log("Pusher newUser_event : {$game_id} - {$channel} - {$name} - {$number}");
            $this->pusher->trigger($channel, 'newUser_event', $params);
        }
        catch(Exception $e) {
            error_log("Pusher Exception newUser_event : {$game_id} - {$name} - {$number}");
        }
    }
    
    /**
     * run authorisation code for the pusher private channel
     * @param string $channel - the channel name
     * @param float  $socket  - not entirely sure as it's a float, the socket number at a guess
     */
    public function authPusher($channel, $socket) {
        $this->initPusher();
        return $this->pusher->socket_auth($channel, $socket);
    }


    /**
     * try to connect to pusher channel
     */
    protected function initPusher() {
        if(!isset($this->pusher)) {
            try{
                $this->pusher = new Pusher(PUSHER_KEY, PUSHER_SECRET, PUSHER_ID);
            }
            catch(Exception $e) {
                error_log("Pusher Exception init");
            }
        }
    }
    
}