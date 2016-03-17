<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
require "classes/AnimGif.php";

if (isset($_POST['uuid'])) {
	$uuid = $_POST['uuid'];
	$img_suffixe="";
	$query = 'SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1';
	$response= $bdd->prepare($query);
	$response->execute(
			array('uuid' => $uuid)
	);
	if ($response->rowCount() > 0) {
		while ($donnees = $response->fetch()) {
			$frames = $donnees['uploaded_frames'];
			$gif_frames = array();
			$durations = array();
			$thumbnail = '';
			for ($i = 1; $i <= $frames; $i++) {
				if ($i == 1) {
					$thumbnail = $uuid."-".$i.$img_suffixe.".jpg";
				}
				array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
				array_push($durations, 20);
			}

			for ($i = $frames-1; $i > 1; $i--) {
				array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
				array_push($durations, 20);
			}

			$anim = new GifCreator\AnimGif();
			$anim->create($gif_frames, $durations);
			$anim->save("img/".$uuid.".gif");

			$updateQuery = 'UPDATE shoots SET gif_done = :gif_done, thumbnail = :thumbnail, frames = :frames WHERE uuid = :uuid';
			$response = $bdd->prepare($updateQuery);
			$response->execute(array(
				'uuid' => $uuid,
				'gif_done' => 1,
				'thumbnail' => $thumbnail,
				'frames' => $frames
			));
			echo '{"status_code":1,"status":"gif generated !", "gifUrl":"img/'.$uuid.'.gif"}';
		}
	} else {
		echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
	}
} else {
	echo '{"status_code":-1,"status":"the server never received data (uuid)."}';
}
