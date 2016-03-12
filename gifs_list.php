<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('includes/config.php');

    $gif_per_page = 5;

    if(isset($_GET['page'])){
        $page = $_GET['page'];
    }else{
        $page = 1;
    }

    $offset = ($page-1)*$gif_per_page;

?>
<!doctype html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>gifs list on GifGifBangBang !</title>
        <meta name="description" content="Shoot gif with your friends and share !">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <link rel="stylesheet" href="css/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
        <script src="js/list-gif.js?<?php echo date('l jS \of F Y h:i:s A'); ?>"></script>

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
        <meta property="og:description" content="My gifs">
        
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
      
    <h1>Gif list</h1>
    <ul class="gif_list">
    <?php
    include('includes/db_connect.php');

    $reponse= $bdd->prepare('SELECT * FROM shoots WHERE gif_done = :gif_done AND active=1 ORDER BY timer DESC LIMIT '.$gif_per_page.' OFFSET '.$offset);
    $reponse->execute(array(
          'gif_done' => 1
          ));


    if($reponse->rowCount() > 0){
      while ($donnees = $reponse->fetch())
      {
        $thumbnail_url = 'img/'.$donnees['thumbnail'];

        if($donnees['type']=='alone'){
            $again_button='<a href="alone_mode_again.php?uuid='.$donnees['uuid'].'" class="btn">C</a>';
        }else{
            $again_button="";
        }

        echo '<li id="'.$donnees['uuid'].'"><a href="gif.php?uuid='.$donnees['uuid'].'"><figure><img src="'.$thumbnail_url.'" alt="'.$donnees['title'].'" ><figcaption>'.$donnees['title'].'</figcaption><button data-uuid="'.$donnees['uuid'].'" class="btn delete-gif" type="button">X</button>'.$again_button.'</figure></a></li>';
      }
    }else{
      echo '<li>No gif available</li>';
    }
    ?>
    </ul>
      <?php
        
        $count= $bdd->prepare('SELECT COUNT(*) FROM shoots WHERE gif_done = 1 AND active = 1');
        $count->execute();

        $page_max=ceil(intval($count->fetch()[0])/$gif_per_page);

        $uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);
        $base_url = 'http://' . $_SERVER['HTTP_HOST'] . $uri_parts[0];


        $pagination_list='';

        if($page>3){
            $pagination_list .= '<li><a href="'.$base_url.'?page=1">1</a></li>';
            if($page>4){
                $pagination_list .= '<li class="inter">...</li>';
            }
        }

        $pagination_min = $page-2;
        if($pagination_min<1){$pagination_min = 1;}

        $pagination_max = $page+2;
        if($pagination_max>$page_max){$pagination_max = $page_max;}

        for($i = $pagination_min; $i <= $pagination_max; $i++){
            if($i == $page){
                $pagination_list .= '<li class="active">'.$i.'</li>';
            }else{
                $pagination_list .= '<li><a href="'.$base_url.'?page='.$i.'">'.$i.'</a></li>';
            }
            
        }

        if($page<$page_max-3){
            if($page<$page_max-2){
                $pagination_list .= '<li class="inter">...</li>';
            }
            $pagination_list .= '<li><a href="'.$base_url.'?page='.$page_max.'">'.$page_max.'</a></li>';
        }

        echo '<div class="center pagination-container"><ul class="pagination">'.$pagination_list.'</ul></div>';
        
      ?>
    </div>  
    </body>

</html>