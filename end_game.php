<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
$db = new mysqli("localhost", "root", "online", "hackference");
$db->query("INSERT INTO events (event_id, pickup) VALUES ('1', 'end')");



?>