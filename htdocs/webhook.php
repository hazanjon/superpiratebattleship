<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
include("definitions.php");

$number = $_REQUEST['player_id'];
$pickup = $_REQUEST['type'];

$db->query("INSERT INTO events (number, pickup) VALUES ('$number', '$pickup')");
?>