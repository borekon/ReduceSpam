<?php
	//update this
	$hostname = '{mail.yourserver.org:143/notls}';
	$username = 'catch-all@yourserver.org';
	$password = 'yourpassword';
	
	function getEmailIDs($email){
		global $hostname, $username, $password;
		
		$emailIDs = array();
		$inbox = imap_open($hostname, $username, $password);
		
		/* grab emails */
		$emails = imap_search($inbox,'ALL');
		
		/* if emails are returned, cycle through each... */
		if($emails) {
			/* put the newest emails on top */
			rsort($emails);
			
			/* for every email... */
			foreach($emails as $email_number) {
		
				/* get information specific to this email */
				$overview = imap_fetch_overview($inbox,$email_number,0);
				if(strpos(strtolower($overview[0]->to) , $email.'@reducespam.org') !== false ){
					$emailIDs[] = $email_number;
				}
			}
		}
		
		/* close the connection */
		imap_close($inbox);
		
		return $emailIDs;
	}
	
	function getEmail($emailID){
		global $hostname, $username, $password;
	
		$inbox = imap_open($hostname, $username, $password);
		
		/* get information specific to this email */
		$overview = imap_fetch_overview($inbox,$emailID,0);
		
		//refer to http://stackoverflow.com/questions/5177772/how-to-use-imap-in-php-to-fetch-mail-body-content 
		$message = imap_fetchbody($inbox,$emailID,1);
		
		$emailContent = array(
							'subject' => ($overview[0]->subject),
							'to' => ($overview[0]->to),
							'from' => ($overview[0]->from),
							'date' => $overview[0]->date,
							'body' => quoted_printable_decode($message)//refer to http://stackoverflow.com/questions/19092161/php-imap-get-body-and-make-plain-text
						);
		
		/* close the connection */
		imap_close($inbox);
		
		return $emailContent;
	}
		
?>