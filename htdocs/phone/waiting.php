<?php
include("../definitions.php");

$number = $_POST['To'] == TWILIO_NUMBER ? $_POST['From'] : $_POST['To']; // need to cater for people phoning in t00
$player = $game->getPlayerByNumber($number);
if($player['status'] != $game::playerWaiting) {
    $game->setWaiting($player['number'], $player['game_id']);
    $game->displayPlayer($player['game_id'], $player['number'], $player['name']);
}

$count  = $game->getPlayersWaiting($player['game_id']);
$wait   = PLAYER_THRESHOLD - $count;

?>
<Response>
<?php if(!empty($name)):?>
    <Say voice="woman">Hello <?php echo $name;?></Say>
<?php endif;?>

<?php if($wait <= 0):?>
    <Say>Redirecting to game</Say>
    <Redirect method="POST">gather.php</Redirect>
<?php else:?>
    <Say voice="woman">Waiting for <?php echo $wait;?> more players to join. There are <?php echo $count;?> players waiting</Say>
    <Redirect method="POST"></Redirect>
<?php endif;?>
</Response>