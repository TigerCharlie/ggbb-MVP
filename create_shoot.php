<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

include('includes/db_connect.php');


if(isset($_POST['title'])){
	$title = $_POST['title'];

	if(isset($_POST['type'])){
		$type = $_POST['type'];
	}else{
		$type = 'undefined';
	}


	$uuid = base_convert(time(), 10, 36);

	$frames = 1;
	$active = 1;
	$uploaded_frames = 0;

	$q = $bdd->prepare("SELECT title FROM shoots WHERE title = :title AND active=1 LIMIT 1");
	$q->bindValue(':title', $title);
	$q->execute();


	if($q->rowCount() > 0){

		//echo 'le titre '.$title.' exist déjà'.mysql_num_rows($reponse);
		echo '{"status_code":0,"status":"The shoot named : '.$title.' already exist. Please choose another title or join the shoot."}';

	}else{

		$req = $bdd->prepare('INSERT INTO shoots(uuid, type, title, frames, active, uploaded_frames) VALUES(:uuid, :type, :title, :frames, :active, :uploaded_frames)');
		/*$req->execute(array(
		'uuid' => $uuid,
		'type' => $type,
		'title' => $title,
		'frames' => $frames,
		'active' => $active,
		'uploaded_frames' => $uploaded_frames
		));*/
		
		function escapeJsonString($value) {
		    # list from www.json.org: (\b backspace, \f formfeed)    
		    $escapers =     array("\\",     "/",   "\"",  "\n",  "\r",  "\t", "\x08", "\x0c");
		    $replacements = array("\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t",  "\\f",  "\\b");
		    $result = str_replace($escapers, $replacements, $value);
		    return $result;
		  }



		if (!$req->execute(array(
		'uuid' => $uuid,
		'type' => $type,
		'title' => $title,
		'frames' => $frames,
		'active' => $active,
		'uploaded_frames' => $uploaded_frames
		))) {
    		echo '{"status_code":-1,"status":"mysql execute error"}';
    		//die(mysql_error());
		} else{	

			echo '{"status_code":1,"status":"Le shoot named : '.$title.' is created.", "title":"'.$title.'", "userFrame":1 ,"uuid":"'.$uuid.'"}';
		}


		//echo 'Le shoot '.$title.' a bien été créé'.$uuid.' ::'.$q->rowCount();
		
	}
}else{	
	echo '{"status_code":-1,"status":"the server never reveved the title."}';
}
?>