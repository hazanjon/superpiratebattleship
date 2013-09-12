<?php 
include("../config/config.php");

$db = new mysqli(DB_LOCATION, DB_USER, DB_PASS, DB_NAME);

include("../vendor/autoload.php");
include("gameController.php");
$game = new gameController($db);
?>