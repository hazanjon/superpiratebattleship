<?php 
include("../definitions.php");

$db 	 = new mysqli("localhost", "root", "online", "hackference");
//$result  = $db->query("SELECT MAX(game_id) as game FROM hack_users WHERE status = 3")->fetch_assoc();
$game_id = 1;//!empty($result['game']) ? $result['game']+1 : 1;
$name    = $_POST['Body']; // user name
$from    = $_POST['To']; // my twilio number
$number  = $_POST['From']; // users number
$db->query("INSERT INTO hack_users (number, name, game_id) VALUES ('$number', '$name', '$game_id')");

$result  = $db->query("SELECT * FROM hack_users WHERE game_id='$game_id' AND called=0");

/*
if($result->num_rows <= PLAYER_THRESHOLD) {
?>
<Response>
	<Sms>Hello <?php echo $name;?>, You have been added to game <?php echo $game_id;?>. Hugs</Sms>
</Response>
<?php 
	include("../lib/twilio/Services/Twilio.php");
	$twilio  = new Services_Twilio(TWILIO_SID, TWILIO_AUTH, TWILIO_VERSION);
	
	// close this game off quick sharp
	$db->query("UPDATE hack_users SET status=2 WHERE game_id='$game_id' AND number='$number'");
	// loop through the players and give them a ring to start play.
//	while($row = $result->fetch_assoc()) {
		try {
			error_log("Make call now {$name}");
			$params = array(
				'StatusCallback' => URL.'phone/callback.php',
				'Timeout'		 => 20
			);
			
			$call = $twilio->account->calls->create(TWILIO_NUMBER, $number, URL."phone/waiting.php",$params);
		}
		catch(Exception $e) {
			error_log("Twilio Exception making phone call : {$row['number']}");
		}
//	}
}
elseif($result->num_rows > PLAYER_THRESHOLD) {
?>	
<Response>
	<Sms>Hello <?php echo $name;?>, Sorry the current game is full.</Sms>
</Response>
<?php	
}
//*/

//*

if($result->num_rows < PLAYER_THRESHOLD || $result->num_rows == PLAYER_THRESHOLD) {
	error_log("Send confirmation text to {$name} for {$game_id}");
?>	
<Response>
	<Sms>Ahoy <?php echo $name;?>, You have been added to game <?php echo $game_id;?>. Please wait for us to phone you back. Hugs</Sms>
</Response>
<?php 
}

// if we've passed the player threshhold start the game
if($result->num_rows >= PLAYER_THRESHOLD) {
	error_log("Reached player threshold {$game_id}");
//	include("../lib/twilio/Services/Twilio.php");
//	$twilio  = new Services_Twilio(TWILIO_SID, TWILIO_AUTH, TWILIO_VERSION);
	
	// close this game off quick sharp
//	$db->query("UPDATE hack_users SET status=2 WHERE game_id='$game_id'");
	// loop through the players and give them a ring to start play.
	while($row = $result->fetch_assoc()) {
		if($row['called']==0 && $row['status'] < 2) {
			try {
				error_log("Sending Curl {$row['game_id']} - {$row['number']}");
				$params = array('game_id'=>$row['game_id'], 'To'=>$row['number'], 'fromTxt'=>true);
				$curl = curl_init();
				curl_setopt($curl, CURLOPT_URL, URL."phone/connect.php");
				curl_setopt($curl, CURLOPT_POST, true);
				curl_setopt($curl, CURLOPT_POSTFIELDS, $params);
				curl_exec($curl);
				curl_close($curl);
				
				sleep(2);
				
	/*			
				error_log("Make call now {$row['name']}");
				$params = array(
					'StatusCallback' => URL.'phone/callback.php',
					'Timeout'		 => 20
				);
				$call = $twilio->account->calls->create(TWILIO_NUMBER,$row['number'],URL."phone/waiting.php",$params);
	//*/			
			}
			catch(Exception $e) {
				error_log("Curl Exception : {$row['number']}");
			}
		}
	}
}
elseif($result->num_rows > PLAYER_THRESHOLD) {
?>	
<Response>
	<Sms>Hello <?php echo $name;?>, Sorry the current game is full.</Sms>
</Response>
<?php	
}
//*/
?>