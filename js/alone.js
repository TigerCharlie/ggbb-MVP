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
  
  var type = 'alone';

  var shootTime;
  var DeltaTime;
  var serverTime;

  var countDownTimeout;
  var checkShootTimeout;
  var checkGifTimeout;


  

  //var gifFramesList = [];

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

    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    if(w>h){

      var RotateScreenAlert = '<p>Please Rotate screen !</p>'
      //openLightBox(RotateScreenAlert);

    }else{
      closeLightBox();
    }


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
    //document.getElementById('target').style.display='block';
    window.scrollTo(0, 45);

    showHidePlayButton(video);
  }, false );

  // enable vibration support
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  // enable getUserMedia
  //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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


  function showAjustGifButton(){
    var htmlContent = '<button id="buttonAjustGif" class="btn nomargin ajust-gif" type="button">Ajust gif</button>';
    videoParameters.innerHTML = htmlContent;
    var buttonAjustGif = document.getElementById('buttonAjustGif');
    if(buttonAjustGif){
      buttonAjustGif.addEventListener("click", function(event){ event.preventDefault();  showAjustGifForm(); });
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

    var htmlContent = '<button id="buttonCloseAjustForm" class="close-btn" href="#" type="button">Close</button>';

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
    htmlContent += '<button  class="btn nomargin center" type="button" id="buttonRegenerateGif" >Regenerate Gif</button>';
    
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

  
  function generateGif(){
    log('generateGif');

    showAlertMessage(true,'Generating Gif');

    var htmlContent = '';
    document.getElementById('form-container').innerHTML = htmlContent;


    stopStream();


    var data = new FormData();
    data.append('uuid', shootId);
    //var response=ajaxCall('ajust_gif.php', data);

    ajaxCall('generate_gif.php', data).then(function(response) {
      // Code depending on result
      if(response !== null && typeof response === 'object'){

        if(response.status_code==1){

          showFinalGif(response.gifUrl);

        }else{
          showAlertMessage(false,response.status);
        }

      }

    }).catch(function() {
      log('bug!bug!bug!');
    });


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

    showAjustGifButton();

    shotBox.className = "shot-box-end";

    showAlertMessage(true,'YEAAAAH !');


    var htmlContent = '<div class="share-btn"><a class="facebook-share" href="https://www.facebook.com/sharer.php?u='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on facebook</a>';
    htmlContent += '<a class="twitter-share" href="https://twitter.com/intent/tweet?url='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on Twitter</a>';
    htmlContent += '<a class="google-share" href="https://plus.google.com/share?url='+baseUrl+'/gif.php?uuid='+shootId+'" target="_blank">Share on Google+</a></div>';


    htmlContent += '<button  class="btn" type="button" id="buttonAnotherShoot" >Make another Shoot !</button>';
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

      //videoParameters.style.display='none';

      var data = new FormData();
      //console.log(title);
      //data.append('title', title);
      data.append('uuid', shootId);
      data.append('frame', gifFrames+1);

      var title = shootId+'-'+shooterId+'.jpg';

      //log('||'+shootId+'-'+shooterId+'||');

      data.append('file', dataURLToBlob(newImg.src), title);
      /// send image

      ajaxCall('save_img.php', data).then(function(response) {
        // Code depending on result
        if(response !== null && typeof response === 'object'){

          if(response.status_code==1){
            log('img well uploaded!');
            
            //addImgToQueue(response.uploaded_frames);
            gifFrames = response.uploaded_frames;

            document.getElementById('buttonShoot').disabled = false;

            if(gifFrames>=2){
              document.getElementById('buttonGenerateGif').disabled = false;
            }
            updateCounter();
          
          }else{
            showAlertMessage(false,response.status);
          }
        }

      }).catch(function() {
        log('bug!bug!bug!');
      });

    };

  }

  /*
  function addImgToQueue(imgId){
    //log('addImgToQueue');
    gifFramesList.push(imgId);

  }
  */




function updateCounter(){
  document.getElementById("counter").innerHTML = gifFrames;
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



function readyToShoot(){
  isReadyToShoot = true;
  showAlertMessage(true, 'Shoot well created. You can start shooting !');

  var htmlContent = '<button  class="btn" type="button" id="buttonShoot"  type="button" >SHOOT!</button>';

  htmlContent += '<button  class="btn" type="button" id="buttonGenerateGif"  type="button" disabled >Generate gif</button>';

  document.getElementById('form-container').innerHTML = htmlContent;
  var buttonShoot = document.getElementById('buttonShoot');
  if(buttonShoot){
    buttonShoot.addEventListener("click",  function(event){ event.preventDefault();  snapshot(); });
  }

  var buttonGenerate = document.getElementById('buttonGenerateGif');
  if(buttonGenerate){
    buttonGenerate.addEventListener("click",  function(event){ event.preventDefault();  generateGif(); });
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
        gifFrames = 0;
        var t = document.createTextNode(gifFrames);
        p.appendChild(t);

        videoParameters.appendChild(p);
        gifOwner = true;
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
    htmlContent += '<button  class="btn" type="button" id="buttonCreateShoot" value="Create Shoot" >Create Shoot</button>';
    document.getElementById('form-container').innerHTML = htmlContent;

    var buttonCreateShoot = document.getElementById('buttonCreateShoot');
    if(buttonCreateShoot){
      buttonCreateShoot.addEventListener("click", function(event){ event.preventDefault();  createShoot(); });
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
    document.getElementById('buttonShoot').disabled = true;


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
    //stopStream();
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
      //if (video) stop();
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

  function errorCallback(e) {
    log(e);
  }


  function gotDevices(deviceInfos) {

    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label ||
          'Microphone ' + (audioInputSelect.length + 1);
        audioInputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label || 'Speaker ' +
          (audioOutputSelect.length + 1);
        audioOutputSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || 'Camera ' +
          (videoSelect.length + 1);
        videoSelect.appendChild(option);
      }

    }

  }
  /////////////////////////////////////////////////

  var promisifiedOldGUM = function(constraints, successCallback, errorCallback) {

    // First get ahold of getUserMedia, if present
    var getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia);

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if(!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(successCallback, errorCallback) {
      getUserMedia.call(navigator, constraints, successCallback, errorCallback);
    });
    
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if(navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if(navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
  }


  ///////////////////////////////////////////////////


  // enable vibration support
  //navigator.mediaDevices.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

  //navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  /*
  var constraints = window.constraints = {
  audio: false,
  video: { width: 400, height: 400 }
  };
  */

  function startWebCamStream()
  {


    buttonPlay = document.getElementById('buttonPlay');

    if(buttonPlay){
      buttonPlay.addEventListener("click", function(event){ event.preventDefault();  playVideo(); });
      buttonPlay.style.display = "none";
    }


    var p = navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 400, height: 400 } });

    p.then(function(mediaStream) {
      //var video = document.querySelector('video');
      video.src = window.URL.createObjectURL(mediaStream);
      video.onloadedmetadata = function(e) {
        // Do something with the video here.
      };
    });



    /*
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      var videoTracks = stream.getVideoTracks();
      log('Got stream with constraints:', constraints);
      log('Using video device: ' + videoTracks[0].label);
      stream.onended = function() {
        log('Stream ended');
      };
      window.stream = stream; // make variable available to browser console
      video.srcObject = stream;
    })
    .catch(function(error) {
      if (error.name === 'ConstraintNotSatisfiedError') {
        log('The resolution ' + constraints.video.width.exact + 'x' +
            constraints.video.width.exact + ' px is not supported by your device.');
      } else if (error.name === 'PermissionDeniedError') {
        log('Permissions have not been granted to use your camera and ' +
          'microphone, you need to allow the page access to your devices in ' +
          'order for the demo to work.');
      }
      log('getUserMedia error: ' + error.name, error);
    });

    */







    /*
    if (!navigator.getUserMedia) {
          log('getUserMedia not supported');
          showAlertMessage(false,'Your Browser is not cool enough to run this site please use Chrome, Firefox or Opera.');
    } else {


      navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(errorCallback);




      
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
       
    }  */
  }

  startWebCamStream();

/*

  function openLightBox(content)
  {

    console.log('openLightBox'+ content);

    var lightBox = document.getElementById('light-box');

    if(!lightBox){
      var lightBoxContent = '<a id="box-close-btn" href="#">Close</a>';
      lightBoxContent += '<div id="light-box" class="white-content">';
      lightBoxContent += '<div id="box-content" class="box-content">';
      lightBoxContent += '</div></div>';
      lightBoxContent += '<div id="black-overlay" class="black-overlay"></div>';
      //document.body.innerHTML += lightBoxContent;
      document.body.insertAdjacentHTML( 'beforeend', lightBoxContent);

      var closeBtn = document.getElementById('box-close-btn');
      if(closeBtn){
        closeBtn.addEventListener("click", function(event){ event.preventDefault();  closeLightBox(); });
      }

    }

    if(content){
      document.getElementById('box-content').innerHTML = content;
      document.getElementById('light-box').style.display = 'block';
      document.getElementById('black-overlay').style.display = 'block';
      document.getElementById('box-close-btn').style.display = 'block';

    }
    
  }

  function closeLightBox()
  {
      console.log('closeLightBox');
      document.getElementById('light-box').style.display = 'none';
      document.getElementById('black-overlay').style.display = 'none';
      document.getElementById('box-close-btn').style.display = 'none';
    
  }
*/
}