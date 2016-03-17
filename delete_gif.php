<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');

if (isset($_POST['uuid'])) {
	$uuid = $_POST['uuid'];
	$request = 'DELETE FROM shoots WHERE uuid = :uuid';
	$query = $bdd->prepare($request);

	if (!$query->execute(array( 'uuid' => $uuid ))) {
		echo '{"status_code":-1,"status":"mysql execute error"}';
	} else {
		$mask = 'img/'.$uuid.'*.*';
		array_map('unlink', glob($mask));
		echo '{"status_code":1,"status":"gif deleted !"}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never received data (uuid)."}';
}