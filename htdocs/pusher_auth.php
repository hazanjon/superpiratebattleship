<?php
    include("definitions.php");
    echo $game->authPusher($_POST['channel_name'], $_POST['socket_id']);
    exit();
?>