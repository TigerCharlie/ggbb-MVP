<!doctype html>
<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

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
          //$jpg_url = 'img/'.$donnees['uuid'].'-1.jpg';
          $jpg_url = 'img/'.$donnees['thumbnail'];
          $gif_img = '<li><figure><img class="notmygif" src="asset/not-my-gif.gif"><img src="'.$gif_url.'"></figure></li>';
        }
      }else{
        $gif_img = '<li>No Gif here !!</li>';
      }

    }
?>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo $gif_title; ?> - on GifGifBangBang !</title>


        <meta name="description" content="Shoot and share gif with your friends on GifGifBangBang !">

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">



        <link rel="icon" type="image/png" href="asset/favicon.png" />
        <meta name="apple-mobile-web-app-title" content="Gif Gif Bang Bang !">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="mobile-web-app-capable" content="yes">

        <link rel="manifest" href="manifest.json">

        <!-- Chrome, Firefox OS and Opera -->
        <meta name="theme-color" content="#ff6000">
        <!-- Windows Phone -->
        <meta name="msapplication-navbutton-color" content="#ff6000">
        <!-- iOS Safari -->
        <meta name="apple-mobile-web-app-status-bar-style" content="#ff6000">


        <link rel="apple-touch-icon" sizes="57x57" href="asset/apple-touch-icon-57x57.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="asset/apple-touch-icon-114x114.png" />

        <link rel="apple-touch-icon" sizes="120x120" href="asset/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="320x480" href="asset/apple-touch-icon-320x480.png" />
        <link rel="apple-touch-icon" sizes="640x960" href="asset/apple-touch-icon-640x960.png" />
        <link rel="apple-touch-icon" sizes="640x1136" href="asset/apple-touch-icon-640x1136.png" />

        <link rel="apple-touch-startup-image" media="(device-width: 320px)" href="asset/apple-touch-startup-image-320x460.png">
        <link rel="apple-touch-startup-image" media="(device-width: 320px) and (-webkit-device-pixel-ratio: 2)" href="asset/apple-touch-startup-image-640x920.png">


        

        <?php $actual_link = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?>
        <link rel="canonical" href="<?php echo $actual_link; ?>"/>

        <!--<meta property="fb:app_id"      content="406655189415060">-->
        <meta property="og:site_name"   content="GifGifBangBang">
        <meta property="og:url"         content="http://camponthemoon.com/bullet/<?php echo $gif_url; ?>">
        <meta property="og:title"       content="<?php echo $gif_title; ?> - Shoot gif with your friends and share !">
        <meta property="og:description" content="<?php echo $gif_title; ?> - Shoot gif with your friends and share !">

        
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
        <meta name="twitter:title"          content="<?php echo $gif_title; ?> - on GifGifBangBang !">
        <meta name="twitter:creator"        content="@gifgifbangbang">
        <meta name="twitter:site"           content="@gifgifbangbang">
        <meta name="twitter:description"    content="Shoot and share gif with your friends on GifGifBangBang !">
        <meta name="twitter:image:src"      content="http://camponthemoon.com/bullet/<?php echo $jpg_url; ?>">
        <meta name="twitter:image"          content="http://camponthemoon.com/bullet/<?php echo $jpg_url; ?>">
        <meta name="twitter:domain"         content="camponthemoon.com">

        
        <meta name="twitter:player"         content="http://camponthemoon.com/bullet/">
        <meta name="twitter:player:width"   content="400">
        <meta name="twitter:player:height"  content="400">
        
        <!-- /twitter seo -->


        <meta name="description" content="<?php echo $gif_title; ?> - Shoot and share gif with your friends on GifGifBangBang !"/>
        <meta name="author" content="GifGifBangBang"/>
        <meta name="keywords" content="<?php echo $gif_title; ?>, Shoot, Bang, Gif, Animated GIF">
        <meta name="pinterest" content="nohover">
        
        <link rel="alternate" type="application/json+oembed" href="http://camponthemoon.com/bullet/json.php?uuid=<?php echo $uuid; ?>" title="Jeremie" />
        
    </head>
    <body>
    
    <div class="container">
    <header>
      <nav>
      <input type="checkbox" id="nav" /><label class="burger"  for="nav"><span></span><span></span><span></span></label>
      <ul>
        <li><a href="index.php">Homepage</a></li>
        <li><a href="together_mode.php">Together Mode</a></li>
        <li><a href="alone_mode.php">Alone Mode</a></li>
        <li><a href="gifs_list.php">All Gifs</a></li>
      </ul>
    </nav>
        <a href="<?php echo GGBB_URL;?>"><img class="logo" src="asset/gifgifbangbang.gif"></a>
    </header>
    <h1><?php echo $gif_title; ?></h1>
    <ul class="gif_list margin-bottom">
    <?php
      echo $gif_img;
    ?>
    </ul>
    <div id="form-container">
    <div class="share-btn">
        <a class="facebook-share" href="https://www.facebook.com/sharer.php?u=<?php echo $actual_link; ?>" target="_blank">Share on facebook</a>
        <a class="twitter-share" href="https://twitter.com/intent/tweet?url=<?php echo $actual_link; ?>" target="_blank">Share on Twitter</a>
        <a class="google-share" href="https://plus.google.com/share?url=<?php echo $actual_link; ?>" target="_blank">Share on Google+</a>
        <section class="form-block">
            <div><label for="iframe-embed-code">Iframe Embed</label></div>
            <div class="full-width"><input onClick="this.setSelectionRange(0, this.value.length)" type="text" class="form-control" id="iframe-embed-code" spellcheck="false" readonly="true" value="<iframe src=&quot;//camponthemoon.com/bullet/embed.php?uuid=<?php echo $uuid; ?>&quot; width=&quot;400&quot; height=&quot;400&quot; frameBorder=&quot;0&quot; class=&quot;gifgifbangbang-embed&quot; allowFullScreen></iframe><p><a href=&quot;http://camponthemoon.com/bullet/gif.php?uuid=<?php echo $uuid; ?>&quot;>via GifGifBangBang</a></p>"></div>
        </section>
    </div>

    </div>
    </div>
    </body>

</html>