/* main.js
 * GifGifBangBang
 * V 0.1
 * Jérémie Bersani
 *
 */

window.onload = function()
  {
  var url = window.location.href
  var urlArr = url.split("/");
  var baseUrl = urlArr[0] + "//" + urlArr[2];

  var shootTitle = '';
  var shootId = '';
  var shooterId ;
  var isReadyToShoot = false;
  
  var type = 'together';

  var shootTime;
  var DeltaTime;
  var serverTime;

  var countDownTimeout;
  var checkShootTimeout;
  var checkGifTimeout;

  var gifFrames = 0;
  var gifTitle = '';
  var frameSpeed = 20;
  var loopType = 1;
  var imgFilter = 1;

  var countdown;

  var gifOwner = false;

  var shotBox = document.getElementById('shot-box');

  var video = document.getElementById('video');

  var videoAlert = document.getElementById('video-alert');

  var videoParameters = document.getElementById('video-parameters');

  var videoContainer = document.getElementById("container-video");

  var buttonPlay;
  var buttonSnap;
  //console.log(video);

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  /*var microCanvas = document.getElementById('micro-canvas');
  var microCtx = microCanvas.getContext('2d');*/

  var videoStream = null;
  var preLog = document.getElementById('preLog');


  var videoSelect;

  var resizeTimeout;

  window.addEventListener('resize', function(event){
    clearTimeout(resizeTimeout);
    resizeTimeout= setTimeout(function() {
        afterResize();
    }, 200);
  });

  function afterResize() {
    log('after resize');
    var video = document.getElementById('video');
    if(video){
      resizeVideo();
    }
  }

  video.addEventListener( "loadedmetadata", function (e) {
    //shotBox.style.display = "block";
    resizeVideo();
  }, false );

  video.addEventListener("play", function (e) {
    //shotBox.style.display = "block";
    log('video is playing');
    document.getElementById('target').style.display='block';
    window.scrollTo(0, 45);

    showHidePlayButton(video);
  }, false );

  // enable vibration support
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  // enable getUserMedia
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  // dataURL to Blob
  function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }

  // Converts canvas to an image
  function convertCanvasToImage(canvas) {
      var image = new Image();
      image.src = canvas.toDataURL("image/jpeg", 0.85);
      return image;
  }
  
  function checkIfGifIsGenerated(){

    var data = new FormData();
    data.append('uuid', shootId);

    ajaxCall('check_gif.php', data).then(function(response) {
      // Code depending on result

      if(response !== null && typeof response === 'object'){

        if(response.status_code==1){
          showFinalGif(response.gifUrl);
        }else{
          showAlertMessage(false,response.status);
          checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
        }
      }

    }).catch(function() {
      log('bug!bug!bug!');
    });

  }


  function showAjustGifButton(){
    var htmlContent = '<input id="buttonAjustGif" class="btn nomargin ajust-gif" type="button" value="Ajust gif">';
    videoParameters.innerHTML = htmlContent;
    var buttonAjustGif = document.getElementById('buttonAjustGif');
    if(buttonAjustGif){
      buttonAjustGif.addEventListener("click", function(event){ event.preventDefault();  showAjustGifForm(); });
    }
  }

  function showRefreshGifButton(){
    var htmlContent = '<input id="buttonRefreshGif" class="btn nomargin" type="button" value="Refresh gif">';
    videoParameters.innerHTML = htmlContent;
    var buttonRefreshGif = document.getElementById('buttonRefreshGif');
    if(buttonRefreshGif){
      buttonRefreshGif.addEventListener("click", function(event){ event.preventDefault();  RefreshGif(); });
    }
  }

  function RefreshGif(){

    var finalGif = document.getElementById('finalGif');
    var previousGifSrc = finalGif.src;
    if(previousGifSrc.indexOf('?')>0){
      finalGif.src = '';
      finalGif.src = previousGifSrc.substring(0, previousGifSrc.indexOf('?'))+'?'+Math.floor((Math.random() * 10000) + 1);
    }else{
      finalGif.src = '';
      finalGif.src = previousGifSrc+'?'+Math.floor((Math.random() * 10000) + 1);
    } 
  }
  
  function ajaxCall(url, data){

    return new Promise(function(resolve, reject) {

      var request = new XMLHttpRequest();
      request.open('POST', url, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          
          var response = JSON.parse(request.responseText);
          log(response);
          //return response;

          resolve(response);

        } else {
          // We reached our target server, but it returned an error
          //return;
          log('server returns an error');
          reject;
        }
      };

      request.onerror = function() {
        // There was a connection error of some sort
        //return;
        log('XMLHttpRequest error');
        reject;
      };

      request.send(data);

    });
  }



  function showAjustGifForm(){

    log('showAjustGifForm');

    var htmlContent = '<a id="buttonCloseAjustForm" class="close-btn" href="#">Close</a>';

    htmlContent += '<section class="form-block">';
    htmlContent += '<div><label for="imgFilter">Filter</label></div>';
    htmlContent += '<div class="full-width"><select class="select white" id="imgFilter">';

    switch(imgFilter) {
    case 1:
        htmlContent +='<option value="1" selected >No filter</option><option value="2">Black and white</option><option value="3">I\'m a geek</option>';
        break;
    case 2:
        htmlContent +='<option value="1">No filter</option><option value="2" selected >Black and white</option><option value="3">I\'m a geek</option>';
        break;
    case 3:
    htmlContent +='<option value="1">No filter</option><option value="2">Black and white</option><option value="3"  selected >I\'m a geek</option>';
    break;
    default:
        htmlContent +='<option value="1" selected >No filter</option><option value="2">Black and white</option><option value="3">I\'m a geek</option>';
    }

    htmlContent += '</select></div></section>';


    htmlContent += '<section class="form-block">';
    htmlContent += '<div><label for="loopMode">Loop mode</label></div>';
    htmlContent += '<div class="full-width"><select class="select white" id="loopMode">';

    switch(loopType) {
    case 1:
        htmlContent +='<option value="1" selected >Go and back</option><option value="2">Infinite loop</option> <option value="3">3 loops</option>';
        break;
    case 2:
        htmlContent +='<option value="1" >Go and back</option><option value="2" selected >Infinite loop</option> <option value="3">3 loops</option>';
        break;
    case 3:
        htmlContent +='<option value="1">Go and back</option><option value="2">Infinite loop</option> <option value="3" selected >3 loops</option>';
        break;
    default:
        htmlContent +='<option value="1" selected >Go and back</option><option value="2">Infinite loop</option> <option value="3">3 loops</option>';
    }

    htmlContent += '</select></div></section>';
    htmlContent += '<section class="form-block">';
    htmlContent += '<div><label for="frameSpeed">Images duration</label></div>';
    htmlContent += '<div class="full-width"><input class="form-control" type="text" id="frameSpeed" value="'+frameSpeed+'" /></div></section>';
    htmlContent += '<section class="form-block">';
    htmlContent += '<div><label for="gifTitle">Gif Title</label></div>';
    htmlContent += '<div class="full-width"><input class="form-control" type="text" id="gifTitle" value="'+gifTitle+'" /></div></section>';
    htmlContent += '<input  class="btn nomargin center" type="button" id="buttonRegenerateGif" value="Regenerate Gif" />';
    
    videoParameters.innerHTML = htmlContent;

    var frameSpeedInput = document.getElementById('frameSpeed');
    frameSpeedInput.addEventListener("change",  function changeFrameSpeed(){ frameSpeed = parseInt(frameSpeedInput.value);  });

    var loopModeSelect = document.getElementById('loopMode');
    loopModeSelect.addEventListener("change",  function changeLoopMode(){ loopType = parseInt(loopModeSelect.value);  });

    var imgFilterSelect = document.getElementById('imgFilter');
    imgFilterSelect.addEventListener("change",  function changeFilter(){ imgFilter = parseInt(imgFilterSelect.value);  });

    var gifTitleSelect = document.getElementById('gifTitle');
    gifTitleSelect.addEventListener("change",  function changeFilter(){ gifTitle = gifTitleSelect.value;  });


    var buttonCloseAjustForm = document.getElementById('buttonCloseAjustForm');
    if(buttonCloseAjustForm){
      buttonCloseAjustForm.addEventListener("click", function(event){ event.preventDefault();  showAjustGifButton(); });
    }

    var buttonRegenerateGif = document.getElementById('buttonRegenerateGif');
    if(buttonRegenerateGif){
      buttonRegenerateGif.addEventListener("click", function(event){ event.preventDefault();  regenerateGif(); });
    }

  }

  

  function regenerateGif(){

    var data = new FormData();


    data.append('uuid', shootId);
    data.append('frame_speed', frameSpeed);
    data.append('loop_type', loopType);
    data.append('img_filter', imgFilter);
    data.append('title', gifTitle);

    log('regenerateGif :'+frameSpeed);


    //var response=ajaxCall('ajust_gif.php', data);


    ajaxCall('ajust_gif.php', data).then(function(response) {
      // Code depending on result
      if(response !== null && typeof response === 'object'){

        if(response.status_code==1){
          RefreshGif();
          showAjustGifButton();
        }else{
          showAlertMessage(false,response.status);
        }

      }

    }).catch(function() {
      log('bug!bug!bug!');
    });


  }



  function showFinalGif(gifUrl){

    log('gif well done !');

    var htmlContent ='<img class="mygif" id="finalGif" src="'+gifUrl+'">';
    htmlContent +='<div id="video-alert"></div>';
    htmlContent +='<img class="notmygif" src="asset/not-my-gif.gif">';

    htmlContent +='<div id="video-parameters"></div>';
    shotBox.innerHTML = htmlContent;
    videoParameters = document.getElementById('video-parameters');

    if(gifOwner){
      showAjustGifButton();
    }else{
      showRefreshGifButton();
    }
     

    shotBox.className = "shot-box-end";

    showAlertMessage(true,'YEAAAAH !');


    var htmlContent = '<div class="share-btn"><a class="facebook-share" href="https://www.facebook.com/sharer.php?u='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on facebook</a>';
    htmlContent += '<a class="twitter-share" href="https://twitter.com/intent/tweet?url='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on Twitter</a>';
    htmlContent += '<a class="google-share" href="https://plus.google.com/share?url='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on Google+</a></div>';

    htmlContent += '<input  class="btn" type="button" id="buttonAnotherShoot" value="Make another Shoot !" />';
    document.getElementById('form-container').innerHTML = htmlContent;
    var buttonAnotherShoot = document.getElementById('buttonAnotherShoot');
    if(buttonAnotherShoot){
      buttonAnotherShoot.addEventListener("click", function reloadPage(event){  event.preventDefault(); location.reload();});
    }

  }




  function exportCanvas(){

    log('exportCanvas');

    var newImg = convertCanvasToImage(canvas);

    newImg.onload = function() {
      log('imgloaded');

      var result = document.getElementById("result");
      result.innerHTML = '';
      result.appendChild(newImg);

      videoParameters.style.display='none';

      var data = new FormData();
      //console.log(title);
      //data.append('title', title);
      data.append('uuid', shootId);
      data.append('frame', shooterId);

      var title = shootId+'-'+shooterId+'.jpg';

      //log('||'+shootId+'-'+shooterId+'||');

      data.append('file', dataURLToBlob(newImg.src), title);
      /// send image

      ajaxCall('save_img_and_generate_gif.php', data).then(function(response) {
        // Code depending on result

        if(response !== null && typeof response === 'object'){

          if(response.status_code==1){
            log('img well uploaded!');
            checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
          }else if(response.status_code==2){
            showFinalGif(response.gifUrl);
          }else{
            showAlertMessage(false,response.status);
            checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
          }
        }

      }).catch(function() {
        checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
        log('bug!bug!bug!');
      });

    };

  }


