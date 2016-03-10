<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

	if( isset($_POST['uuid']) ){

		$uuid = $_POST['uuid'];

	  try
		{
			$bdd = new PDO('mysql:host=camponthesbullet.mysql.db;dbname=camponthesbullet;charset=utf8', 'camponthesbullet', '7mnm9HSEvX49');
		}
		catch(Exception $e)
		{
		    die('Erreur : '.$e->getMessage());
		}

		$req = $bdd->prepare('DELETE FROM shoots WHERE uuid = :uuid');

		if (!$req->execute(array( 'uuid' => $uuid ))) {
    		echo '{"status_code":-1,"status":"mysql execute error"}';
		} else{	

			$mask = 'img/'.$uuid.'*.*';
			array_map('unlink', glob($mask));

			echo '{"status_code":1,"status":"gif deleted !"}';
		}

	}else{	
		echo '{"status_code":-1,"status":"the server never received data (uuid)."}';
	}
?>