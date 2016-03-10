<!doctype html>
<?php

    try
    {
      $bdd = new PDO('mysql:host=camponthesbullet.mysql.db;dbname=camponthesbullet;charset=utf8', 'camponthesbullet', '7mnm9HSEvX49');
    }
    catch(Exception $e)
    {
        die('Erreur : '.$e->getMessage());
    }

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
          //$jpg_url = 'img/'.$donnees['uuid'].'-1.jpg';
          $jpg_url = 'img/'.$donnees['thumbnail'];
          $gif_img = '<img data-uuid="'.$uuid.'" id="gif-img" src="'.$gif_url.'">';
        }
      }else{
        $gif_img = 'No Gif here !!';
      }

    }
?>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo $gif_title; ?> - on GifGifBangBang !</title>


        <meta name="description" content="Shoot gifs with friends on GifGifBangBang !">

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
        <script src="js/embed.js?<?php echo date('l jS \of F Y h:i:s A'); ?>"></script>



        <link rel="icon" type="image/png" href="asset/favicon.png" />

        <?php $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?>
        <link rel="canonical" href="<?php echo $actual_link; ?>"/>

        <!--<meta property="fb:app_id"      content="406655189415060">-->
        <meta property="og:site_name"   content="GifGifBangBang">
        <meta property="og:url"         content="http://camponthemoon.com/bullet/<?php echo $gif_url; ?>">
        <meta property="og:title"       content="Shoot gifs with friends on GifGifBangBang !">
        <meta property="og:description" content="Shoot gifs with friends on GifGifBangBang !">

        
        <meta property="og:type"        content="video.other">
        <meta property="og:image"       content="http://camponthemoon.com/bullet/<?php echo $gif_url; ?>">
        <meta property="og:image:width"       content="400">
        <meta property="og:image:height"       content="400">
        
        <meta property="og:type"        content="video">
        <meta property="og:image"       content="http://camponthemoon.com/bullet/<?php echo $jpg_url; ?>">
        <meta property="og:image:width"       content="400">
        <meta property="og:image:height"      content="400">
        <!--<meta property="og:video"                content="http://www.camponthemoon.com/bullet/share/media/o1s0vz.mp4">-->

        <meta property="og:video:type"        content="application/x-shockwave-flash">
        <meta property="og:video:width"       content="400">
        <meta property="og:video:height"      content="400">

        <!--<meta name="twitter:account_id" content="1020383864" />-->
        <meta name="twitter:card"           content="player">
        <meta name="twitter:title"          content="Shoot gifs with friends on GifGifBangBang !">
        <meta name="twitter:creator"        content="@gifgifbangbang">
        <meta name="twitter:site"           content="@gifgifbangbang">
        <meta name="twitter:description"    content="Shoot gifs with friends on GifGifBangBang !">
        <meta name="twitter:image:src"      content="http://camponthemoon.com/bullet/<?php echo $jpg_url; ?>">
        <meta name="twitter:image"          content="http://camponthemoon.com/bullet/<?php echo $jpg_url; ?>">
        <meta name="twitter:domain"         content="camponthemoon.com">

        
        <meta name="twitter:player"         content="http://camponthemoon.com/bullet/">
        <meta name="twitter:player:width"   content="400">
        <meta name="twitter:player:height"  content="400">
        
        <!-- /twitter seo -->


        <meta name="description" content="<?php echo $gif_title; ?> - Shoot gifs with friends on GifGifBangBang !"/>
        <meta name="author" content="GifGifBangBang"/>
        <meta name="keywords" content="<?php echo $gif_title; ?>, Shoot, Bang, Gif, Animated GIF">
        <meta name="pinterest" content="nohover">
        
        <link rel="alternate" type="application/json+oembed" href="http://camponthemoon.com/bullet/json.php?uuid=<?php echo $uuid; ?>" title="Jeremie" />
        
    </head>
    <body id="embed">
    
    <div class="container" id="gif-container">
    <nav>
        <div class="share-btn">
        <a class="facebook-share" href="https://www.facebook.com/sharer.php?u=<?php echo $actual_link; ?>" target="_blank">Share on facebook</a>
        <a class="twitter-share" href="https://twitter.com/intent/tweet?url=<?php echo $actual_link; ?>" target="_blank">Share on Twitter</a>
        <a class="google-share" href="https://plus.google.com/share?url=<?php echo $actual_link; ?>" target="_blank">Share on Google+</a>
        <a class="link" id="link-btn" href="#">Get the Gif Link</a>
        <a class="embed" id="embed-btn" href="#">Get the embed code</a>
        </div>
    </nav>
    <header>
        <h1><?php echo $gif_title; ?></h1>
        <a href="http://www.camponthemoon.com/bullet/" class="logo-picto" target="_blank" title="GifGifBangBang !" >www.GifGifBangBang.com</a>
    </header>

        <a href="gif.php?uuid=<?php echo $uuid; ?>" target="_blank" title="<?php echo $gif_title; ?> - on GifGifBangBang !">
            <?php
              echo $gif_img;
            ?>
        </a>
    </div>   
    </body>

</html>