function leaveShoot(){

  log('joinShoot');

  var data = new FormData();
  data.append('uuid', shootId);

    ajaxCall('leave_shoot.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){
        log('response.status');
    }

  }).catch(function() {
    log('bug!bug!bug!');
  });

}


function joinShoot(){

  log('joinShoot');

  var data = new FormData();
  var exportInputTitle = document.getElementById("titleExport");
  var title = exportInputTitle.value;
  //console.log(title);
  data.append('title', title);

  ajaxCall('join_shoot.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){

      if(response.status_code==1){
        shootTitle = response.title;
        shootId = response.uuid;
        shooterId = response.userFrame;

        var p = document.createElement("p");
        p.className = "counter";
        p.id = "counter";
        var t = document.createTextNode(shooterId+' / '+shooterId);
        p.appendChild(t);

        videoParameters.appendChild(p);
        waitTheShoot();

        window.onbeforeunload = function(e) {
          leaveShoot();
          e = e || window.event;
          e.preventDefault = true;

          

          //e.cancelBubble = true;
          //e.returnValue = 'test';

          };

      }else{
        showAlertMessage(false,response.status);
      }
    }

  }).catch(function() {
    log('bug!bug!bug!');
  });

}

function updateCounter(){
  document.getElementById("counter").innerHTML = shooterId+' / '+gifFrames;
}



