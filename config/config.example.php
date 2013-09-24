<?php

//Game Settings
DEFINE("PLAYER_THRESHOLD", 2); // 1 - 4
DEFINE("URL", 'http'.(empty($_SERVER['HTTPS'])?'':'s').'://'.$_SERVER['SERVER_NAME'].'/');

//Database Settings

DEFINE("DB_LOCATION", "localhost");
DEFINE("DB_USER", "");
DEFINE("DB_PASS", "");
DEFINE("DB_NAME", "");


//Twilio Settings
DEFINE("TWILIO_NUMBER",  ""); //Phone number for twilio in the form +01234567890
DEFINE("TWILIO_SID",     "");
DEFINE("TWILIO_AUTH",    "");
DEFINE("TWILIO_VERSION", ""); //Date of the Twilio version

//Pusher Settings

DEFINE("PUSHER_KEY",     "");
DEFINE("PUSHER_SECRET",  "");
DEFINE("PUSHER_ID",      "");

DEFINE("PUSHER_CHANNEL", "private-channel"); //Name of the private pusher channel used to transfer data

?>