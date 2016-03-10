<?php
header('Content-Type: application/json; charset=utf-8');

try
{
	$bdd = new PDO('mysql:host=camponthesbullet.mysql.db;dbname=camponthesbullet;charset=utf8', 'camponthesbullet', '7mnm9HSEvX49');
}
catch(Exception $e)
{
    die('Erreur : '.$e->getMessage());
}

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
			$gif_done = $donnees['gif_done'];
			if($gif_done==1){
				echo '{"status_code":1,"status":"gif generated !", "gifUrl":"img/'.$uuid.'.gif"}';
			}else{
				echo '{"status_code":2,"status":"The gif is not generated yet !"}';
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