function showAlertMessage(good, alertText, hide){

  good = typeof good !== 'undefined' ? good : true;
  hide = typeof hide !== 'undefined' ? hide : false;

  if(hide){

    videoAlert.style.display = 'none';

  }else{

    if(good){
      videoAlert.style.background='rgba(0,100,0,0.7)';
    }else{
      videoAlert.style.background='rgba(238,0,0,0.7)';
    }

    videoAlert.innerHTML = alertText;
    videoAlert.style.display = 'block';

  }

}


function checkFrames(){

  var data = new FormData();
  data.append('uuid', shootId);

  var previousGifFrames = gifFrames;

  var clientTimestamp = Date.now(); 
  ajaxCall('timer.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){

      if(response.status_code==1){
        gifFrames = response.frames;

        if(gifFrames != previousGifFrames){
          updateCounter();
        }
        checkShootTimeout = window.setTimeout(checkFrames, 1000);

      }else if(response.status_code==2){


      }else{
        checkShootTimeout = window.setTimeout(checkFrames, 1000);
      }
    }

  }).catch(function() {
    checkShootTimeout = window.setTimeout(checkFrames, 1000);
    log('bug!bug!bug!');
  });

}


function checkShoot(){

  var data = new FormData();
  data.append('uuid', shootId);

  var previousGifFrames = gifFrames;

  var clientTimestamp = Date.now(); 
  ajaxCall('timer.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){

      if(response.status_code==1){
        gifFrames = response.frames;

        if(gifFrames != previousGifFrames){
          updateCounter();
        }
        showAlertMessage(true,response.status);
        checkShootTimeout = window.setTimeout(checkShoot, 1000);

      }else if(response.status_code==2){

        gifFrames = response.frames;

        if(gifFrames != previousGifFrames){
          updateCounter();
        }

        var nowTimeStamp = Date.now();
        DeltaTime = Math.round((nowTimeStamp - clientTimestamp)/2);
        serverTime = response.serverTimestamp+DeltaTime;
        shootTime = response.shootTime*1000;
        showAlertMessage(true,response.status);
        startFinalCountDown();
      }else{
        showAlertMessage(false,response.status);
      }
    }

  }).catch(function() {
    log('bug!bug!bug!');
  });

}

  //timer demo function with normal/self-adjusting argument
  function timer(adjust, morework)
  {
    //create the timer speed, a counter and a starting timestamp
    var speed = 50,
    counter = 0, 
    shownCountDown = 0,
    start = new Date().getTime();
      
    window.clearTimeout(countDownTimeout);


    //timer instance function
      function instance()
      {
        //if the morework flag is true
        //do some calculations to create more work
        if(morework)
        {
          for(var x=1, i=0; i<1000000; i++) { x *= (i + 1); }
        }
        
        //work out the real and ideal elapsed time
        var real = (counter * speed),
        ideal = (new Date().getTime() - start);
          
        //display the values
        /*form.ideal.value = real;
        form.real.value = ideal;*/
        //console.log(syncedServerTime.getTime() +' + '+ real);
        var goodTime = serverTime + real;

        countdown = shootTime-goodTime;

        if(counter==0){
          shownCountDown = Math.floor(countdown/1000);
          showAlertMessage(true,shownCountDown);
        }

        if(shownCountDown!=Math.floor(countdown/1000)){
          shownCountDown = Math.floor(countdown/1000);
          if(shownCountDown>0){
            showAlertMessage(true,shownCountDown);
          }
        }
        

        //log('countdown : '+countdown+' | ');
        //increment the counter
        counter++;


        if(countdown<0){
          window.clearTimeout(countDownTimeout);
          
          snapshot();

        }else{

            //calculate and display the difference
          var diff = (ideal - real);
          //form.diff.value = diff;

          //if the adjust flag is true
          //delete the difference from the speed of the next instance
          if(adjust)
          {
            countDownTimeout = window.setTimeout(function() { instance(); }, (speed - diff));
          }
          //otherwise keep the speed normal
          else
          {
            countDownTimeout = window.setTimeout(function() { instance(); }, speed);
          }

        }

      };
      
      //now kick everything off with the first timer instance
      countDownTimeout = window.setTimeout(function() { instance(); }, speed);
    }


