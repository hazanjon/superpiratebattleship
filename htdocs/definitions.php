<?php 
DEFINE("PLAYER_THRESHOLD", 2);
DEFINE("URL", 'http'.(empty($_SERVER['HTTPS'])?'':'s').'://'.$_SERVER['SERVER_NAME'].'/');

DEFINE("TWILIO_NUMBER",  "+441708394044");
DEFINE("TWILIO_SID",     "AC196f6c8bd104144fd008d520be25a093");
DEFINE("TWILIO_AUTH",    "da468e3af39f5526eccea3c2debc501e");
DEFINE("TWILIO_VERSION", "2010-04-01");

$db = new mysqli("localhost", "pirate", "scurvydog", "spb");

/* old account
DEFINE("TWILIO_NUMBER",  "+441732601010");
DEFINE("TWILIO_SID",  	 "ACd049c35eea3ca0fbb84a8e9e74d9f57f");
DEFINE("TWILIO_AUTH", 	 "af92cb98c9a89fff692f63f8ceafc6a7");
DEFINE("TWILIO_VERSION", "2010-04-01");
//*/

//curts
DEFINE("PUSHER_KEY",     "8d6d30d2c32b3a486688");
DEFINE("PUSHER_SECRET",  "fb42114a6a9a99bf0896");
DEFINE("PUSHER_ID",      "53040");

//jons
/*
DEFINE("PUSHER_KEY", 		"1e9ea87d454c0d8532ee");
DEFINE("PUSHER_SECRET", 	"eb5337310123634b642a");
DEFINE("PUSHER_ID", 		"53218");
*/

DEFINE("PUSHER_CHANNEL", "private-channel");
include("../vendor/autoload.php");
include("gameController.php");
$game = new gameController($db);
?>