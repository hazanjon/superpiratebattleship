<?php
/**
 * class to encapsulate all game related functions
 *
 */
class gameController {
    // new player
    const playerNew     = 1;
    // player has been called
    const playerCalled  = 2;
    // player is in the waiting queue
    const playerWaiting = 3;
    
    protected $db;
    protected $pusher;

    public function __construct($db=false) {
        if(!empty($db)) {
            $this->db = $db;
        }
    }

    
    public function formatGameId($id) {
        return sprintf('%04u', $id);
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
     * @param string $number
     * @param string $name
     * @param int $game_id
     */
    public function createPlayer($number, $name, $game_id) {
        $status = self::playerNew;
        return $this->db->query("INSERT INTO players (number, name, game_id, status) VALUES ('{$number}', '{$name}', '{$game_id}', '{$status}')");
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

    /**
     * get the player and associated latest game by telephone number
     * @param string $number
     */
    public function getPlayerByNumber($number) {
        $result = $this->db->query("SELECT MAX(game_id) AS game_id FROM players WHERE number='{$number}'")->fetch_assoc();
        return $this->getPlayer($number, $result['game_id']);
    }
    
    /**
     * generate a player name for this game 
     * or return false if there are too many playersin this game
     * @param int $game_id
     */
    public function getPlayerName($game_id) {
        $name	 = false;
        $players = $this->db->query("SELECT * FROM players WHERE game_id='{$game_id}'");
        if(empty($players->num_rows) || $players->num_rows <= PLAYER_THRESHOLD) {
            $name = 'PLAYER '.($players->num_rows + 1);
        }

        return $name;
    }
    
    public function setWaiting($number, $game_id) {
        $status = self::playerWaiting;
        $this->db->query("UPDATE players SET status='{$status}' WHERE number='{$number}' AND game_id='{$game_id}'");
    }
    
    /**
     * get the number of players waiting to start this game
     * @param int $game_id
     */
    public function getPlayersWaiting($game_id) {
        $status = self::playerWaiting;
        $result = $this->db->query("SELECT COUNT(*) as users FROM players WHERE status='{$status}' AND game_id='{$game_id}'")->fetch_assoc();
        $count  = !empty($result['users']) ? $result['users'] : 1;
        
        return $count;
    }
    
    public function getPickup($game_id, $number) {
        $result = $this->db->query("SELECT pickup FROM events WHERE number='{$number}'AND game_id='{$game_id}' AND status='0' AND pickup IN ('coin', 'health', 'powerup') ORDER BY event_id DESC LIMIT 1")->fetch_assoc();
        $this->db->query("UPDATE events SET status=1 WHERE number='{$number}'");
        
        return !empty($result['pickup']) ? $result['pickup'] : false;
    }

    public function hasEnded($game_id) {
        $result = $this->db->query("SELECT pickup FROM events WHERE pickup='end' AND game_id='{$game_id}' LIMIT 1");
        return $result->num_rows > 0;
    }
    
    /**
     * show this user on the game page
     * @param string $number
     * @param string $name
     */
    public function displayPlayer($game_id, $number, $name) {
        $this->initPusher();
        try {
            $params  = array('id'=>$number, 'name'=>$name);
            $channel = PUSHER_CHANNEL.$this->formatGameId($game_id);
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
    
    public function keyPress($game_id, $number, $digit) {
        $this->initPusher();
        $channel = PUSHER_CHANNEL.$this->formatGameId($game_id);
        $params  = array('id'=>$number, 'button'=>$digit);
        error_log("Pushers : $channel, keypress_event, id: {$number}, button: {$digit}");
        return $this->pusher->trigger($channel, 'keyPress_event', $params);
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