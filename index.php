<?php
/*
DEFINE("TWILIO_SID",  	 "ACd049c35eea3ca0fbb84a8e9e74d9f57f");
DEFINE("TWILIO_AUTH", 	 "af92cb98c9a89fff692f63f8ceafc6a7");
DEFINE("TWILIO_VERSION", "2010-04-01");
include("lib/twilio/Services/Twilio.php");
$twilio = new Services_Twilio(TWILIO_SID, TWILIO_AUTH, TWILIO_VERSION);


$db = new mysqli("localhost", "root", "online", "hackference");

$result  = $db->query("SELECT * FROM hack_users WHERE game_id='5'");
var_dump($result->num_rows);

while($row = $result->fetch_assoc()) {
	var_dump($row);
	echo "<br>";
	try {
		//$call = $twilio->account->calls->create('01732601010', $row['number'], "http://hack.hazan.me/phone/waiting.php");
	}
	catch(Exception $e) {
		var_dump($e);
	}
	

}
//*/
?>
