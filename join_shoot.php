<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');

if (isset($_POST['title'])) {
	$title = $_POST['title'];
	$query = 'SELECT * FROM shoots WHERE title = :title AND active=1 LIMIT 1';
	$response= $bdd->prepare($query);
	$response->execute(
		array('title' => $title)
	);

	if ($response->rowCount() > 0) {
		while ($donnees = $response->fetch()) {
			$uuid = $donnees['uuid'];
			$frames = $donnees['frames']+1;
			$req = $bdd->prepare('UPDATE shoots SET frames = :frames WHERE uuid = :uuid');
			$req->execute(array(
				'uuid' => $uuid,
				'frames' => $frames
			));
			echo '{"status_code":1,"status":"You well joined the shoot named : \"'.$donnees['title'].'\". The creator will shoot soon !","title":"'.$title.'", "userFrame":'.$frames.',"uuid":"'.$uuid.'"}';
		}
	} else {
		echo '{"status_code":0,"status":"the shoot named \"'.$title.'\" doesn\'t exist.","title":"'.$title.'"}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never reveved the title."}';
}
