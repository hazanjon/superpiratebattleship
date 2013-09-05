<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
include("definitions.php");
$db->query("INSERT INTO events (event_id, pickup) VALUES ('1', 'end')");
?>