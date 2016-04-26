/* gif-maker.js
 * GifGifBangBang
 * V 0.1
 * Jérémie Bersani
 *
 */

//window.onload = function()
//{
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //log function
  
  function log(text)
  {
    var preLog = document.getElementById('preLog');
    if (preLog){
      if(typeof text === 'object'){
        preLog.textContent = JSON.stringify(text) + '  ||  ' + preLog.textContent;
      }else{
        preLog.textContent = (text) + '  ||  ' + preLog.textContent;
      }
      console.log(text);
    }else{ 
      console.log(text);
     // alert(text);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //events (publish subscribe) pattern
  var events = {
    events: {},
    on: function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    },
    off: function(eventName, fn) {
      if (this.events[eventName]) {
        for (var i = 0; i < this.events[eventName].length; i++) {
          if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
          }
        };
      }
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function(fn) {
          fn(data);
        });
      }
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //gifShooter module

  var gifShooter = (function(){
  //gifShooter = function(){
    
    var url = window.location.href
    var urlArr = url.split("/");
    var siteBaseURL = urlArr[0] + "//" + urlArr[2];

    //var siteBaseURL = '';

    var shootMode = 'alone';
    
    var shootTitle = '';
    var shootId = '';
    var shooterId;
    var gifFrames;
    var gifOwner = false;
    var mycameraCapturer;

    var shotBox;
    var video;
    var videoContainer;

    var videoAlert;
    var videoParameters;
    var formContainer;

    var videoSelect;
    
    var canvas;
    var ctx;

    var frameSpeed = 20;
    var loopType = 1;
    var imgFilter = 1;

    var videoModeShootInterval = 500;
    var videoModeCountdown = 5000;
    var videoModeImagesList = [];

    var buttonShoot;

    var userAgent = navigator.userAgent.toLowerCase();

    function showAlertMessage(good, alertText, hide){
      good = typeof good !== 'undefined' ? good : true;
      hide = typeof hide !== 'undefined' ? hide : false;

      if(hide){
        videoAlert.style.display = 'none';
      }else{

        if(good){
          videoAlert.style.background = 'rgba(0,100,0,0.7)';
        }else{
          videoAlert.style.background = 'rgba(238,0,0,0.7)';
        }
        videoAlert.innerHTML = alertText;
        videoAlert.style.display = 'block';
      }
    }

    events.on('getUserMediaNotSupported', alertChangeNavigator);

    function alertChangeNavigator() {

      if (userAgent.indexOf('apple') > -1){
        var chromeLink = '<a href="https://geo.itunes.apple.com/fr/app/chrome-le-navigateur-web-google/id535886823?mt=8">Chrome</a>';
        var firefoxLink = '<a href="https://geo.itunes.apple.com/fr/app/navigateur-web-firefox/id989804926?mt=8">Firefox</a>';
      }else if (userAgent.indexOf('android') > -1){
        var chromeLink = '<a href="https://play.google.com/store/apps/details?id=com.android.chrome">Chrome</a>';
        var firefoxLink = '<a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox">Firefox</a>';
      } else {
        var chromeLink = 'Chrome';
        var firefoxLink = 'Firefox';
      }
      showAlertMessage(false,'Your Browser is not cool enough to run this site !<br> Please use '+chromeLink+' or '+firefoxLink+'.');
      log('Your Browser is not cool enough to run this site please use Chrome, Firefox.');
    }

    function init(currentShootMode, currentShootId) {
      //init dom elements 
      //siteBaseURL = currentsiteBaseURL;
      shootMode = currentShootMode;
      console.log('init', shootMode);
      shotBox = document.getElementById('shot-box');
      video = document.getElementById('video');
      videoContainer = document.getElementById('container-video');
      videoAlert = document.getElementById('video-alert');
      videoParameters = document.getElementById('video-parameters');
      formContainer =  document.getElementById('form-container');
      canvas = document.getElementById('canvas');
      ctx = canvas.getContext('2d');

      if (typeof currentShootId !== 'undefined') {
        shootId = currentShootId;
      }


      //init camera capturer
      mycameraCapturer = cameraCapturer();
      mycameraCapturer.init(video);
    }

    events.on('videoSourcesAvailable', initVideoSourcesButton);

    function initVideoSourcesButton(videoSources) {

      if(videoSources.length == 0 || userAgent.indexOf('firefox') > -1){
        log('button');
        videoParameters.innerHTML = '<button class="btn nomargin camera-switch" type="button" id="buttonChange" >Change camera</button>';
        var buttonChange = document.getElementById('buttonChange');
        buttonChange.addEventListener('click', function(event){ 
          event.preventDefault();  
          minimizeVideo();
          mycameraCapturer.startVideoStream(); 
        });
        showVideoParameters();
      }else if(videoSources.length>1){
      
        log('select');
        var videoSourcesSelectHTML = '<select class="select nomargin camera-switch" id="videoSource">';
        
        for (var i = 0; i !== videoSources.length; ++i) {
          videoSourcesSelectHTML +=  '<option value="'+videoSources[i].id+'">'+videoSources[i].label+'</option>';
        }
        videoSourcesSelectHTML +=  '</select>';
        videoParameters.innerHTML = videoSourcesSelectHTML;
        
        videoSelect = document.getElementById('videoSource');
        videoSelect.onchange = function(){
          log('change'+videoSelect.value);
          minimizeVideo();
          mycameraCapturer.startVideoStream(videoSelect.value);
        };
        showVideoParameters();
      }
    }

    function minimizeVideo()
    {
      videoContainer.style.width = '1px';
      videoContainer.style.height = '1px';
    }

    function resizeVideo()
    {    
      var shotBoxWidth = shotBox.clientWidth;
      var videoContainerSize = shotBoxWidth;

      var videoWidth = video.videoWidth;
      var videoHeight = video.videoHeight;
      
      log(shotBoxWidth+' / '+videoWidth+' / '+videoHeight+' / ');

      if(videoWidth>videoHeight){
        
        var videoContainerwidth =  Math.round(shotBoxWidth*(videoWidth/videoHeight));
        var videoContainerHeight = shotBoxWidth;
        var videoMarginTop = 0;
        var videoMarginLeft =  Math.round((shotBoxWidth-videoContainerwidth)/2);
      }else{

        var videoContainerwidth = shotBoxWidth;
        var videoContainerHeight =  Math.round(shotBoxWidth/(videoWidth/videoHeight));
        var videoMarginLeft = 0;
        var videoMarginTop =  Math.round((shotBoxWidth-videoContainerHeight)/2);
      }

      log(videoContainerwidth+' / '+videoContainerHeight+' / '+videoMarginLeft+' / '+videoMarginTop);

      videoContainer.style.width = videoContainerwidth+'px';
      videoContainer.style.height = videoContainerHeight+'px';
      videoContainer.style.top = videoMarginTop+'px';
      videoContainer.style.left = videoMarginLeft+'px';
    }


    events.on('captureVideoCanPlay', ShowHidePlayButton);
    events.on('streamSuccess', initPlayButton);

    events.on('captureVideoOnPlay', ShowHidePlayButton);
    events.on('captureVideoOnPlay', initShootCreation);


    events.on('captureVideoOnPause', ShowHidePlayButton);
    events.on('captureVideoOnLoadedMetaData', resizeVideo);

    
    //////////////////////////////////////////////////////////////////////////////////////
    //timer function with normal/self-adjusting argument
    function timer(adjust, morework, interval)
    {
      interval = typeof interval !== 'undefined' ? interval : 0;

      console.log('timer');
      //create the timer speed, a counter and a starting timestamp
      var speed = 50,
      counter = 0, 
      shownCountDown = 0,
      start = new Date().getTime();
      
      if(typeof countDownTimeout !== 'undefined'){
        window.clearTimeout(countDownTimeout);
      }

      //timer instance function
      function instance()
      {
        //if the morework flag is true
        //do some calculations to create more work
        if(morework)
        {
          for(var x = 1, i = 0; i<1000000; i++) { x *=  (i + 1); }
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

        if(counter == 0){
          shownCountDown = Math.floor(countdown/1000);
          showAlertMessage(true,shownCountDown);
          if(interval > 0){
            events.emit('countdownIntervalEvent', false);
            nextCountdownInterval = countdown-interval;
          } 
        }

        if(interval > 0 && countdown <= nextCountdownInterval && nextCountdownInterval > 0){
          nextCountdownInterval = nextCountdownInterval-interval;
          events.emit('countdownIntervalEvent', false);
        }


        if(shownCountDown !== Math.floor(countdown/1000)){
          shownCountDown = Math.floor(countdown/1000);
          if(shownCountDown>0){
            showAlertMessage(true,shownCountDown);
          }
        }
        
        //increment the counter
        counter++;
        //console.log(countdown);

        if(countdown <= 0){
          events.emit('countdownEnd',true);
          window.clearTimeout(countDownTimeout);
          showAlertMessage(true,'Snap !!!');
          //snapshot(true);
        }else{
          //calculate and display the difference
          var diff = (ideal - real);
          //form.diff.value = diff;
          //if the adjust flag is true
          //delete the difference from the speed of the next instance
          if(adjust)
          {
            countDownTimeout = window.setTimeout(function() { instance(); }, (speed - diff));
          }else{
            countDownTimeout = window.setTimeout(function() { instance(); }, speed);
          }

        }
      };
      //now kick everything off with the first timer instance
      countDownTimeout = window.setTimeout(function() { instance(); }, speed);
    }

    function startFinalCountDown(currentCountdown){
      //countdown = shootTime-serverTime;
      countdown = currentCountdown;
      log('countdown : '+countdown);
      timer(true, true);
    }

    function disableShootButton(){
      if(typeof buttonShoot !== 'undefined'){
        buttonShoot.disabled = true;
      }
    }

    function enableShootButton(){
      if(typeof buttonShoot !== 'undefined'){
        buttonShoot.disabled = false;
      }
    }

    function hideShootButton(){
      if(typeof buttonShoot !== 'undefined'){
        buttonShoot.style.display = 'none';
      }
    }

    function hideVideoParameters(){
      if(typeof videoParameters !== 'undefined'){
        videoParameters.style.display = 'none';
      }
    }

    function showVideoParameters(){
      if(typeof videoParameters !== 'undefined'){
        videoParameters.style.display = 'block';
      }
    }

    function showTarget(){
      document.getElementById('target').style.display='block';
    }


    function planShoot(){

      disableShootButton();

      var data = new FormData();
      data.append('uuid', shootId);

      var clientTimestamp = Date.now();

      ajaxCall('shoot.php', data).then(function(response) {

        if(response !== null && typeof response === 'object'){

          if(response.status_code == 1){
            
            var nowTimeStamp = Date.now();
            DeltaTime = Math.round((nowTimeStamp - clientTimestamp)/2);
            serverTime = response.serverTimestamp+DeltaTime;
            shootTime = response.shootTime*1000;
            showAlertMessage(true,response.status);
            //startFinalCountDown(shootTime-serverTime);
            countdown = shootTime-serverTime;
            log('countdown : '+countdown);
            timer(true, true);
            events.on('countdownEnd', snapshot);
          }else{
            showAlertMessage(false,response.status);
            enableShootButton();
          }
        }

      }).catch(function(e) {
        console.log(e);
      });
    }

    function snapshot(vibrate){
      if(shootMode === 'together'){
        hideShootButton();
      } else if(shootMode === 'alone'){
        disableShootButton();
      }
      
      if(vibrate){
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
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

      if((userAgent.indexOf('firefox/43') > -1 || userAgent.indexOf('firefox/42') > -1) && userAgent.indexOf('android') > -1)
      {
        ctx.setTransform(1,0,0,-1,0,video.videoHeight-(drawSize/2));
         log('ff43 or ff42| V2');
      }else{
          log('not FF| V2');
      }

      try {
        ctx.drawImage(video, leftDraw, topDraw,drawSize,drawSize,0,0,400,400); 
      } catch (e) {
        log('bug firefox'+e);
        throw e;
      }

      if(shootMode === 'aloneVideo'){
        return canvas;
      }else{
        exportCanvas();
      }
    }


    // dataURL to Blob
    function dataURLToBlob(dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) ==  -1) {
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

    function convertCanvasToImage(canvas) {
        var image = new Image(400,400);
        image.src = canvas.toDataURL('image/jpeg', 0.85);
        return image;
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
      htmlContent += '<div class="full-width"><input onClick="this.setSelectionRange(0, this.value.length)" class="form-control" type="text" id="frameSpeed" value="'+frameSpeed+'" /></div></section>';
      htmlContent += '<section class="form-block">';
      htmlContent += '<div><label for="gifTitle">Gif Title</label></div>';
      htmlContent += '<div class="full-width"><input onClick="this.setSelectionRange(0, this.value.length)" class="form-control" type="text" id="gifTitle" value="'+shootTitle+'" /></div></section>';
      htmlContent += '<input  class="btn nomargin center" type="button" id="buttonRegenerateGif" value="Regenerate Gif" />';
      
      videoParameters.innerHTML = htmlContent;

      var frameSpeedInput = document.getElementById('frameSpeed');
      frameSpeedInput.addEventListener("change",  function changeFrameSpeed(){ frameSpeed = parseInt(frameSpeedInput.value);  });

      var loopModeSelect = document.getElementById('loopMode');
      loopModeSelect.addEventListener("change",  function changeLoopMode(){ loopType = parseInt(loopModeSelect.value);  });

      var imgFilterSelect = document.getElementById('imgFilter');
      imgFilterSelect.addEventListener("change",  function changeFilter(){ imgFilter = parseInt(imgFilterSelect.value);  });

      var gifTitleSelect = document.getElementById('gifTitle');
      gifTitleSelect.addEventListener("change",  function changeFilter(){ shootTitle = gifTitleSelect.value;  });

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

      mycameraCapturer.stopStream();

      var data = new FormData();
      data.append('uuid', shootId);

      ajaxCall('generate_gif.php', data).then(function(response) {
        
        if(response !== null && typeof response === 'object'){
          if(response.status_code==1){
            showFinalGif(response.gifUrl);
          }else{
            showAlertMessage(false,response.status);
          }
        }

      }).catch(function() {
        console.log(e);
      });
    }







    function regenerateGif(){

      var data = new FormData();
      data.append('uuid', shootId);
      data.append('frame_speed', frameSpeed);
      data.append('loop_type', loopType);
      data.append('img_filter', imgFilter);
      data.append('title', shootTitle);

      log('regenerateGif :'+frameSpeed);

      ajaxCall('ajust_gif.php', data).then(function(response) {
        if(response !== null && typeof response === 'object'){

          if(response.status_code==1){
            RefreshGif();
            showAjustGifButton();
          }else{
            showAlertMessage(false,response.status);
          }
        }
      }).catch(function(e) {
        console.log(e);
      });
    }

    function showAjustGifButton(){
      var htmlContent = '<button class="btn nomargin ajust-gif" id="buttonAjustGif" >Ajust gif</button>';
      videoParameters.innerHTML = htmlContent;
      var buttonAjustGif = document.getElementById('buttonAjustGif');
      if(buttonAjustGif){
        buttonAjustGif.addEventListener('click', function(event){ event.preventDefault();  showAjustGifForm(); });
      }
      showVideoParameters();
    }

    function showRefreshGifButton(){
      var htmlContent = '<button class="btn nomargin" id="buttonRefreshGif" >Refresh gif</button>';
      videoParameters.innerHTML = htmlContent;
      var buttonRefreshGif = document.getElementById('buttonRefreshGif');
      if(buttonRefreshGif){
        buttonRefreshGif.addEventListener('click', function(event){ event.preventDefault();  RefreshGif(); });
      }
      showVideoParameters();
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

    function showFinalGif(gifUrl){

      log('gif well done !');
      var htmlContent  = '<img class="mygif" id="finalGif" src="'+gifUrl+'">';
      htmlContent += '<div id="video-alert"></div>';
      htmlContent += '<img class="notmygif" src="asset/not-my-gif.gif">';
      htmlContent += '<div id="video-parameters"></div>';

      shotBox.innerHTML = htmlContent;
      shotBox.className = 'shot-box-end';

      videoParameters = document.getElementById('video-parameters');
      videoAlert = document.getElementById('video-alert');

      if(shootMode === 'alone'){
        showAlertMessage(true,'YEAAAAH ! <a href="'+siteBaseURL+'/alone_mode_again.php?uuid='+shootId+'">Continue this gif</a>');
      }else{
        showAlertMessage(true,'YEAAAAH !');
      }
      

      

      if(shootMode === 'together' || shootMode === 'alone' ||  shootMode === 'aloneVideo' ){
        showAjustGifButton();
      }else if(shootMode === 'joinTogether'){
        showRefreshGifButton();
      }
      var htmlContent = '<div class="share-btn"><a class="facebook-share" href="https://www.facebook.com/sharer.php?u='+siteBaseURL+'/gif.php?uuid='+shootId+'" target="_blank">Share on facebook</a>';
      htmlContent +=  '<a class="twitter-share" href="https://twitter.com/intent/tweet?url='+siteBaseURL+'/gif.php?uuid='+shootId+'" target="_blank">Share on Twitter</a>';
      htmlContent +=  '<a class="google-share" href="https://plus.google.com/share?url='+siteBaseURL+'/gif.php?uuid='+shootId+'" target="_blank">Share on Google+</a></div>';

      //htmlContent +=  '<button class="btn" id="buttonJoinShoot" >Create another Shoot!</button>';
      //htmlContent +=  '<button class="btn" id="buttonCreateShoot" >Join another Shoot!</button>';
      
      formContainer.innerHTML = htmlContent;
      /*var buttonAnotherShoot = document.getElementById('buttonAnotherShoot');
      if(buttonAnotherShoot){
        buttonAnotherShoot.addEventListener('click', function reloadPage(event){  event.preventDefault(); location.reload();});
      }*/
    }

    function checkIfGifIsGenerated(){
      var data = new FormData();
      data.append('uuid', shootId);

      ajaxCall('check_gif.php', data).then(function(response) {
        
        if(response !== null && typeof response === 'object'){
          if(response.status_code == 1){
            showFinalGif(response.gifUrl);
          }else{
            showAlertMessage(false,response.status);
            checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
          }
        }
      }).catch(function(e) {
        console.log(e);
      });
    }


    function exportCanvas(){

      log('exportCanvas');

      var newImg = convertCanvasToImage(canvas);

      newImg.onload = function() {
        log('imgloaded');

        var data = new FormData();

        if(shootMode !== 'alone'){
          mycameraCapturer.stopStream();
          hideVideoParameters();
          currentFrame = shooterId;
        }else{
          var result = document.getElementById('result');
          result.innerHTML = null;
          result.appendChild(newImg);
          currentFrame = gifFrames+1;
        }

        var title = shootId+'-'+currentFrame+'.jpg';

        data.append('uuid', shootId); 
        data.append('frame', currentFrame);
        data.append('file', dataURLToBlob(newImg.src), title);
        /// send image
        showAlertMessage(true,'uploading image...');

        if(shootMode === 'alone'){
          exportURL = 'save_img.php';
        }else{
          exportURL = 'save_img_and_generate_gif.php';
        }

        ajaxCall(exportURL, data).then(function(response) {

          if(response !== null && typeof response === 'object'){
            if(response.status_code == 1){
              //log('img well uploaded!');
              if(shootMode === 'alone'){
                showAlertMessage(true,'Image well uploaded');
                gifFrames = response.uploaded_frames;
                updateCounter();
                enableShootButton();
                //console.log('--------'+gifFrames);
              }else{
                showAlertMessage(true,'Image well uploaded : waiting for gif generation.');
                checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
              }
            }else if(response.status_code == 2){
              showFinalGif(response.gifUrl);
            }else{
              showAlertMessage(false,response.status);
              checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
            }
          }
        }).catch(function(e) {
          checkGifTimeout = window.setTimeout(checkIfGifIsGenerated, 2000);
          console.log(e);
        });
      };
    }

    function initShootCreation() {
      log('initiate Shoot ! in mode :'+shootMode);
      events.off('captureVideoOnPlay', initShootCreation);
      if (shootMode === 'alone'){
        createShoot();
      }else if(shootMode === 'aloneAgain'){
        //console.log('++++++++++++++++++++++++++++++++++++++++++'+shootId);
        continueShoot();
      }else if(shootMode === 'aloneVideo'){
        //console.log('++++++++++++++++++++++++++++++++++++++++++'+shootId);
        initShootButton();
      }else if(shootMode === 'together'){
        createShoot();
        showTarget();
      }else if(shootMode === 'joinTogether'){
        showTarget();
        if(shootTitle == ''){
          showJoinForm();
        }else{
          console.log('----------------------------------'+shootTitle);
        }
      }else if(shootMode === 'joinTogetherWithLink'){
        showTarget();
        joinShoot(shootId);
      }else{

      }

    }

    function continueShoot(){

        shootTitle = shotBox.dataset.title;
        shootId = shotBox.dataset.uuid;
        shooterId = 1;
        gifFrames = parseInt(shotBox.dataset.frames);

        gifOwner = true;

        

        var result = document.getElementById("result");
        result.innerHTML = '<img src="img/'+shotBox.dataset.uuid+'-'+shotBox.dataset.frames+'.jpg">';

        shootMode = 'alone';
        ShowFrameCounter();

        initShootButton();
    }


    function showJoinForm()
    {
      var htmlContent = '<section class="form-block"><div><label for="titleExport">Shoot title</label></div>';
      htmlContent += '<div class="full-width"><input class="form-control" type="text" id="titleExport" value="" /></div></section>';
      htmlContent += '<button  class="btn" id="buttonJoinShoot" >Join Shoot</button>';

      formContainer.innerHTML = htmlContent;

      var buttonJoinShoot = document.getElementById('buttonJoinShoot');
      if(buttonJoinShoot){
        buttonJoinShoot.addEventListener("click", function(event){ event.preventDefault();  joinShoot(); });
      }
    }

    function ajaxCall(url, data){

      return new Promise(function(resolve, reject) {

        var request = new XMLHttpRequest();
        request.open('POST', url, true);

        request.onload = function() {
          if (request.status >=  200 && request.status < 400) {
            var response = JSON.parse(request.responseText);
            log(response);
            resolve(response);
          } else {
            // We reached our target server, but it returned an error
            log('server returns an error');
            reject;
          }
        };

        request.onerror = function() {
          // There was a connection error of some sort
          log('XMLHttpRequest error');
          reject;
        };
        request.send(data);
      });
    }

    function waitTheShoot(){
      showAlertMessage(true, 'You well joined the shoot named : "'+shootTitle+'". Wait a minute ! The creator will shoot soon !');
      formContainer.innerHTML = '';
      checkShootTimeout = window.setTimeout(checkShoot, 1000);
    }

    function checkShoot(){
      var data = new FormData();
      data.append('uuid', shootId);

      var previousGifFrames = gifFrames;
      var clientTimestamp = Date.now();

      ajaxCall('timer.php', data).then(function(response) {

        if(response !== null && typeof response === 'object'){

          if(response.status_code==1){
            gifFrames = response.frames;

            if(gifFrames !== previousGifFrames){
              updateCounter();
            }
            showAlertMessage(true,response.status);
            checkShootTimeout = window.setTimeout(checkShoot, 1000);

          }else if(response.status_code==2){

            gifFrames = response.frames;

            if(gifFrames !== previousGifFrames){
              updateCounter();
            }

            var nowTimeStamp = Date.now();
            DeltaTime = Math.round((nowTimeStamp - clientTimestamp)/2);
            serverTime = response.serverTimestamp+DeltaTime;
            shootTime = response.shootTime*1000;
            showAlertMessage(true,response.status);
            //startFinalCountDown(shootTime-serverTime);
            countdown = shootTime-serverTime;
            log('countdown : '+countdown);
            timer(true, true);
            events.on('countdownEnd', snapshot);
          }else{
            showAlertMessage(false,response.status);
          }
        }

      }).catch(function(e) {
        console.log(e);
      });

    }

    function joinShoot(currentShootId){

      log('joinShoot');
      var data = new FormData();

      if (typeof currentShootId !== 'undefined') {
        data.append('uuid', currentShootId);
      }else{
        var exportInputTitle = document.getElementById("titleExport");
        var title = exportInputTitle.value;
        //console.log(title);
        data.append('title', title);
      }

      ajaxCall('join_shoot.php', data).then(function(response) {
        
        if(response !== null && typeof response === 'object'){
          if(response.status_code==1){
            shootTitle = response.title;
            shootId = response.uuid;
            shooterId = parseInt(response.userFrame);
            gifFrames = parseInt(response.userFrame);
            ShowFrameCounter();
            waitTheShoot();
          }else{
            showAlertMessage(false,response.status);
          }
        }

      }).catch(function(e) {
        console.log(e);
      });

    }


    function createShoot(){

      var data = new FormData();
      data.append('type', shootMode);

      ajaxCall('create_shoot.php', data).then(function(response) {

        if(response !== null && typeof response === 'object'){
          if(response.status_code == 1){
            shootTitle = response.title;
            shootId = response.uuid;
            shooterId = response.userFrame;
            if (shootMode === 'alone'){
              gifFrames = 0;
            }else{
              gifFrames = 1;
            }
            gifOwner = true;
            ShowFrameCounter();
            if(shootMode !== 'alone'){
              checkShootTimeout = window.setTimeout(checkFrames, 1000);
            }
            initShootButton();
          }else{
            //showAlertMessage(false,response.status);
          }
        }

      }).catch(function(e) {
        console.log(e);
      });

    }

    function checkFrames(){
      var data = new FormData();
      data.append('uuid', shootId);
      var previousGifFrames = gifFrames;

      var clientTimestamp = Date.now(); 
      ajaxCall('timer.php', data).then(function(response) {
        

        if(response !== null && typeof response === 'object'){

          if(response.status_code ==  1){
            gifFrames = response.frames;
            if(gifFrames !==  previousGifFrames){
              updateCounter();
            }
            checkShootTimeout = window.setTimeout(checkFrames, 1000);
          }else if(response.status_code == 2){

          }else{
            checkShootTimeout = window.setTimeout(checkFrames, 1000);
          }
        }

      }).catch(function(e) {
        checkShootTimeout = window.setTimeout(checkFrames, 1000);
        console.log(e);
      });
    }

    function ShowFrameCounter(){
      var p = document.createElement('p');
      p.className = 'counter';
      p.id = 'counter';
      videoParameters.appendChild(p);
      updateCounter();
      showVideoParameters();
    }

    function updateCounter(){
      if(shootMode === 'together' || shootMode === 'joinTogether' || shootMode === 'joinTogetherWithLink'){
        var counterHtml = shooterId+' / '+gifFrames;
      }else if (shootMode === 'alone'){
        var counterHtml = gifFrames;
        buttonGenerateGif = document.getElementById('buttonGenerateGif');
        if(gifFrames > 1 && buttonGenerateGif){
          buttonGenerateGif.disabled = false;
        }
      }else{
        var counterHtml = '';
      }
      document.getElementById('counter').innerHTML = counterHtml;
    }

    function initShootButton(){
      if(shootMode === 'together'){
        showAlertMessage(true, 'Shoot well created. Invite people to join your shoot : '+shootTitle+'... and SHOOT!<br>You can also send them this link :<br><input onClick="this.setSelectionRange(0, this.value.length)" type="text" value="'+siteBaseURL+'/join_together.php?id='+shootId+'">');
      }

      var htmlContent = '<button class="btn" id="buttonShoot" >SHOOT!</button>';
      formContainer.innerHTML = htmlContent;
      buttonShoot = document.getElementById('buttonShoot');
      if(buttonShoot){
        buttonShoot.addEventListener('click',  function(event){ 
          event.preventDefault();
          if(shootMode === 'together'){
            planShoot();
          } else if (shootMode === 'alone'){
            //console.log('shoot !!!!!');
            showAlertMessage(true,'Snap !!!');
            snapshot(true);
          } else if (shootMode === 'aloneVideo'){
            VideoShoot();
          }

        });
      }
      if(shootMode === 'alone'){
        initGenerateButton();
      }
    }


    function VideoShoot(){

      disableShootButton();
      serverTime = Date.now();
      shootTime = serverTime+videoModeCountdown;
      //startFinalCountDown(videoModeCountdown);

      events.on('countdownEnd', addImage);
      events.on('countdownIntervalEvent', addImage);

      countdown = videoModeCountdown;
      timer(true, true, videoModeShootInterval);
    }

    function addImage(isLast){
      //console.log('addImage');

      var newImg = convertCanvasToImage(snapshot(false));

      newImg.onload = function() {
        videoModeImagesList.push(newImg);

        if(isLast){
          //console.log(videoModeImagesList[0]);
          events.off('countdownEnd', addImage);
          events.off('countdownIntervalEvent', addImage);
          mycameraCapturer.stopStream();
          generateVideoGif();
        }
      }   
    }

    function generateVideoGif(){
      
      var data = new FormData();

      for(var i in videoModeImagesList)
      {
           console.log(videoModeImagesList[i].src);
           var title = i+'.jpg';
           data.append('file'+i, dataURLToBlob(videoModeImagesList[i].src), title);
      }

      data.append('frames', videoModeImagesList.length);

      data.append('type', 'aloneVideo');

      showAlertMessage(true,'uploading images...');

        ajaxCall('generate_video_gif.php', data).then(function(response) {

          if(response !== null && typeof response === 'object'){
            if(response.status_code == 1){
              shootTitle = response.title;
              shootId = response.uuid;
              showFinalGif(response.gifUrl);
            }else{
              showAlertMessage(false,response.status);
            }
          }
        }).catch(function(e) {
          console.log(e);
        });
    }


    function initGenerateButton(){
      console.log('initGenerateButton');
      var htmlContent = '<button  class="btn" type="button" id="buttonGenerateGif"  type="button" disabled >Generate gif</button>';
      
      buttonShoot = document.getElementById('buttonShoot');
      buttonShoot.insertAdjacentHTML('afterend', htmlContent);
      //formContainer.appendChild(htmlContent);
      buttonGenerate = document.getElementById('buttonGenerateGif');
      if(buttonGenerate){
        buttonGenerate.addEventListener('click',  function(event){ 
          event.preventDefault();
          generateGif();
        });
      }
      showAlertMessage(true, 'You can start shooting right now !');
    }

    function initPlayButton() {
      var buttonPlay = document.getElementById('buttonPlay');
      if(!buttonPlay){
        showAlertMessage(true, 'Click on the start button to start the camera... Simple no ?');
        formContainer.innerHTML = '<button class="btn" id="buttonPlay" >Start Now !</button>';
        var buttonPlay = document.getElementById('buttonPlay');
        buttonPlay.addEventListener('click', function(event){ event.preventDefault(); log('play click !'); mycameraCapturer.capturePlay(); });
      }
      events.off('streamSuccess', initPlayButton);
    }

    function ShowHidePlayButton() {
      log('ShowHidePlayButton');
      if (mycameraCapturer.checkIfVideoIsPlaying()) {
        if(typeof buttonPlay !== 'undefined'){
          buttonPlay.style.display = 'none';
          showAlertMessage(true, '', true);
        }
      }else{
        if(typeof buttonPlay !== 'undefined'){
          showAlertMessage(true, 'Click on the start button to start the camera... Simple no ?');
          buttonPlay.style.display = 'inline-block';
        }
      }
    }

    return {
      mycameraCapturer: mycameraCapturer,
      init: init,
      videoAlert: videoAlert,
      showAlertMessage: showAlertMessage
    };
  //};
  })();

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //cameraCapturer
  var cameraCapturer = function(){

    var captureVideo;
    var captureStream;
    //console.log(captureVideo);
    var getUserMediaSupport = false;
    var MediaStreamTrackSupport = false;
    var currentVideoSourceId;

    var errorCallback = function(e) {
      log(e);
      gifShooter.showAlertMessage(false, e.message);
    };

    function checkIfVideoIsPlaying() {
      if (captureVideo)
      { 
        if (captureVideo.paused) {
          log('Video is not Playing');
          return false;
        }else { 
          log('Video is Playing');
          return true;
        } 
      }else{
        return false;
        log('captureVideo is Undefined');
      }
    }

    
    function gotStream(stream)
    {
      log('Got stream.');
      videoStream = stream;
      //showHidePlayButton(video);

      if (captureVideo)
      { 
        captureVideo.onerror = function ()
        {
          log('captureVideo.onerror');
          capturePause();
        };

        captureVideo.oncanplay = function() {
          log('captureVideo.oncanplay');
          events.emit('captureVideoCanPlay');
        };

        captureVideo.onplay = function() {
          log('captureVideo.onplay');
          events.emit('captureVideoOnPlay');
        };

        captureVideo.onpause = function() {
          log('captureVideo.onpause');
          events.emit('captureVideoOnPause');
        };

        captureVideo.onloadedmetadata = function() {
          log('captureVideoOnLoadedMetaData');
          events.emit('captureVideoOnLoadedMetaData');
        };

      }

      stream.onended = function ()
      {
        log('stream.onended');
      };

    }

    function capturePlay()
    {
      if (captureVideo)
      {
        log('play');
        captureVideo.play();
      }
    }

    function capturePause()
    {
      if (captureVideo)
      {
        log('pause');
        captureVideo.pause();
      }
    }

    function stopStream()
    {
        if (captureStream) {
          captureVideo.src = null;
          //captureStream.stop();
          captureStream.getTracks().forEach(function (track) { track.stop(); });
        }   
    }


    function streamSuccessCallback(stream) {
      log('successCallback');
      events.emit('streamSuccess', stream);

      gotStream(stream);
      //window.stream = stream; // make stream available to console
      captureStream = stream;

      if (captureVideo)
      {
        if (window.URL) {
          captureVideo.src = window.URL.createObjectURL(stream);
        } 
        else if (captureVideo.mozSrcObject !== undefined)
        {//FF18a
          captureVideo.mozSrcObject = stream;
        }
        else if (navigator.mozGetUserMedia)
        {//FF16a, 17a
          captureVideo.src = stream;
        }
        else if (window.webkitURL) 
        {
          captureVideo.src = window.webkitURL.createObjectURL(stream); 
        }
        else 
        {
          captureVideo.src = stream;
        }
        captureVideo.capturePlay();
      }else{
        log('captureVideo is Undefined');
      }
    };


      /*
      var getUserMediaFallBack = function(constraints, successCallback, errorCallback) {
        return new Promise(function(successCallback, errorCallback) {
          getUserMedia.call(navigator, constraints, successCallback, errorCallback);
        });          
      }
      */

      events.on('videoSourcesAvailable', startVideoStream);

      function startVideoStream(streamId) {
        
        stopStream();

        if (typeof streamId === 'string' || streamId instanceof String)
        {
          log('with video sources…');
          var constraints = {
              audio: false,
              video: {
                optional: [{ sourceId: streamId }],
                //width: { ideal: 400 },
                //height: { ideal: 400 }
              }
            };
        }else{ 
          log('without video sources…');
          var constraints = {
              audio: false,
              video: {
                //width: { ideal: 400 },
                //height: { ideal: 400 }
              }
            };
          //var currentVideoSource = 0;
        }

        log('get user media…');
        
        
        if(navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }

        if(navigator.mediaDevices.getUserMedia === undefined) {
          
          navigator.getUserMedia (
            constraints,
            function(stream) {
             streamSuccessCallback(stream);
            },
            function(err) {
             errorCallback(err);
            }
          );

          
        }else{

          navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            streamSuccessCallback(stream);
          })
          .catch(function(err) {
            errorCallback(err);
          });
        }

      };      


      function init(thisCaptureVideo) {

        captureVideo = thisCaptureVideo;

        // enable getUserMedia
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        if (!navigator.getUserMedia) {
          events.emit('getUserMediaNotSupported');
          log('getUserMediaNotSupported');
        } else {
          getUserMediaSupport = true;

          if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            log('enumerateDevices() not supported.');
            
            if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
              log('This browser does not support MediaStreamTrack.');
              events.emit('videoSourcesAvailable', []);
            } else {
              MediaStreamTrackSupport = true;
              log('This browser supports MediaStreamTrack.');
              //GetMediaStreamTrack();
              //console.log(MediaStreamTrack.getSources(gotSources));
              MediaStreamTrack.getSources(gotSources);
              //console.log(toto);
            }

          }else{
            enumerateDevices().then(function(response) {
              //log(response);
              events.emit('videoSourcesAvailable', response);
            }).catch(function(err) {
              log(err.name + ': ' + err.message);
            });
          }
          //GetMediaStreamTrack();
          //events.emit('getUserMediaSupported');
          //console.log('getUserMediaSupported');
        }
      }


      function enumerateDevices() {

        return new Promise(function(resolve, reject) {

          var devicesList = [];
          navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            i = 1;
            devices.forEach(function(device) {
              if(device.kind === 'videoinput'){

                devicesList.push({label: device.label || 'Camera ' +i, id: device.deviceId}); 
                //log(device.kind + ': ' + device.label + ' id = ' + device.deviceId);
                i++;
              }
            });
            //console.log('toto', devicesList);
            //return devicesList;
            resolve(devicesList);
          }).catch(function(err) {
            log(err.name + ': ' + err.message);
            reject;
          });

        });
        
      }


      function gotSources(sourceInfos) {

        log('gotSources');
        var devicesList = [];
        i = 1;
        sourceInfos.forEach(function(sourceInfo) {
          if(sourceInfo.kind === 'video'){
            devicesList.push({label: sourceInfo.label || 'Camera ' +i, id: sourceInfo.id}); 
            //log(device.kind + ': ' + device.label + ' id = ' + device.deviceId);
            i++;
          }
        });

        events.emit('videoSourcesAvailable', devicesList);
          //console.log(devicesList);
          //resolve(devicesList);
      }
      
      return {
        captureVideo: captureVideo,
        getUserMediaSupport: getUserMediaSupport,
        MediaStreamTrackSupport: MediaStreamTrackSupport,
        init: init,
        startVideoStream: startVideoStream,
        checkIfVideoIsPlaying: checkIfVideoIsPlaying,
        capturePlay: capturePlay,
        capturePause: capturePause,
        stopStream: stopStream
      };
  };


  //gifShooter.shootMode = 'together';
  //gifShooter.init();

//}