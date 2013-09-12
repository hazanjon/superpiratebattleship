<?php
include("../definitions.php");

if(!empty($_POST['Digits'])) {
    $game_id = $db->real_escape_string($_POST['Digits']);
    // check this game exists
    if($game->exists($game_id)) {
        // check how many players in this game
        if($name = $game->getPlayerName($game_id)) {
            // add to game
            $number   = $_POST['From'];
            $response = "<Say>Thankyou for joining superpiratebattleships</Say><Say>You are $name</Say><Redirect method=\"POST\">waiting.php</Redirect>";
            $game->createPlayer($number, $name, $game_id);
        }
        else {
            // too many players - deny
            $response = "<Say>There are too many people in this game already</Say><Hangup />";
        }
    }
    else {
        $response = "<Say>This game was not found, sorry!</Say><Hangup />";
    }
}
else {
    $response = "<Gather method=\"POST\" action=\"\" numDigits=\"4\" timeout=\"60\"><Say loop=\"10\">Please enter your four digit code</Say></Gather>";
}

echo "<Response>{$response}</Response>";
