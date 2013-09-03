<?php 

include("../definitions.php");

$db 	 = new mysqli("localhost", "root", "online", "hackference");
$result  = $db->query("SELECT * FROM hack_users")->fetch_assoc();
$game_id = 1;//!empty($result['game']) ? $result['game']+1 : 1;
$from    = $_REQUEST['To']; // my twilio number
$number  = $_REQUEST['From']; // users number
$name    = 'PLAYER '.($result->num_rows + 1); // give them a name as we can't get it here

if($result->num_rows > PLAYER_THRESHOLD):?>
	<Response>
		<Hangup />
	</Response>
	
<?php else: 
$db->query("INSERT INTO hack_users (number, name, game_id, status) VALUES ('$number', '$name', '$game_id', '2')");
?>
<Response>
	<Say>Thankyou for joining superpiratebattleships</Say>
	<Say>You are <?php echo $name;?></Say>
	<Redirect method="POST">waiting.php</Redirect>
</Response>
<?php endif;?>