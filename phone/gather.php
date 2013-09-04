<?php 
include("../definitions.php");
include("../lib/pusher.php");
$id	    = $_POST['To'] == TWILIO_NUMBER ? $_POST['From'] : $_POST['To']; // need to cater for people phoning in too
$digit  = $_POST['Digits'];
$params = array('id'=>$id, 'button'=>$digit);
try{
	$pusher = new Pusher(PUSHER_KEY, PUSHER_SECRET, PUSHER_ID);
	$pusher->trigger(PUSHER_CHANNEL, 'keyPress_event', $params);
}
catch(Exception $e) {
	error_log("Pusher Exception : {$id} - {$digit}");
}

$result = $db->query("SELECT pickup FROM events WHERE pickup='end' LIMIT 1")->fetch_assoc();

if(!empty($result['pickup'])) {
	?>
		<Response>
			<Hangup />
		</Response>
	<?php
	
}
else {

$result = $db->query("SELECT pickup FROM events WHERE number='$id' AND status='0' LIMIT 1")->fetch_assoc();
$db->query("UPDATE events SET status=1 WHERE number='$id'");

?>
<Response>
	<Gather action="gather.php" numDigits="1" method="POST" timeout="60">
	<?php 
		$playRand = true;
		if(!empty($result['pickup']) && in_array($result['pickup'], array('coin','pickup','powerup'))) {
			echo "<Play>".URL."sounds/".$result['pickup'].".wav</Play>";
			$playRand = false;
		}
		
		if($digit == 5) {
		    echo "<Play>".URL."sounds/cannon.mp3</Play>";
		}
		elseif($playRand && rand(1,100) > 80) {
			switch(rand(1,4)) {
				case 1: $file = 'shivermetimbers.wav'; 	break;
				case 2: $file = 'yohoyoho.wav'; 		break;
				case 3: $file = 'yescurrvyscum.wav'; 	break;
				case 4: $file = 'keepyerwits.wav'; 		break;
				default: break;
			}
			
			if(!empty($file)) {
				echo "<Play>".URL."sounds/{$file}</Play>";
			}
		}	
	?>
	</Gather>
</Response>
<?php 
}
?>