<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php'); ?>

<!doctype html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo GGBB_TITLE; ?></title>
        <meta name="description" content="<?php echo GGBB_DESCRIPTION; ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
       
        <link rel="stylesheet" href="css/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">


        <link rel="icon" type="image/png" href="asset/favicon.png" />
        <meta name="apple-mobile-web-app-title" content="<?php echo GGBB_TITLE; ?>">
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


        <meta property="og:site_name"   content="<?php echo GGBB_SITE_NAME; ?>">
        <meta property="og:url"         content="<?php echo $url_origin; ?>">
        <meta property="og:title"       content="<?php echo GGBB_ON_TITLE; ?>">
        <meta property="og:description" content="<?php echo GGBB_DESCRIPTION; ?>">

        
    </head>
    <body>  
    <div class="container">
    <?php include('header.php'); ?>
      
    <h1>Shoot gif with your friends :</h1>
        <ul>
          <li><a class="btn center" href="create_together.php">Create a shoot</a></li>
          <li><a class="btn center" href="join_together.php">Join a shoot</a></li>
        </ul>
    <h1>Or shoot gif alone :</h1>
        <ul>
            <li><a class="btn center margin-bottom" href="alone_mode-video.php">from a video</a></li>
            <li><a class="btn center margin-bottom" href="alone_mode.php">frame by frame</a></li>
        </ul>  
    </div>  
    </body>

</html>