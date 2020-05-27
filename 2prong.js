/*
2Prong.js
Copyright 2006 by Mark Percival - Percival Industries, LLC
*/
if (window.XMLHttpRequest){ // try to create XMLHttpRequest
	XMLReq = new XMLHttpRequest();
    XMLMail = new XMLHttpRequest();
    }
if (window.ActiveXObject) {	// if ActiveXObject use the Microsoft.XMLHTTP
	XMLReq = new ActiveXObject("Microsoft.XMLHTTP");
    XMLMail = new ActiveXObject("Microsoft.XMLHTTP");
    }
window.onload=kickStart;

var genEmail = '';
var checkMailURL = 'checkemail.php?email=';
var getMailURL = 'email.php?id=';
var recievedMail = new Array;
var emailidArray = new Array;
var position = 0;
var emailCount = 0;
var interval;
//var domain = 'iheartspam.org';
var domain = 'reducespam.org';//update this
var XMLerror = 0;

    
function kickStart() {
    setEmail();
    startAutoCheck(true);
}

function setEmail(){
    var regex = new RegExp(/\?email=(.+)/);
    var match = regex.exec(location.href);
    if(!match){
        location.href = '?email='+randomEmail(10);
    }
    else genEmail = match[1].substr(0,15);
    checkMailURL += genEmail;
    setHTML('emailaddress', '<span class="clickToSelect">' + genEmail +'@'+ domain + '</span>' + "<div class='custom'><a href='javascript:customemail()'>Custom Address</a></div>");
    copy(genEmail+"@"+domain);
    
    //updated 150610
    setHTML('emailaddressincontent', '<span class="clickToSelect">' + genEmail +'@'+ domain + '</span>');
    applyClickToSelectEvent();
}

function startAutoCheck(toggle) {
    if(toggle) {
        throbber(true,'Checking Mail');
        checkMail();
        interval = setInterval("checkMail()", 7000);
    }
    else clearInterval(interval);
}

function checkMail(){
    request(checkMailURL + '&c=' + Math.random(), checkMailProc);
}

function checkMailProc(){
    if (XMLReq.readyState==4 && XMLReq.status == 200) {
        if(XMLReq.responseText) emailidArray = XMLReq.responseText.split(",");
        if (emailidArray.length > emailCount) { 
            getMail(emailidArray[emailidArray.length - 1]);
            position = emailidArray.length;
            if(emailidArray.length>1) multiMail();
            }
        emailCount = emailidArray.length;
        if(error=1){ throbber(true,'Checking Mail'); error=0; }//reset throbber after error
    }
    else if (XMLReq.readyState==4 && XMLReq.status != 200) throbber(true,'Error connecting, retrying...');
}

function multiMail() {
    var navoutput='';
    if ((emailidArray.length >= position)&&(position!=1)) navoutput = "<a href='javascript:prevMail();'>Prev</a> ";
    else navoutput += "Prev ";
    navoutput += position +' of '+ emailidArray.length;
    if (emailidArray.length > position)navoutput += " <a href='javascript:nextMail();'>Next</a>";
    else navoutput += " Next";
    setHTML('emailnav', navoutput);
}

function prevMail(){
    getMail(emailidArray[position-2]);
    position--;
    multiMail();
}

function nextMail(){
    getMail(emailidArray[position]);
    position++;
    multiMail();
}

function getMail(emailid){
    requestMail('email.php?id='+emailid+'&email='+genEmail, getMailProc);
}

function getMailProc(){
    if (XMLMail.readyState==4) {
        XMLMail.responseText
        setHTML('content',XMLMail.responseText);
        startAutoCheck(false);
        throbber(false, "<a href='javascript:startAutoCheck(true);'>Check for new mail</a>");
        autolink('content');
        document.title = "ReduceSpam.org - New Email";
    }
}

function request(url, callfunc) {
	if (XMLReq.readyState < 1 || XMLReq.readyState > 3) {
        XMLReq.open("GET", url, true);
    	// Set the onreadystatechange function
    	XMLReq.onreadystatechange = callfunc;
    	// Send
    	XMLReq.send(null); 
    }
}

function requestMail(url, callfunc) {
	XMLMail.open("GET", url, true);
	// Set the onreadystatechange function
	XMLMail.onreadystatechange = callfunc;
	// Send
	XMLMail.send(null); 
}


function setHTML(div, data)
{
	document.getElementById(div).innerHTML = data;
}

function throbber(toggle, msg) {
    if(toggle) setHTML('status',msg+" <img src='throbber.gif' title='Throbber' />");
    if(toggle) document.title = "Reduce Spams";
    else setHTML('status',msg);
}

function randomEmail(length)
{
  chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  var email = "";
  for(x=0;x<length;x++)
  {
    i = Math.floor(Math.random()*36);
    email += chars.charAt(i);
  }
  return email;
}

function autolink(div) 
{   
    var hlink = /\s(ht|f)tp:\/\/([^ \,\:\!\)\(\"\'\<\>\f\n\r\t\v])+/g;
    document.getElementById(div).innerHTML = 
        document.getElementById(div).innerHTML.replace(hlink, function ($0){
            var s = $0
            if((s.charAt(s.length-1)=='.')||(s.charAt(s.length-1)==','))
                s = s.substring(0,s.length-1);
            return(s.link(s));
            }
         );
}


function customemail (submit) {
    if(submit) document.customemail.submit();
    else {setHTML('emailaddress',"\
        <form name='customemail' action='' method='get'><input name='email' class='email' type='text' size='8' onKeyPress='return letternumber(event)' />@" + domain
        +"<div class='custom'><a href='javascript:customemail(true)'>Submit</a></form>");
        document.customemail.email.select(); //in case its non-IE and no flash, you can still ctrl-c
        }

}

function letternumber(e)
{
var key;
var keychar;

if (window.event)
   key = window.event.keyCode;
else if (e)
   key = e.which;
else
   return true;
keychar = String.fromCharCode(key);
keychar = keychar.toLowerCase();

// control keys
if ((key==null) || (key==0) || (key==8) || 
    (key==9) || (key==13) || (key==27) )
   return true;

// alphas and numbers
else if ((("abcdefghijklmnopqrstuvwxyz0123456789").indexOf(keychar) > -1))
   return true;
else
   return false;
}

function copy(text2copy) {
   if (window.clipboardData) {
    window.clipboardData.setData("Text",text2copy);
  } else {
    var flashcopier = 'flashcopier';
    if(!document.getElementById(flashcopier)) {
      var divholder = document.createElement('div');
      divholder.id = flashcopier;
      document.body.appendChild(divholder);
    }
    document.getElementById(flashcopier).innerHTML = '';
    var divinfo = '<embed src="_clipboard.swf" FlashVars="clipboard='+escape(text2copy)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';
    document.getElementById(flashcopier).innerHTML = divinfo;
  }
}

function applyClickToSelectEvent(){
	$('.clickToSelect').click(function (){
		var range, selection;

    	if (window.getSelection && document.createRange) {
        	selection = window.getSelection();
        	range = document.createRange();
        	range.selectNodeContents($(this)[0]);
        	selection.removeAllRanges();
        	selection.addRange(range);
    	} else if (document.selection && document.body.createTextRange) {
        	range = document.body.createTextRange();
        	range.moveToElementText($(this)[0]);
        	range.select();
    	}
	});
}