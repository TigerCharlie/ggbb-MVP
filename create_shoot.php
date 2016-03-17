<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');

if (isset($_POST['title'])) {
	$title = $_POST['title'];

	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	} else {
		$type = 'undefined';
	}

	$uuid = base_convert(time(), 10, 36);
	$frames = 1;
	$active = 1;
	$uploaded_frames = 0;

	$request = "SELECT title FROM shoots WHERE title = :title AND active=1 LIMIT 1";
	$query = $bdd->prepare($request);
	$query->bindValue(':title', $title);
	$query->execute();


	if ($query->rowCount() > 0) {
		echo '{"status_code":0,"status":"The shoot named : '.$title.' already exist. Please choose another title or join the shoot."}';
	} else {
		$insertRequest = 'INSERT INTO shoots(uuid, type, title, frames, active, uploaded_frames) VALUES(:uuid, :type, :title, :frames, :active, :uploaded_frames)';
		$insertQuery = $bdd->prepare($insertRequest);

		if (!$insertQuery->execute(array(
			'uuid' => $uuid,
			'type' => $type,
			'title' => $title,
			'frames' => $frames,
			'active' => $active,
			'uploaded_frames' => $uploaded_frames
		))) {
    		echo mysql_error();
		} else {
			echo '{"status_code":1,"status":"Le shoot named : '.$title.' is created.", "title":"'.$title.'", "userFrame":1 ,"uuid":"'.$uuid.'"}';
		}
	}
} else {
	echo '{"status_code":-1,"status":"the server never reveved the title."}';
}
