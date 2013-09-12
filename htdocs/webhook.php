<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
include("definitions.php");

$number  = $_REQUEST['player_id'];
$pickup  = $_REQUEST['type'];
$game_id = $_REQUEST['game_id'];

$db->query("INSERT INTO events (number, pickup, game_id) VALUES ('$number', '$pickup', '$game_id')");
?>