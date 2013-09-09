<?php 
include("definitions.php");
/**
 * someone has requested a new game. Return to the page with the latest game_id and phone number
 */
if($_GET['newGame']) {
	$db->query("INSERT INTO games (`date`) VALUES (NOW())");
    $data    = array('game_id'=>sprintf('%04u', $db->insert_id), 'phone'=>TWILIO_NUMBER);
	header("Content-Type: application/json");
	exit(json_encode($data));
}


?>
<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" type="text/css" href="/res/css/css.css">

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    
    <script src="/res/js/crafty.js"></script>
    <script src="/res/js/game.js"></script>
    <script src="/res/js/player.js"></script>
    <script src="/res/js/scenes.js"></script>
    <script src="/res/js/components.js"></script>
    <script src="/res/js/pusher.js"></script>
    
    <!-- Soundcloud Stuff -->
    <script src="http://connect.soundcloud.com/sdk.js"></script>
    <script src="/res/js/knockout-2.3.0.js"></script>
    <script src="/res/js/soundcloud.js"></script>
    <script src="/res/js/main.js"></script>
</head>
<body>
    <div class="container">
        <div class="gameContainer">
            <canvas id="eq" style="width: 640px; height: 100px; border: none; margin-left: 64px;"></canvas>
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
                <img src='/res/img/logo.png' width="480px"/>
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