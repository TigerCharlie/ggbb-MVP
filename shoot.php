<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
header('Content-Type: application/json; charset=utf-8');

if (isset($_POST['uuid'])) {
	$uuid = $_POST['uuid'];
	$response= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
	$response->execute(
		array('uuid' => $uuid)
	);

	if ($response->rowCount() > 0) {
		while ($donnees = $response->fetch()) {
			if ($donnees['frames']>1) {
				$shootTimestamp = time()+7;
				$shootTime = date('Y-m-d H:i:s',$shootTimestamp);

				$req = $bdd->prepare('UPDATE shoots SET shoottime = :shoottime WHERE uuid = :uuid');
				$req->execute(
					array(
						'uuid' => $uuid,
						'shoottime' => $shootTime
					)
				);
				$serverTimestamp = round(microtime(true)*1000);
				echo '{"serverTimestamp":'.$serverTimestamp.',"status_code":1,"status":"Shoot in 7 seconds !", "shootTime":'.$shootTimestamp.'}';
			} else {
				echo '{"status_code":2,"status":"You are alone... nobody joined the shoot : \"'.$donnees['title'].'\". make friends before shoot !"}';
			}
		}
	} else {
		echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never received the uuid."}';
}
