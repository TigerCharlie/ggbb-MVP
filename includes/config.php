<?php
// description
define('GGBB_TITLE', 'GifGifBangBang !');
define('GGBB_SITE_NAME', 'GifGifBangBang');
define('GGBB_DESCRIPTION', 'Shoot gifs with your friends and share !');
define('GGBB_ON_TITLE', 'on GifGifBangBang !');
define('GGBB_SITE_ORIGIN', '@gifgifbangbang');

define('GGBB_KEYWORDS', 'Shoot, Bang, Gif, Animated GIF');

if ( file_exists($_SERVER['DOCUMENT_ROOT'].'/includes/local_config.php'))
{
	include($_SERVER['DOCUMENT_ROOT'].'/includes/local_config.php');
}else{
	include($_SERVER['DOCUMENT_ROOT'].'/includes/prod_config.php');
}


function url_origin( $s, $use_forwarded_host = false )
{
    $ssl      = ( ! empty( $s['HTTPS'] ) && $s['HTTPS'] == 'on' );
    $sp       = strtolower( $s['SERVER_PROTOCOL'] );
    $protocol = substr( $sp, 0, strpos( $sp, '/' ) ) . ( ( $ssl ) ? 's' : '' );
    $port     = $s['SERVER_PORT'];
    $port     = ( ( ! $ssl && $port=='80' ) || ( $ssl && $port=='443' ) ) ? '' : ':'.$port;
    $host     = ( $use_forwarded_host && isset( $s['HTTP_X_FORWARDED_HOST'] ) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset( $s['HTTP_HOST'] ) ? $s['HTTP_HOST'] : null );
    $host     = isset( $host ) ? $host : $s['SERVER_NAME'] . $port;
    return $protocol . '://' . $host;
}

$url_origin = url_origin( $_SERVER );


?>