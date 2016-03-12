<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

	if( isset($_POST['uuid']) && isset($_POST['frame_speed']) ){

		$uuid = $_POST['uuid'];
		$frame_speed = $_POST['frame_speed'];

		if( isset($_POST['loop_type'])){
			$loop_type = $_POST['loop_type'];
		}else{
			$loop_type = 1;
		}

		if( isset($_POST['img_filter'])){
			$img_filter = $_POST['img_filter'];
		}else{
			$img_filter = 1;
		}

		if( isset($_POST['title'])){
			$title = $_POST['title'];
		}


		  include('includes/db_connect.php');

			$reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND gif_done=1 LIMIT 1');
			$reponse->execute(array(
							'uuid' => $uuid
							));

			if($reponse->rowCount() > 0){
			//$donnees = $reponse->fetch();
				while ($donnees = $reponse->fetch())
				{

					$frames =  $donnees['frames'];
					require "classes/AnimGif.php";

					$gif_frames = array();
					$durations = array();

					if($img_filter==2){

						for ($i = 1; $i <= $frames; $i++) {

							$im = imagecreatefromjpeg("img/".$uuid."-".$i.".jpg");

							if($im && imagefilter($im, IMG_FILTER_GRAYSCALE) && imagefilter($im, IMG_FILTER_CONTRAST, -30))
							{
							    imagejpeg($im, "img/".$uuid."-".$i."-bw.jpg", 80);
    							imagedestroy($im);
							}
							else
							{
							    echo '{"status_code":0,"status":"grayscale conversion failed !!"}';
							    exit();
							}
						}
						$img_suffixe="-bw";


					}elseif($img_filter==3){

						require 'classes/ascii.class.php';

						for ($i = 1; $i <= $frames; $i++) {


							$ascii = new Ascii();

							$percent = 0.4;
							//list($width, $height) = getimagesize("img/".$uuid."-".$i.".jpg");
							$new_width = round(400 * $percent);
							$new_height = round(400 * $percent);

							$image_p = imagecreatetruecolor($new_width, $new_height);
							$image = imagecreatefromjpeg("img/".$uuid."-".$i.".jpg");
							imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, 400, 400);

							$text_img = $ascii->render($image_p);

							$text_img_array = explode("\n", $text_img);

							

							$im = imagecreatetruecolor(400, 400);

							$white = imagecolorallocate($im, 255, 255, 255);
							imagefill($im, 0, 0, $white);

							$text_color = imagecolorallocate($im, 0, 0, 0);

							$h = count($text_img_array)-1;
							$w = strlen($text_img_array[0]);

							$sizeh = 400/$w;
							$sizev = 400/$h;

							
							for($y=0;$y <$h;$y+=1){
							   for($x=0;$x <$w;$x+=1){
							            imagestring($im,1,$x*$sizeh,$y*$sizev, substr($text_img_array[$y],$x,1),$text_color);
							    }
							}
							
							imagejpeg($im, "img/".$uuid."-".$i."-geek.jpg", 80);
							imagedestroy($im);

						}

						$img_suffixe="-geek";


					}else{
						$img_suffixe="";
					}

					for ($i = 1; $i <= $frames; $i++) {

						if($i == 1){
							$thumbnail = $uuid."-".$i.$img_suffixe.".jpg";
						}

						array_push($gif_frames, "img/".$uuid."-".$i.$img_suffixe.".jpg");
						array_push($durations, $frame_speed);
					}

					if($loop_type == 1){
						for ($i = $frames-1; $i > 1; $i--) {
							array_push($gif_frames, "img/".$uuid."-".$i.$img_suffixe.".jpg");
							array_push($durations, $frame_speed);
						}
					}


					$anim = new GifCreator\AnimGif();

					if($loop_type == 3){
						$anim->create($gif_frames, $durations, 3);
					}else{
						$anim->create($gif_frames, $durations);
					}

					$anim->save("img/".$uuid.".gif");

					if($title){
						
						$req = $bdd->prepare('UPDATE shoots SET title = :title, thumbnail = :thumbnail WHERE uuid = :uuid');
						$req->execute(array(
							'uuid' => $uuid,
							'title' => $title,
							'thumbnail' => $thumbnail
						));

					}else{

						$req = $bdd->prepare('UPDATE shoots SET thumbnail = :thumbnail WHERE uuid = :uuid');
						$req->execute(array(
							'uuid' => $uuid,
							'thumbnail' => $thumbnail
						));

					}

					echo '{"status_code":1,"status":"gif regenerated !", "gifUrl":"img/'.$uuid.'.gif"}';

				}

			}else{
				//echo 'le shoot '.$title.' n\'exist pas';
				echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist. Or the gif is not done yet !"}';
			}

	}else{	
		echo '{"status_code":-1,"status":"the server never received data (uuid+frame)."}';
	}
?>