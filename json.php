<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
include('includes/config.php');
include('includes/db_connect.php');
header('Content-Type: application/json; charset=utf-8');

$actual_link = $url_origin.''.$_SERVER['REQUEST_URI'];
if (isset($_GET['uuid'])) {
    $uuid = $_GET['uuid'];
    $query = 'SELECT * FROM shoots WHERE uuid = :uuid AND active=1 LIMIT 1';
    $response= $bdd->prepare($query);
    $response->execute(array(
      'uuid' => $uuid
    ));

    if ($response->rowCount() > 0) {
        while ($donnees = $response->fetch()) {
            $gif_title = $donnees['title'];
            $gif_url = 'img/'.$donnees['uuid'].'.gif';
            $jpg_url = 'img/'.$donnees['uuid'].'-1.jpg';
            $gif_img = '<li><img src="'.$gif_url.'"></li>';
            $json_content = '// 20160204174231';
            $json_content .= '//'.$actual_link;
            $json_content .= '{';
            $json_content .= '"width": 400,';
            $json_content .= '"author_url": "'.$url_origin.'",';
            $json_content .= '"title": "'.$gif_title.' - on GifGifBangBang !",';
            $json_content .= '"url": "'.$url_origin.'",';
            $json_content .= '"image": "'.$url_origin.'/'.$gif_url.'",';
            $json_content .= '"provider_url": "'.$url_origin.'",';
            $json_content .= '"provider_name": "'.GGBB_SITE_NAME.'",';
            $json_content .= '"author_name": "'.GGBB_SITE_NAME.'",';
            $json_content .= '"height": 400';
            $json_content .= '}';

            echo $json_content;
        }
    } else {
        $gif_img = '//no gif found';
    }
}
