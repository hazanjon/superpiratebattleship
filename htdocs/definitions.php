<?php 
include($_SERVER['DOCUMENT_ROOT']."/../config/config.php");
include($_SERVER['DOCUMENT_ROOT']."/../vendor/autoload.php");
include("gameController.php");

$db   = new mysqli(DB_LOCATION, DB_USER, DB_PASS, DB_NAME);
$game = new gameController($db);
?>