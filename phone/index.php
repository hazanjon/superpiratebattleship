<?php 
include("../definitions.php");
	$digit  = $_POST['Digits'];
?>
<Response>
	<Gather action="" numDigits="1" method="POST" timeout="20">
	<?php
	 	
		if($digit == 5) {
		    echo "<Play>".URL."sounds/cannon.mp3</Play>";
		}
		elseif(($rnd = rand(1,100)) > 75) {
			if($rnd % 2 == 0) {
				$file = 'shivermetimbers.wav';
			}
			else {
				$file = 'yohoyoho.wav';
			}
			
			if(!empty($file)) {
				echo "<Play>".URL."sounds/{$file}</Play>";
			}
		}
	?>
	<Say>You pressed <?php echo $digit;?></Say>
	</Gather>
</Response>