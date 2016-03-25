<?php

//phpinfo();
//echo exec('C:\ffmpeg\bin\ffmpeg.exe ffmpeg -version');

echo exec('C:\ffmpeg\bin\ffmpeg.exe ffmpeg -f image2 -i img/o3kf8a-%01d.jpg -r 12 -vcodec mpeg4 -b 15000k video/test.mp4');

//echo exec('ffmpeg -version');
//fmpeg -f image2 -i c:/wamp/www/www/ggbb/img/o3kf8a-%01d.jpg -r 12 -vcodec mpeg4 -b 15000k c:/wamp/www/www/ggbb/video/test.mp4
//echo 'test';
?>