function startFinalCountDown(){

  var buttonShoot = document.getElementById('buttonShoot');
  if(buttonShoot){
    var htmlContent = '';
    document.getElementById('form-container').innerHTML = htmlContent;
  }


  countdown = shootTime-serverTime;
  log('countdown : '+countdown+' | ');


  timer(true, true);

  /*shootTime;
  DeltaTime;
  serverTime;*/

}


function shoot(){
  var data = new FormData();
  data.append('uuid', shootId);

  var clientTimestamp = Date.now();
  ajaxCall('shoot.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){

      if(response.status_code==1){
        var nowTimeStamp = Date.now();
        DeltaTime = Math.round((nowTimeStamp - clientTimestamp)/2);
        serverTime = response.serverTimestamp+DeltaTime;
        shootTime = response.shootTime*1000;
        showAlertMessage(true,response.status);
        startFinalCountDown();
      }else{
        showAlertMessage(false,response.status);
      }
    }

  }).catch(function() {
    log('bug!bug!bug!');
  });

}

function waitTheShoot(){
  isReadyToShoot = true;

  showAlertMessage(true, 'You well joined the shoot named : "'+shootTitle+'". Wait a minute ! The creator will shoot soon !');
  var htmlContent = '';
  document.getElementById('form-container').innerHTML = htmlContent;

  checkShootTimeout = window.setTimeout(checkShoot, 1000);
}

