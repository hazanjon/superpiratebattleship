<?php 
include("definitions.php");

/**
 * someone has requested a new game. Return to the page with the latest game_id and phone number
 */
if($_GET['newGame']) {
	$result  = $db->query("SELECT MAX(game_id) as game_id FROM games")->fetch_assoc();
	$game_id = (!empty($result['game_id']) ? $result['game_id'] : 0) + 1;
	$data	 = array('game_id'=>sprintf('%04u', $game_id), 'phone'=>TWILIO_NUMBER);
	$db->query("INSERT INTO games (game_id, date) VALUES ('{$game_id}', NOW())");
	header("Content-Type: application/json");
	exit(json_encode($data));
}


?>
<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" type="text/css" href="Design/assets/css.css">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <script src="lib/crafty.js"></script>
    <script src="src/game.js"></script>
    <script src="src/player.js"></script>
    <script src="src/scenes.js"></script>
    <script src="src/components.js"></script>
    <script src="src/pusher.js"></script>
    
    <!-- Soundcloud Stuff -->
    <script src="http://connect.soundcloud.com/sdk.js"></script>
    <script src="src/soundcloud.js"></script>
    <script src="src/main.js"></script>
</head>
<body>
    <div class="" style="position: relative; height: 100px; width: 640px; margin-left: 107px; margin-bottom: -20px">
		<canvas id="eq" style="width:100%; height:100%; border:1px solid black;"></canvas>
    </div>
    
    <div class="container">
        
        <div class="gameContainer">
            <div id="cr-stage" style="width: 384px; float: left;"></div>
        </div>
        
        <div class="rightSide">
        	<div class="hidden callIn">
        		<p>Phone this number to play:</p>
        		<h1 id="phoneNumber" style="color: #FFF;text-align:center"></h1>
        		<p>Enter this code when prompted:</p>
        		<h2 id="gameCode"></h2>
        	</div>
            
            <div class="pirateGameLogo">
                <img src='Design/assets/img/logo.png' width="480px"/>
            </div>
        
            <a href='' class="newPlayer">Add New Player</a>
            <!--
            <a href='' class="newObs">Add World Object</a>
            -->
            
            <div class="userList">
                <ul class="ll">
                   
                </ul>
            </div>
        </div>
        
    </div>

</body>
</html>