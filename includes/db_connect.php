<?php
    try
    {
      $bdd = new PDO('mysql:host='.GGBB_DB_HOST.';dbname='.GGBB_DB_NAME.';charset=utf8', GGBB_DB_USER, GGBB_DB_PASSWORD);
    }
    catch(Exception $e)
    {
        die('Erreur : '.$e->getMessage());
        //print_r($bdd->errorInfo());
    }
?>