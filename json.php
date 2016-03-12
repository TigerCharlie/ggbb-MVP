<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

header('Content-Type: application/json; charset=utf-8');
    
    $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    include('includes/db_connect.php');


    if(isset($_GET['uuid'])){

     $uuid = $_GET['uuid']; 

      $reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1');
      $reponse->execute(array(
          'uuid' => $uuid
          ));

      if($reponse->rowCount() > 0){
        while ($donnees = $reponse->fetch())
        {
          $gif_title = $donnees['title'];
          $gif_url = 'img/'.$donnees['uuid'].'.gif';
          $jpg_url = 'img/'.$donnees['uuid'].'-1.jpg';
          $gif_img = '<li><img src="'.$gif_url.'"></li>';



            $json_content = '// 20160204174231';
            $json_content .= '//'.$actual_link;

            $json_content .= '{';
            $json_content .= '"width": 400,';
            $json_content .= '"author_url": "http://camponthemoon.com/",';
            $json_content .= '"title": "'.$gif_title.' - on GifGifBangBang !",';
            $json_content .= '"url": "http://camponthemoon.com/bullet/",';
            $json_content .= '"image": "http://camponthemoon.com/bullet/'.$gif_url.'",';
            $json_content .= '"provider_url": "http://camponthemoon.com/",';
            $json_content .= '"provider_name": "GifGifBangBang",';
            $json_content .= '"author_name": "GifGifBangBang",';
            $json_content .= '"height": 400';
            $json_content .= '}';

            echo $json_content;

        }
      }else{
        $gif_img = '//no gif found';
      }

    }
?>