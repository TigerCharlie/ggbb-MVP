<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
header('Content-Type: application/json; charset=utf-8');

if (isset($_POST['uuid'])){
	$uuid = $_POST['uuid'];
	$response = $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
	$response->execute(
		array('uuid' => $uuid)
	);
	
	if ($response->rowCount() > 0){
		while ($donnees = $response->fetch()) {
			$serverTimestamp = round(microtime(true)*1000);
			$shootTimestamp = strtotime($donnees['shoottime']);
			if (!$shootTimestamp){
				echo '{"serverTimestamp":'.$serverTimestamp.',"status_code":1,"status":"The shoot : \"'.$donnees['title'].'\". is not programmed yet.","title":"'.$donnees['title'].'","frames":'.$donnees['frames'].'}';
			} else {
				echo '{"serverTimestamp":'.$serverTimestamp.', "shootTime":'.$shootTimestamp.',"status_code":2,"status":"The shoot : \"'.$donnees['title'].'\". is programmed very soon.","title":"'.$donnees['title'].'","frames":'.$donnees['frames'].'}';
			}
		}
	} else {
		echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never received the uuid."}';
}
