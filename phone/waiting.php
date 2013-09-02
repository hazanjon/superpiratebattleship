<?php
include("../definitions.php");

$db     = new mysqli("localhost", "root", "online", "hackference");
$number = $_POST['To'];
$result = $db->query("SELECT name, game_id as game FROM hack_users WHERE number='$number' ORDER BY id DESC LIMIT 1")->fetch_assoc();
$name   = !empty($result['name']) ? $result['name'] : '';
$game   = 1;//!empty($result['game']) ? $result['game'] : '';

$db->query("UPDATE hack_users SET status=3 WHERE number='$number' AND game_id='$game'");
$result = $db->query("SELECT COUNT(*) as users FROM hack_users WHERE status=3 AND game_id='$game'")->fetch_assoc();
$count  = !empty($result['users']) ? $result['users'] : 1;
$wait   = PLAYER_THRESHOLD - $count;

//error_log("WAIT: Name:$name - Game:$game - Wait:$wait - Count:$count - $number");

?>

<Response>
<?php if(!empty($name)):?>
	<Say voice="woman">Hello <?php echo $name;?></Say>
<?php endif;?>
	
<?php if($wait <= 0):
	include("../lib/pusher.php");
	try{
		$pusher = new Pusher(PUSHER_KEY, PUSHER_SECRET, PUSHER_ID);
		$params = array('id'=>$number, 'name'=>$name);
		$pusher->trigger(PUSHER_CHANNEL, 'newUser_event', $params);		
	}
	catch(Exception $e) {
		error_log("Pusher Exception newUser_event : {$game} - {$name} - {$number}");
	}
	error_log("Pusher newUser_event : {$game} - {$name} - {$number}");
?>
	<Say>Redirecting to game</Say>
	<Redirect method="POST">gather.php</Redirect>
<?php else:?>
	<Say voice="woman">Waiting for <?php echo $wait;?> more players to join. There are <?php echo $count;?> players waiting</Say>
    <Redirect method="POST"></Redirect>
<?php endif;?>
</Response>