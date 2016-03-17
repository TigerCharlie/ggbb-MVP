<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
require "classes/AnimGif.php";

if (isset($_FILES['file']) and !$_FILES['file']['error']) {
	if (isset($_POST['uuid']) && isset($_POST['frame'])) {
		$uuid = $_POST['uuid'];
		$frame = $_POST['frame'];
		$img_suffixe='';
		$fname = $uuid.'-'.$frame.'.jpg';
		$moved = move_uploaded_file($_FILES['file']['tmp_name'], "img/" . $fname);
		if ($moved) {
			$response= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
			$response->execute(
				array('uuid' => $uuid)
			);
			if ($response->rowCount() > 0) {
				while ($donnees = $response->fetch()) {
					$uploaded_frames = $donnees['uploaded_frames']+1;
					$frames =  $donnees['frames'];
					if ($uploaded_frames==$frames) {
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
						
						$req = $bdd->prepare('UPDATE shoots SET gif_done = :gif_done, thumbnail = :thumbnail WHERE uuid = :uuid');
						$req->execute(array(
							'uuid' => $uuid,
							'gif_done' => 1,
							'thumbnail' => $thumbnail
						));
						echo '{"status_code":2,"status":"image saved - gif generated !", "gifUrl":"img/'.$uuid.'.gif"}';
					} else {
						$req = $bdd->prepare('UPDATE shoots SET uploaded_frames = :uploaded_frames WHERE uuid = :uuid');
						$req->execute(array(
							'uuid' => $uuid,
							'uploaded_frames' => $uploaded_frames
						));
						echo '{"status_code":1,"status":"image well uploaded !","uploaded_frames":'.$uploaded_frames.'}';
					}
				}
			} else {
				echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
			}
		} else {
		  echo '{"status_code":0,"status":"image not saved :'.$moved.'"}';
		}
	} else {
		echo '{"status_code":-1,"status":"the server never received data (uuid+frame)."}';
	}
}
