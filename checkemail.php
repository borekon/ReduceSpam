<?php

	//updated by reducespam.org to remove dependancy on mysql database to use imap directly instead

	include 'imap.php';

	$email = '';
	if(isset($_GET['email'])){
		$email = ($_GET['email']);
    	echo join(",",getEmailIDs($email));
	}  
?>