<?php 
	
	include("lib/pusher.php");
	$pusher = new Pusher(PUSHER_KEY, PUSHER_SECRET, PUSHER_ID);
  	echo $pusher->socket_auth($_POST['channel_name'], $_POST['socket_id']);
?>