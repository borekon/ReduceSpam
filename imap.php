<?php
	//uncomment the host/protocol line and fill in correct username and password
	#######
	# localhost pop3 with and without ssl
	# $hostname="{localhost:995/pop3/ssl/novalidate-cert}";
	# $hostname="{localhost:110/pop3/notls}";

	# localhost imap with and without ssl
	# $hostname="{localhost:993/imap/ssl/novalidate-cert}";
	# $hostname="{localhost:143/imap/notls}";
	# $user="localuser";

	# localhost nntp with and without ssl
	# you have to specify an existing group, control.cancel should exist
	# $hostname="{localhost:563/nntp/ssl/novalidate-cert}control.cancel";
	# $hostname="{localhost:119/nntp/notls}control.cancel";

	######
	# web.de pop3 without ssl
	# $hostname="{pop3.web.de:110/pop3/notls}";
	# $user="kay.marquardt@web.de";

	#########
	# google with pop3 or imap
	# $hostname="{pop.gmail.com:995/pop3/ssl/novalidate-cert}";
	# $hostname="{imap.gmail.com:993/imap/ssl/novalidate-cert}";
	# $user="username@gmail.com";
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
