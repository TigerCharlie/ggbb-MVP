<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
header('Content-Type: application/json; charset=utf-8');

if (isset($_POST['uuid'])){
	$uuid = $_POST['uuid'];
	$request = 'SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1';
	$response= $bdd->prepare($request);
	$response->execute(
		array('uuid' => $uuid)
	);
	if ($response->rowCount() > 0) {
		while ($donnees = $response->fetch()) {
			$gif_done = $donnees['gif_done'];
			if ($gif_done == 1) {
				echo '{"status_code":1,"status":"gif generated !", "gifUrl":"img/'.$uuid.'.gif"}';
			} else {
				echo '{"status_code":2,"status":"The gif is not generated yet !"}';
			}
		}
	} else {
		echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never received the uuid."}';
}
