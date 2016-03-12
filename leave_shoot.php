<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

include('includes/db_connect.php');


if(isset($_POST['uuid'])){
	$uuid = $_POST['uuid'];

	$reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
	$reponse->execute(array(
					'uuid' => $uuid
					));


	/*$reponse = $bdd->query('SELECT * FROM shoots WHERE title=$title');*/


	if($reponse->rowCount() > 0){
		//$donnees = $reponse->fetch();

		while ($donnees = $reponse->fetch())
		{	

			$uuid = $donnees['uuid'];
			$frames = $donnees['frames']-1;

			if($frames == 0){
				$active = 0;
			}else{
				$active = 1;
			}


			$req = $bdd->prepare('UPDATE shoots SET frames = :frames, active = :active WHERE uuid = :uuid');
			$req->execute(array(
					'uuid' => $uuid,
					'frames' => $frames,
					'active' => $active
					));
			
			echo '{"status_code":1,"status":"You well leaved the shoot named : \"'.$donnees['title'].'\". Bye bye !"}';
		}

	}else{

		//echo 'le shoot '.$title.' n\'exist pas';
		echo '{"status_code":0,"status":"the shoot named \"'.$title.'\" doesn\'t exist.","title":"'.$title.'"}';
	}
}else{	
	//echo 'le titre n\'a pas été transmi';
	echo '{"status_code":-1,"status":"the server never reveved the uuid."}';
}
?>