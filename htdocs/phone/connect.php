<?php 
include("../definitions.php");
$twilio  = new Services_Twilio(TWILIO_SID, TWILIO_AUTH, TWILIO_VERSION);
$game_id = 1;
$number  = $_POST['To'];
$digit   = isset($_POST['Digits']) ? $_POST['Digits'] : false;

if(is_numeric($digit) && $digit == 5) {
	$db->query("UPDATE players SET status=2 WHERE game_id='$game_id' AND number='$number'");
	$result = $db->query("SELECT * FROM players WHERE game_id='$game_id' AND status='2'");
	if($result->num_rows > PLAYER_THRESHOLD) {
		?>
		<Response>
			<Hangup />
		</Response>
		<?php
	}
	else {
		?>
		<Response>
			<Say voice="woman">Thankyou for joining me hearty</Say>
			<Redirect method="POST">waiting.php</Redirect>
		</Response>
		<?php
	}
}
else {
	$result = $db->query("SELECT called FROM players WHERE game_id='$game_id' AND number='$number'")->fetch_assoc();
	if(empty($result['called'])) {
		error_log("Reached Curl: $game_id : $number ");
		// loop through the players and give them a ring to start play.
		try {
			error_log("Make call now {$row['name']} {$number}");
			$db->query("UPDATE players SET called=1 WHERE game_id='$game_id' AND number='$number'");
			$params = array(
				'StatusCallback' => URL.'phone/callback.php',
				'Timeout'		 => 20
			);
			$call = $twilio->account->calls->create(TWILIO_NUMBER,$number,URL."phone/connect.php",$params);
		}
		catch(Exception $e) {
			error_log("Twilio Exception making phone call : {$row['number']}");
		}
	}
	
	?>
	<Response>
		<Gather action="" method="POST" numDigits="1" timeout="60">
			<Say loop="10">Please press 5 to connect to the game</Say>
		</Gather>
	</Response>
	<?php 
}
?>