function readyToShoot(){
  isReadyToShoot = true;
  showAlertMessage(true, 'Shoot well created. Invite people to join your shoot : '+shootTitle+'... and SHOOT!');

  var htmlContent = '<input  class="btn" type="button" id="buttonShoot" value="SHOOT!" />';
  document.getElementById('form-container').innerHTML = htmlContent;
  var buttonShoot = document.getElementById('buttonShoot');
  if(buttonShoot){
    buttonShoot.addEventListener("click",  function(event){ event.preventDefault();  shoot(); });
  }
}

function createShoot(){

  log('createShoot');

  var data = new FormData();

  var exportInputTitle = document.getElementById("titleExport");
  var title = exportInputTitle.value;

  gifTitle = title;

  data.append('title', title);
  data.append('type', type);
  

  ajaxCall('create_shoot.php', data).then(function(response) {
    // Code depending on result

    if(response !== null && typeof response === 'object'){

      if(response.status_code==1){
        shootTitle = response.title;
        shootId = response.uuid;
        shooterId = response.userFrame;

        var p = document.createElement("p");
        p.className = "counter";
        p.id = "counter";
        gifFrames = 1;
        var t = document.createTextNode(shooterId+' / '+gifFrames);
        p.appendChild(t);

        videoParameters.appendChild(p);
        gifOwner = true;
        checkShootTimeout = window.setTimeout(checkFrames, 1000);
        readyToShoot();
      }else{
        showAlertMessage(false,response.status);
      }
    }

  }).catch(function() {
    log('bug!bug!bug!');
  });

}

  function showJoinForm()
  {
    var htmlContent = '<section class="form-block"><div><label for="titleExport">Shoot title</label></div>';
    htmlContent += '<div class="full-width"><input class="form-control" type="text" id="titleExport" value="" /></div></section>';
    htmlContent += '<input  class="btn" type="button" id="buttonCreateShoot" value="Create Shoot" />';
    htmlContent += '<input  class="btn" type="button" id="buttonJoinShoot" value="Join Shoot" />';
  
    document.getElementById('form-container').innerHTML = htmlContent;

    var buttonCreateShoot = document.getElementById('buttonCreateShoot');
    if(buttonCreateShoot){
      buttonCreateShoot.addEventListener("click", function(event){ event.preventDefault();  createShoot(); });
    }

    var buttonJoinShoot = document.getElementById('buttonJoinShoot');
    if(buttonJoinShoot){
      buttonJoinShoot.addEventListener("click", function(event){ event.preventDefault();  joinShoot(); });
    }

  }


  function resizeVideo()
  {    
    var shotBoxWidth=document.getElementById('shot-box').clientWidth;
    var videoContainerSize=shotBoxWidth;

    var videoWidth=video.videoWidth;
    var videoHeight=video.videoHeight;
    
    if(videoWidth>videoHeight){
      
      var videoContainerwidth= Math.round(shotBoxWidth*(videoWidth/videoHeight));
      var videoContainerHeight=shotBoxWidth;
      var videoMarginTop=0;
      var videoMarginLeft= Math.round((shotBoxWidth-videoContainerwidth)/2);
    }else{

      var videoContainerwidth=shotBoxWidth;
      var videoContainerHeight= Math.round(shotBoxWidth/(videoWidth/videoHeight));
      var videoMarginLeft=0;
      var videoMarginTop= Math.round((shotBoxWidth-videoContainerHeight)/2);
    }

    log(videoContainerwidth+' / '+videoContainerHeight+' / '+videoMarginLeft+' / '+videoMarginTop);

    videoContainer.style.width = videoContainerwidth+"px";
    videoContainer.style.height = videoContainerHeight+"px";
    videoContainer.style.top = videoMarginTop+"px";
    videoContainer.style.left = videoMarginLeft+"px";

    /*$('.container-video').css( "width", videoContainerwidth+'px' );
    $('.container-video').css( "height", videoContainerHeight+'px' );
    $('.container-video').css( "top", videoMarginTop+'px' );
    $('.container-video').css( "left", videoMarginLeft+'px' );*/

  }


  function log(text)
  {
    if (preLog){
      preLog.textContent = (text) + "  ||  " + preLog.textContent;
      console.log(text);
    }else{ 
      console.log(text);
     // alert(text);
    }
  }

  function snapshot()
  {

    showAlertMessage(true,'Snap !!!');

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }


      canvas.width = 400;
      canvas.height = 400;

    if(video.videoWidth>video.videoHeight){

      var drawSize = video.videoHeight;
      var topDraw = 0;
      var leftDraw = Math.round((video.videoWidth-video.videoHeight)/2);

    }else{
      var drawSize = video.videoWidth;
      var topDraw = Math.round((video.videoHeight-video.videoWidth)/2);
      var leftDraw = 0;

    }

    //log('video.videoHeight : '+video.videoHeight);
    //log('drawSize : '+drawSize);

    var userAgent = navigator.userAgent.toLowerCase();

    if((userAgent.indexOf('firefox/43') > -1 || userAgent.indexOf('firefox/42') > -1) && userAgent.indexOf('android') > -1)
    {

      ctx.setTransform(1,0,0,-1,0,video.videoHeight-(drawSize/2));
       log('ff43 or ff42| V2');

    }else{
        log('not FF| V2');
        
    }

    try {
      //ctx.scale(1,-1);
      //ctx.drawImage(video, leftDraw, -100,drawSize,drawSize,0,0,400,400);
      //ctx.drawImage(video, leftDraw, topDraw,drawSize,drawSize,0,0,400,400);

      ctx.drawImage(video, leftDraw, topDraw,drawSize,drawSize,0,0,400,400);

    //ctx.drawImage(video,0,0);
    //log('drawImage'); 

    } catch (e) {

      log('bug firefox'+e);
      throw e;
    }

    exportCanvas();
    stopStream();
  }

  function noStream()
  {
    log('Access to camera was denied!');
  }

  function changeStream()
  {
    log('changeStream');
    stopStream();
    startStream();
  }

  function stopStream()
  {
    if (videoStream)
    {
      if (videoStream.stop) videoStream.stop();
      else if (videoStream.msStop) videoStream.msStop();
      videoStream.onended = null;
      videoStream = null;
    }
    if (video)
    {
      video.onerror = null;
      video.pause();
      if (video.mozSrcObject)
        video.mozSrcObject = null;
      video.src = "";
    }
  }

  function gotStream(stream)
  {
    videoStream = stream;
    log('Got stream.');
    showHidePlayButton(video);

    video.onerror = function ()
    {
      log('video.onerror');
      if (video) stop();
    };
    stream.onended = noStream;
    if (window.webkitURL) video.src = window.webkitURL.createObjectURL(stream);
    else if (video.mozSrcObject !== undefined)
    {//FF18a
      video.mozSrcObject = stream;
      video.play();
    }
    else if (navigator.mozGetUserMedia)
    {//FF16a, 17a
      video.src = stream;
      video.play();
    }
    else if (window.URL) video.src = window.URL.createObjectURL(stream);
    else video.src = stream;
  }


  function gotSources(sourceInfos) {

    for (var i = 0; i !== sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];
      var option = document.createElement('option');
      option.value = sourceInfo.id;
      log('||'+sourceInfo.id+'||');
      if (sourceInfo.kind === 'video') {
        option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
        videoSelect.appendChild(option);
      } else {
        console.log('Some other kind of source: ', sourceInfo);
      }
    }
  }

  function playVideo() {

    video.play();

  }

  function successCallback(stream) {
    gotStream(stream);
    window.stream = stream; // make stream available to console
    video.src = window.URL.createObjectURL(stream);
    video.play();
    
    log('successCallback');
  }

  function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
    log('errorCallback'+error);
  }

  function checkIfVideoIsPlaying(video) {
    if (video.paused) {
      log('Video is not Playing');
      return false;
    }else { 
      log('Video is Playing');
      return true;
    } 
  }

  function showHidePlayButton(video) {

    log('showHidePlayButton');

    if (checkIfVideoIsPlaying(video)) {
      if(buttonPlay){
        buttonPlay.style.display = "none";
        showAlertMessage(true, '', true);
      }
      if(!isReadyToShoot){
        showJoinForm();
      }
    }else{
      if(buttonPlay){

        showAlertMessage(true, 'Click on the start button to start the camera... Simple no ?');

        buttonPlay.style.display = "block";
      }
    }
  }



  function startStream()
  {


    buttonPlay = document.getElementById('buttonPlay');

    if(buttonPlay){
      buttonPlay.addEventListener("click", function(event){ event.preventDefault();  playVideo(); });
      buttonPlay.style.display = "none";
    }

    if (!navigator.getUserMedia) {
          log('getUserMedia not supported');
          showAlertMessage(false,'Your Browser is not cool enough to run this site please use Chrome, Firefox or Opera.');
    } else {

      if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
        //alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
        log('This browser does not support MediaStreamTrack.');
        var buttonChange = document.getElementById('buttonChange');
        if (typeof(buttonChange) != 'undefined' && buttonChange != null)
        {

        }else{
          videoParameters.innerHTML = '<button class="btn nomargin camera-switch" type="button" id="buttonChange" >Change camera</button>';
          var buttonChange = document.getElementById('buttonChange');
          buttonChange.addEventListener("click", function(event){ event.preventDefault();  changeStream(); });
        }

      } else {

       videoSelect = document.getElementById('videoSource');

        if (typeof(videoSelect) != 'undefined' && videoSelect != null)
        {

        }else{ 

          videoParameters.innerHTML = '<select class="select nomargin camera-switch" id="videoSource"></select>';
          videoSelect = document.getElementById('videoSource');
          videoSelect.onchange = startStream;
          MediaStreamTrack.getSources(gotSources);
        }
      }

      
      if ((typeof window === 'undefined') || (typeof navigator === 'undefined')) log('This page needs a Web browser with the objects window.* and navigator.*!');
      else if (!(video && canvas)) log('HTML context error!');
      else
      {

        if (window.stream) {
          video.src = null;
          window.stream.stop();
        }

        if (typeof(videoSelect) != 'undefined' && videoSelect != null)
        {
          log('with video sources…');
          var videoSource = videoSelect.value;
          var constraints = {
              video: {
                optional: [{
                  sourceId: videoSource
                }]
              }
            };
        }else{ 
          log('without video sources…');
          var constraints = {
              video: {
              }
            };
          //var currentVideoSource = 0;
        }

        log('get user media…');

        navigator.getUserMedia(constraints, successCallback, errorCallback);
      } 
        
    }  
  }

  startStream();

}