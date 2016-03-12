<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

	if( isset($_POST['uuid']) ){

		$uuid = $_POST['uuid'];

	  	include('includes/db_connect.php');

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