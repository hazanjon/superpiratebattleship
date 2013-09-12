<?php 
include("../definitions.php");

$number = $_POST['To'] == TWILIO_NUMBER ? $_POST['From'] : $_POST['To']; // need to cater for people phoning in too
$digit  = $_POST['Digits'];
$player = $game->getPlayerByNumber($number);
$game->keyPress($player['game_id'], $player['number'], $digit);

if($game->hasEnded($player['game_id'])) {
    echo "<Response><Hangup /></Response>";
    exit();
}
else {?>
<Response>
    <Gather action="gather.php" numDigits="1" method="POST" timeout="60">
    <?php
        // only play a random noise if there's no pickup noise 
        $playRand = true;
        if($pickup = $game->getPickup($player['game_id'], $player['number'])) {
            echo "<Play>".URL."res/sounds/{$pickup}.wav</Play>";
            $playRand = false;
        }
        
        if($digit == 5) {
            echo "<Play>".URL."res/sounds/cannon.mp3</Play>";
        }
        elseif($playRand && rand(1,100) > 85) {
            switch(rand(1,4)) {
                case 1: $file = 'shivermetimbers.wav';  break;
                case 2: $file = 'yohoyoho.wav';         break;
                case 3: $file = 'yescurrvyscum.wav';    break;
                case 4: $file = 'keepyerwits.wav';      break;
                default: break;
            }
            
            if(!empty($file)) {
                echo "<Play>".URL."res/sounds/{$file}</Play>";
            }
        }
    ?>
    </Gather>
</Response>
<?php 
}
?>