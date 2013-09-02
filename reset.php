<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
include("definitions.php");


$db = new mysqli("localhost", "root", "online", "hackference");
$db->query("TRUNCATE events");
$db->query("TRUNCATE hack_users");

?>
