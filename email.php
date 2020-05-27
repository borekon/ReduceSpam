<?php


	//updated by reducespam.org to remove dependancy on mysql database to use imap directly instead

	include 'imap.php';

	$id = 0;
	if(isset($_GET['id'])){
		$id = ($_GET['id']);
	}
	if(isset($_GET['email'])){
		$email = strtolower(($_GET['email']));
	}

	$emailContent = getEmail($id);

	if(strpos(strtolower($emailContent['to']),$email) !== false){
		echo "<div class='to'> To: " . htmlspecialchars($emailContent['to']) . "</div>";
		echo "<div class='from'>From: " . htmlspecialchars($emailContent['from']) . "</div>";
		echo "<div class='subject'>Subject: " . htmlspecialchars($emailContent['subject']) . "</div>";
		echo "<div class='time'>" . htmlspecialchars($emailContent['date']) . "</div>";
		echo "<div class='msg'>" . nl2br($emailContent['body']) . "</div>";

	}
	else {
		echo "<html><head></head><body style='text-align:center;'><img src='http://2prong.com/bush.jpg' /> <br /> That's not going to work</body></html>";
	}
?>