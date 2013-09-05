<?php
include("../definitions.php");
$number = $_POST['To'];
error_log("Callback : $number");

try{
	error_log("Kill user {$number}");
	$pusher = new Pusher(PUSHER_KEY, PUSHER_SECRET, PUSHER_ID);
	$params = array('id'=>$number);
	$pusher->trigger(PUSHER_CHANNEL, 'killUser_event', $params);		
}
catch(Exception $e) {
	error_log("Pusher Exception killUser_event : {$game} - {$name} - {$number}");
}

?>