<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');
include('includes/db_connect.php');


if(isset($_POST['type'])){
	$type = $_POST['type'];
}else{
	$type = 'undefined';
}

if(isset($_POST['frames'])){
	$frames = $_POST['frames'];
}else{
	$frames = 2;
}

if( isset($_POST['uuid']) ){

	$uuid = $_POST['uuid'];
	//$img_suffixe="";

	ContinueShoot($uuid, $frames);

}else{

	if(isset($_POST['title'])){
		$title = $_POST['title'];
		CreateShoot($title, $type, $frames);
	}else{
		do {
		    $title = randomTitle();
		} while (CheckIfTitleExist($title));
		CreateShoot($title, $type, $frames);		
	}
}

function moveImage($fileName, $imageName)
{
	$moved = move_uploaded_file($_FILES[$fileName]['tmp_name'], "img/" . $imageName);
	if($moved) {
		return true;
	}else{
		return false;
	}
}

function moveImages($frames, $uuid, $frames_offset)
{
	for ($i = 0; $i < $frames; $i++) {
		$fname = $uuid.'-'.round($frames_offset+$i+1).'.jpg';
		$fileName = 'file'.$i;
		//$moved = move_uploaded_file($_FILES['file']['tmp_name'], "img/" . $fname);
		if(!moveImage($fileName, $fname)){
			return false;
		}
	}
	return true;
}

function randomTitle()
{
	$title_list = array("amen", "boot", "beer", "bike", "boob", "boat", "body", "butt", "buzz", "cake", "calm", "camp", "card", "cats", "cook", "cool", "cops", "dada", "daft", "dali", "deep", "dojo", "drop");
	
	//var_dump($title_list[array_rand($title_list)]);
	return $title_list[array_rand($title_list)].''.rand(7, 77);
}

function CheckIfTitleExist($title)
{

	global $bdd;

	$q = $bdd->prepare("SELECT title FROM shoots WHERE title = :title AND active=1 LIMIT 1");
	$q->bindValue(':title', $title);
	$q->execute();

	if($q->rowCount() > 0){
		return true;
	}else{
		return false;
	}
}



function CreateShoot($title, $type, $frames)
{	

	$uuid = base_convert(time(), 10, 36);
	$active = 1;
	$uploaded_frames = $frames;

	global $bdd;

	$req = $bdd->prepare('INSERT INTO shoots(uuid, type, title, frames, active, uploaded_frames) VALUES(:uuid, :type, :title, :frames, :active, :uploaded_frames)');

		if (!$req->execute(array(
		'uuid' => $uuid,
		'type' => $type,
		'title' => $title,
		'frames' => $frames,
		'active' => $active,
		'uploaded_frames' => $uploaded_frames
		))) {
    		echo mysql_error();
    		//die(mysql_error());
		} else{	
			//echo '{"status_code":1,"status":"Le shoot named : '.$title.' is created.", "title":"'.$title.'", "userFrame":1 ,"uuid":"'.$uuid.'"}';
			if (moveImages($frames, $uuid,0)){

				$gif_frames = array();
				$durations = array();
				$img_suffixe="";

				for ($i = 1; $i <= $frames; $i++) {
					if($i == 1){
						$thumbnail = $uuid."-".$i.$img_suffixe.".jpg";
					}

					array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
					array_push($durations, 20);
				}

				for ($i = $frames-1; $i > 1; $i--) {
					array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
					array_push($durations, 20);
				}

				require "classes/AnimGif.php";
				$anim = new GifCreator\AnimGif();
				$anim->create($gif_frames, $durations);
				$anim->save("img/".$uuid.".gif");

				$req = $bdd->prepare('UPDATE shoots SET gif_done = :gif_done, thumbnail = :thumbnail WHERE uuid = :uuid');
				$req->execute(array(
				'uuid' => $uuid,
				'gif_done' => 1,
				'thumbnail' => $thumbnail
				));

				echo '{"status_code":1,"status":"gif generated !", "gifUrl":"img/'.$uuid.'.gif", "title":"'.$title.'", "uuid":"'.$uuid.'"}';


			}else{
				echo '{"status_code":0,"status":"Images can NOT be moved.","uuid":"'.$uuid.'"}';
			}
			
			//$moved = move_uploaded_file($_FILES['file']['tmp_name'], "img/" . $fname);

		}
}


function ContinueShoot($uuid, $frames)
{

	global $bdd;


	$q = $bdd->prepare("SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1");
	$q->bindValue(':uuid', $uuid);
	$q->execute();

	if($q->rowCount() > 0){
	
		while ($donnees = $q->fetch())
		{
			$title = $donnees['title'];
			$frames_offset =  $donnees['uploaded_frames'];
			$total_frames = $frames + $frames_offset;
			//echo '{"status_code":1,"status":"Le shoot named : '.$title.' is created.", "title":"'.$title.'", "userFrame":1 ,"uuid":"'.$uuid.'"}';
			if (moveImages($frames, $uuid, $frames_offset)){

				$gif_frames = array();
				$durations = array();
				$img_suffixe="";

				for ($i = 1; $i <= $total_frames; $i++) {
					if($i == 1){
						$thumbnail = $uuid."-".$i.$img_suffixe.".jpg";
					}

					array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
					array_push($durations, 20);
				}

				for ($i = $frames-1; $i > 1; $i--) {
					array_push($gif_frames, "img/".$uuid."-".$i.".jpg");
					array_push($durations, 20);
				}

				require "classes/AnimGif.php";
				$anim = new GifCreator\AnimGif();
				$anim->create($gif_frames, $durations);
				$anim->save("img/".$uuid.".gif");

				$req = $bdd->prepare('UPDATE shoots SET frames = :frames, uploaded_frames = :uploaded_frames WHERE uuid = :uuid');

				if (!$req->execute(array(
				'uploaded_frames' => $total_frames,
				'frames' => $total_frames,
				'uuid' => $uuid
				))) {
    					echo mysql_error();
    			}else{

    				echo '{"status_code":1,"status":"gif generated !", "gifUrl":"img/'.$uuid.'.gif", "title":"'.$title.'", "uuid":"'.$uuid.'"}';

    			}

				
			}else{
				echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
			}
		}

	}
}
		
?>