<html>
<head>
<title>Ascii</title>
<style>
body{
    font-family: "Lucida Console", Monaco, monospace;
    font-size:11px;
    line-height: 11px;
    letter-spacing: -0.35px;
}
</style>
</head>
<body>
<form action="<?echo $_SERVER['PHP_SELF'];?>" method="post">
    <input type="text" name="filename"><br>
    <input type="submit" name="submit" value="Create">
</form>
	<pre>
<?php

require 'classes/ascii.class.php';

$ascii = new Ascii();

if (isset($_POST['filename']) && !empty($_POST['filename'])) {
    $filename = $_POST['filename'];
    echo $filename.'<br>';
} else {   
    $filename = 'images/maison.jpg';
}


$percent = 0.4;
list($width, $height) = getimagesize($filename);
$new_width = $width * $percent;
$new_height = $height * $percent;


$image_p = imagecreatetruecolor($new_width, $new_height);
$image = imagecreatefromjpeg($filename);
imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_width, $new_height, $width, $height);

$text_img = $ascii->render($image_p);


$text_img_array = explode("\n", $text_img);

$im = imagecreatetruecolor(400, 400);

$white = imagecolorallocate($im, 255, 255, 255);
imagefill($im, 0, 0, $white);

$text_color = imagecolorallocate($im, 0, 0, 0);
//imagestring($im, 1, 5, 5,  $text_img, $text_color);


echo '<br>';
echo 'lignes :'.count($text_img_array);
echo 'colones :'.strlen($text_img_array[0]);
echo '<br>';
foreach ($text_img_array as &$value) {
    echo $value.'<br>';
}



$h = count($text_img_array)-1;
$w = strlen($text_img_array[0]);

$sizeh = 400/$w;
$sizev = 400/$h;

for($y=0;$y <$h;$y+=1){
   for($x=0;$x <$w;$x+=1){
            imagestring($im,4,$x*$sizeh,$y*$sizev, substr($text_img_array[$y],$x,1),$text_color);
    }
}

imagejpeg($im, 'images/simpletext.jpg', 90);


echo '<br>';
echo $text_img;

?> 
</pre>
</body>
</html>