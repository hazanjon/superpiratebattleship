<!DOCTYPE html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <link href="/res/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="/res/css/css.css" rel="stylesheet" media="screen">
</head>
<body>
    <form method="GET">
    <?php
    include("definitions.php");

    if(!empty($_GET['game_id'])) {
        $game_id = $db->real_escape_string($_GET['game_id']);
        // check this game exists

        if($game->exists($game_id)) {
            // check how many players in this game
            $number = $_GET['id'];
            $player = false;
            if(!empty($number)){
                $player = $game->getPlayer($number, $game_id);
            }
            
            if(!$player){//If the player doesnt exist
                if(!empty($_GET['name'])){
                    $game->createPlayer($number, $_GET['name'], $game_id);
                    $player = $game->getPlayer($number, $game_id);
            
                    // to be done in phone/waiting.php
                    $game->setWaiting($player['number'], $player['game_id']);
                    $game->displayPlayer($player['game_id'], $player['number'], $player['name']);
                }else{
                    //request name
                    $number = '+447'.mt_rand(100000000, 999999999);
                    ?>
                    <label>Please Enter Your Details:</label>
                    <div>
                        <span>Name:</span><input name="name" />
                    </div>
                    <div>
                    <span>Phone Number:</span><input name="id" value="<?php echo $number;?>" />
                    </div>
                    <input type="hidden" name="game_id" value="<?php echo $game_id;?>">
                    <input type="submit" value="Join" />
                    <?php
                    exit();
                }
            }
                
        }
        else {
            echo "<Say>This game was not found, sorry!</Say><Hangup />";
            exit();
        }
    }
    else {
        ?>
        <label>Please Enter The Game ID You Wish To Connect To:</label>
        <input name="game_id" />
        <input type="submit" value="Connect" />
        <?php
        exit;
    }

    ?>
    <?php
    /*echo "<p>Game_id : {$_GET['game_id']}</p>
          <p>Your id :{$_GET['id']}</p>
          <p>Response:</p>
          <xmp>{$response}</xmp>
    ";*/
    ?>
    </form>
    <div class="controls row-fluid">
            <button class="btn btn-info span4" onclick="control(1)">1</button>
            
            <button class="btn btn-info span4" onclick="control(2)">2</button>
            
            <button class="btn btn-info span4" onclick="control(3)">3</button>
            
    </div>
    <div class="controls row-fluid">
            <button class="btn btn-info span4" onclick="control(4)">4</button>
            
            <button class="btn btn-info span4" onclick="control(5)">5</button>
            
            <button class="btn btn-info span4" onclick="control(6)">6</button>
            
    </div>
    <div class="controls row-fluid">
            <button class="btn btn-info span4" onclick="control(7)">7</button>
            
            <button class="btn btn-info span4" onclick="control(8)">8</button>
            
            <button class="btn btn-info span4" onclick="control(9)">9</button>
            
    </div>
    <div class="controls row-fluid">
            <button class="btn btn-info span4" onclick="control(*)">*</button>
            
            <button class="btn btn-info span4" onclick="control(0)">0</button>
            
            <button class="btn btn-info span4" onclick="control(#)">#</button>
            
    </div>
    
    <script>
        var pusher = new Pusher('<?php echo PUSHER_KEY;?>', { authEndpoint: '/pusher_auth.php' });
        var privateChannel = pusher.subscribe('<?php echo "private-channel".$_GET['game_id'];?>');
        
        var user_id = '<?php echo $_GET['id']; ?>';
        var control = function(num){
            console.log(num);
            privateChannel.trigger('client-ev', {id: user_id, button: num});
        }
    </script>
</body>
</html>