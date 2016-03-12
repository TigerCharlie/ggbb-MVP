<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

if(isset($_FILES['file']) and !$_FILES['file']['error']){

	if( isset($_POST['uuid']) && isset($_POST['frame']) ){

		$uuid = $_POST['uuid'];
		$frame = $_POST['frame'];

		$fname = $uuid.'-'.$frame.'.jpg';


		$moved = move_uploaded_file($_FILES['file']['tmp_name'], "img/" . $fname);

	    //$moved = move_uploaded_file($_FILES["file"]["tmp_name"], "images/" . "myFile.txt" );

		if( $moved ) {
		  //echo "Successfully uploaded";
		  //echo '{"status_code":1,"status":"image saved"}';

		  include('includes/db_connect.php');

			$reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
			$reponse->execute(array(
							'uuid' => $uuid
							));

			if($reponse->rowCount() > 0){
			//$donnees = $reponse->fetch();
				while ($donnees = $reponse->fetch())
				{
					$uploaded_frames = $donnees['uploaded_frames']+1;
					$frames =  $donnees['frames'];

					$req = $bdd->prepare('UPDATE shoots SET uploaded_frames = :uploaded_frames WHERE uuid = :uuid');
					$req->execute(array(
					'uuid' => $uuid,
					'uploaded_frames' => $uploaded_frames
					));

					echo '{"status_code":1,"status":"image well uploaded !","uploaded_frames":'.$uploaded_frames.'}';

				}


			}else{
				//echo 'le shoot '.$title.' n\'exist pas';
				echo '{"status_code":0,"status":"the shoot '.$uuid.' doesn\'t exist."}';
			}


		} else {
		  echo '{"status_code":0,"status":"image not saved :'.$moved.'"}';
		}  


	}else{	
		echo '{"status_code":-1,"status":"the server never received data (uuid+frame)."}';
	} 
}
?>