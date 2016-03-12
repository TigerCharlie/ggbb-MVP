<?php
// description
define('GGBB_TITLE', 'GifGifBangBang');
define('GGBB_DESCRIPTION', 'Shoot gifs with your friends and share !');


if ( file_exists($_SERVER['DOCUMENT_ROOT'].'/includes/local_config.php'))
{
	include($_SERVER['DOCUMENT_ROOT'].'/includes/local_config.php');
}else{
	include($_SERVER['DOCUMENT_ROOT'].'/includes/prod_config.php');
}


?>