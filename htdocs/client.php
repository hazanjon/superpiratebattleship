<?php 
include("definitions.php");

if(!empty($_GET['game_id'])) {
	$game_id = $db->real_escape_string($_GET['game_id']);
	// check this game exists
	
	if($game->exists($game_id)) {
		// check how many players in this game
		if($name = $game->getPlayerName($game_id)) {
			// add to game
			$number   = $_GET['id'];
			$response = "<Say>Thankyou for joining superpiratebattleships</Say><Say>You are $name</Say><Redirect method=\"POST\">waiting.php</Redirect>";
			$game->createPlayer($number, $name, $game_id);
			$player   = $game->getPlayer($number, $game_id);
			
			// to be done in phone/waiting.php
			$game->displayPlayer($player['game_id'], $player['number'], $player['name']);
			
		}
		else {
			// too many players deny
			$response = "<Say>There are too many people in this game already</Say><Hangup />";
		}
	}
	else {
		$response = "<Say>This game was not found, sorry!</Say><Hangup />";
	}
}
else {
	$response = "<Gather method=\"POST\" action=\"\" numDigits=\"4\" timeout=\"60\"><Say loop=\"10\">Please enter your four digit code</Say></Gather>";
}

?>

<!DOCTYPE html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <link href="/res/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script>
    
	    var pusher = new Pusher('8d6d30d2c32b3a486688', { authEndpoint: '/pusher_auth.php' });
	    var channel = pusher.subscribe('test_channel');
	    var privateChannel = pusher.subscribe('private-channel');
	    
	    var user_id = '<?php echo $_GET['id']; ?>';
	    var control = function(num){
		    console.log(num);
	        privateChannel.trigger('client-ev', {id: user_id, button: num});	
	    }
    </script>
</head>
<body>
<?php
	echo "<p>Game_id : {$_GET['game_id']}</p>
		  <p>Your id :{$_GET['id']}</p>
	      <p>Response:</p>
	      <xmp>{$response}</xmp>
	";
?>
	<table>
		<tr>
			<td><button class="btn btn-info span2" onclick="control(1)">1</button></td>
			<td><button class="btn btn-info span2" onclick="control(2)">2</button></td>
			<td><button class="btn btn-info span2" onclick="control(3)">3</button></td>
		</tr>
		<tr>
			<td><button class="btn btn-info span2" onclick="control(4)">4</button></td>
			<td><button class="btn btn-info span2" onclick="control(5)">5</button></td>
			<td><button class="btn btn-info span2" onclick="control(6)">6</button></td>
		</tr>
		<tr>
			<td><button class="btn btn-info span2" onclick="control(7)">7</button></td>
			<td><button class="btn btn-info span2" onclick="control(8)">8</button></td>
			<td><button class="btn btn-info span2" onclick="control(9)">9</button></td>
		</tr>
		<tr>
			<td><button class="btn btn-info span2" onclick="control(*)">*</button></td>
			<td><button class="btn btn-info span2" onclick="control(0)">0</button></td>
			<td><button class="btn btn-info span2" onclick="control(#)">#</button></td>
		</tr>
	</table>
</body>
</html>