<?php 
include("../definitions.php");

if(!empty($_POST['Digits'])) {
	$digits = $db->real_escape_string($_POST['Digits']);
	// check this game exists
	$result = $db->query("SELECT * FROM games WHERE game_id='{$digits}'")->fetch_assoc();
	if(!empty($result['game_id'])) {
		// check how many players in this game
		$players = $db->query("SELECT * FROM players WHERE game_id='{$digits}'");
		if(!empty($players->num_rows) && $players->num_rows > PLAYER_THRESHOLD) {
			// too many players deny
			$response = "<Say>There are too many people in this game already</Say><Hangup />";
		}
		else {
			// add to game
			$number   = $_POST['To'] == TWILIO_NUMBER ? $_POST['From'] : $_POST['To']; // this needs to be functionised!
			$name     = 'PLAYER '.($players->num_rows + 1); // give them a name as we can't get it here
			$response = "<Say>Thankyou for joining superpiratebattleships</Say><Say>You are $name</Say><Redirect method=\"POST\">waiting.php</Redirect>";
			$db->query("INSERT INTO players (number, name, game_id, status) VALUES ('{$number}', '{$name}', '{$digits}', '1')");
		}
	}
	else {
		$response = "<Say>This game was not found, sorry!</Say><Hangup />";
	}
}
else {
	$response = "<Gather method=\"POST\" action=\"\" numDigits=\"4\" timeout=\"60\"><Say loop=\"10\">Please enter your four digit code</Say></Gather>";
}
<Response>
	<?php echo $response;?>
</Response>