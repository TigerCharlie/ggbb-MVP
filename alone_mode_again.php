<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<!doctype html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Gif Gif Bang Bang !</title>
        <meta name="description" content="Shoot gif with your friends and share !">
        <meta name="viewport" content="width=device-width, initial-scale=1">
       
        <link rel="stylesheet" href="css/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
        <script src="js/alone-again.js?<?php echo date('l jS \of F Y h:i:s A'); ?>"></script>


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

        <meta property="og:site_name"   content="GifGifBangBang">
        <meta property="og:url"         content="http://camponthemoon.com/bullet/">
        <meta property="og:title"       content="Gif Gif Bang Bang !">
        <meta property="og:description" content="<?php echo $gif_title; ?> - Shoot gif with your friends and share !">

        
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

        <a href="http://www.camponthemoon.com/bullet"><img class="logo" src="asset/gifgifbangbang.gif"></a>
    </header>
    
    <?php
      if(isset($_GET['uuid'])){
        $uuid = $_GET['uuid'];


        try
        {
          $bdd = new PDO('mysql:host=camponthesbullet.mysql.db;dbname=camponthesbullet;charset=utf8', 'camponthesbullet', '7mnm9HSEvX49');
        }
        catch(Exception $e)
        {
            die('Erreur : '.$e->getMessage());
        }

        $type = 'alone';
        $reponse= $bdd->prepare('SELECT * FROM shoots WHERE uuid = :uuid AND active = 1 AND type = :type LIMIT 1');
        $reponse->execute(array(
            'uuid' => $uuid,
            'type' => $type
            ));

        //var_dump($reponse);

        if($reponse->rowCount() > 0){

          $donnees = $reponse->fetch();
          /*
          echo "<pre>";
          echo $donnees['title'];
          //var_dump($donnees[0]);
          echo "</pre>";
          */
        ?>



        <div id="shot-box" class="shot-box" data-uuid="<?php echo $donnees['uuid'];  ?>" data-frames="<?php echo $donnees['frames']; ?>" data-title="<?php echo $donnees['title']; ?>">
        <div id="video-alert"></div>
        <div id="video-parameters"></div>
        <div id="result" class="transparent"><canvas id="canvas"></canvas></div>
        <div id="container-video" class="container-video">
          <video id="video" autoplay="autoplay"></video>
        </div>
      </div>


      <div id="form-container">
        <input  class="btn" type="button" id="buttonPlay" value="Start Now !"/>
      </div>
      <?php 
      if(isset($_GET['debug'])) {
          echo '<pre id="preLog" class="last">Loading…</pre>';
      }
      ?>




      <?php
      }else{
      ?>

      <h1>You can't continue this Gif !</h1>

      <?php
      }
      ?>
    
    <?php
      }
    ?>

      
    </div>  
    </body>

</html>