<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');
include('includes/db_connect.php');



if(isset($_POST['type'])){
	$type = $_POST['type'];
}else{
	$type = 'undefined';
}




function randomTitle()
{
	$title_list = array("amen", "boot", "beer", "bike", "boob", "boat", "body", "butt", "buzz", "cake", "calm", "camp", "card", "cats", "cook", "cool", "cops", "dada", "daft", "dali", "deep", "dojo", "drop");
	
	//var_dump($title_list[array_rand($title_list)]);
	return $title_list[array_rand($title_list)].''.rand(7, 77);
}

function CheckIfTitleExist($title)
{

	global $bdd;

	$q = $bdd->prepare("SELECT title FROM shoots WHERE title = :title AND active=1 LIMIT 1");
	$q->bindValue(':title', $title);
	$q->execute();

	if($q->rowCount() > 0){
		return true;
	}else{
		return false;
	}

}

	if(isset($_POST['title'])){
		$title = $_POST['title'];
		CreateShoot($title, $type);
	}else{
		do {
		    $title = randomTitle();
		} while (CheckIfTitleExist($title));
		CreateShoot($title, $type);		
	}

function CreateShoot($title, $type)
{	

	$uuid = base_convert(time(), 10, 36);

	$frames = 1;
	$active = 1;
	$uploaded_frames = 0;

	global $bdd;

	$req = $bdd->prepare('INSERT INTO shoots(uuid, type, title, frames, active, uploaded_frames) VALUES(:uuid, :type, :title, :frames, :active, :uploaded_frames)');


		if (!$req->execute(array(
		'uuid' => $uuid,
		'type' => $type,
		'title' => $title,
		'frames' => $frames,
		'active' => $active,
		'uploaded_frames' => $uploaded_frames
		))) {
    		echo mysql_error();
    		//die(mysql_error());
		} else{	
			echo '{"status_code":1,"status":"Le shoot named : '.$title.' is created.", "title":"'.$title.'", "userFrame":1 ,"uuid":"'.$uuid.'"}';
		}

}
		
?>