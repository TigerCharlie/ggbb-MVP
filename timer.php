<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

header('Content-Type: application/json; charset=utf-8');

include('includes/db_connect.php');

if(isset($_POST['uuid'])){
	$uuid = $_POST['uuid'];

	$reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
	$reponse->execute(array(
					'uuid' => $uuid
					));

	if($reponse->rowCount() > 0){
		//$donnees = $reponse->fetch();
		while ($donnees = $reponse->fetch())
		{
			$serverTimestamp = round(microtime(true)*1000);
			
			
			if($donnees['shoottime'] == '0000-00-00 00:00:00' or $donnees['shoottime'] == ''){
				echo '{"serverTimestamp":'.$serverTimestamp.',"status_code":1,"status":"The shoot : \"'.$donnees['title'].'\". is not programmed yet.","title":"'.$donnees['title'].'","frames":'.$donnees['frames'].',"test":"'.$donnees['shoottime'].'"}';
			}else{
				$shootTimestamp = strtotime($donnees['shoottime']);
				echo '{"serverTimestamp":'.$serverTimestamp.', "shootTime":'.$shootTimestamp.',"status_code":2,"status":"The shoot : \"'.$donnees['title'].'\". is programmed very soon.","title":"'.$donnees['title'].'","frames":'.$donnees['frames'].',"test":"'.$donnees['shoottime'].'"}';
			}
		}

	}else{
		//echo 'le shoot '.$title.' n\'exist pas';
		echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
	}
}else{	
	//echo 'le titre n\'a pas été transmi';
	echo '{"status_code":-1,"status":"the server never received the uuid."}';
}
?>