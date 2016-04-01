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
  var preLog = document.getElementById('preLog');
  function log(text)
  {
    if (preLog){
      preLog.textContent = (text) + '  ||  ' + preLog.textContent;
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
    
    var baseURL = '';


    var shootMode = 'alone';
    
    var shootTitle = '';
    var shootId = '';
    var shooterId;
    var gifFrames;
    var gifOwner = false;
    var mycameraCapturer;

    var video;
    var videoContainer;

    var videoAlert;
    var videoParameters;
    var formContainer;

    var videoSelect;
    
    var userAgent = navigator.userAgent.toLowerCase();

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

    function init(currentShootMode, currentBaseURL) {
      //init dom elements 
      baseURL = currentBaseURL;
      shootMode = currentShootMode;
      console.log('init', shootMode);
      video = document.getElementById('video');
      videoContainer = document.getElementById("container-video");
      videoAlert = document.getElementById('video-alert');
      videoParameters = document.getElementById('video-parameters');
      formContainer =  document.getElementById('form-container');

      //init camera capturer
      mycameraCapturer = cameraCapturer();
      mycameraCapturer.init(video);
    }

    events.on('videoSourcesAvailable', initVideoSourcesButton);

    function initVideoSourcesButton(videoSources) {

      if(videoSources.length==0 || userAgent.indexOf('firefox') > -1){
        log('button');
        videoParameters.innerHTML = '<button class="btn nomargin camera-switch" type="button" id="buttonChange" >Change camera</button>';
        var buttonChange = document.getElementById('buttonChange');
        buttonChange.addEventListener("click", function(event){ event.preventDefault();  mycameraCapturer.startVideoStream(); });
      }else if(videoSources.length>1){
      
        log('select');
        var videoSourcesSelectHTML = '<select class="select nomargin camera-switch" id="videoSource">';
        
        for (var i = 0; i !== videoSources.length; ++i) {
          videoSourcesSelectHTML += '<option value="'+videoSources[i].id+'">'+videoSources[i].label+'</option>';
        }

        videoSourcesSelectHTML += '</select>';
        videoParameters.innerHTML = videoSourcesSelectHTML;
        
        videoSelect = document.getElementById('videoSource');
        videoSelect.onchange = function(){
          log('change'+videoSelect.value);
          mycameraCapturer.startVideoStream(videoSelect.value);
        };
      }
    }

    function resizeVideo()
    {    
      var shotBoxWidth=document.getElementById('shot-box').clientWidth;
      var videoContainerSize=shotBoxWidth;

      var videoWidth=video.videoWidth;
      var videoHeight=video.videoHeight;
      
      log(shotBoxWidth+' / '+videoWidth+' / '+videoHeight+' / ');

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
    }


    events.on('captureVideoCanPlay', ShowHidePlayButton);
    events.on('streamSuccess', initPlayButton);

    events.on('captureVideoOnPlay', ShowHidePlayButton);
    events.on('captureVideoOnPlay', initShootCreation);

    events.on('captureVideoOnPause', ShowHidePlayButton);
    events.on('captureVideoOnLoadedMetaData', resizeVideo);

    
    //////////////////////////////////////////////////////////////////////////////////////
    //timer function with normal/self-adjusting argument
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
        
        //increment the counter
        counter++;

        console.log(countdown);

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
          }else{
            countDownTimeout = window.setTimeout(function() { instance(); }, speed);
          }

        }
      };
      //now kick everything off with the first timer instance
      countDownTimeout = window.setTimeout(function() { instance(); }, speed);
    }


    function startFinalCountDown(){
      countdown = shootTime-serverTime;
      log('countdown : '+countdown+);
      timer(true, true);
    }


    function planShoot(){
      var data = new FormData();
      data.append('uuid', shootId);

      var clientTimestamp = Date.now();
      ajaxCall('shoot.php', data).then(function(response) {

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




    function snapshot(){

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
      exportCanvas();
    }


    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/jpeg", 0.85);
        return image;
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
        data.append('uuid', shootId);
        data.append('frame', shooterId);

        var title = shootId+'-'+shooterId+'.jpg';

        data.append('file', dataURLToBlob(newImg.src), title);
        /// send image
        showAlertMessage(true,'uploading image...');

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




    function initShootCreation() {
      log('initiate Shoot ! in mode :'+shootMode);
      events.off('captureVideoOnPlay', initShootCreation);

      if (shootMode === 'alone'){
        showAlertMessage(true, 'You can start shooting right now !');

        var htmlContent = '<button  class="btn" id="buttonShoot" >SHOOT!</button>';

        htmlContent += '<button  class="btn" id="buttonGenerateGif" disabled >Generate gif</button>';

        formContainer.innerHTML = htmlContent;

        var buttonShoot = document.getElementById('buttonShoot');
        if(buttonShoot){
          buttonShoot.addEventListener("click",  function(event){ event.preventDefault();  snapshot(); });
        }

        var buttonGenerate = document.getElementById('buttonGenerateGif');
        if(buttonGenerate){
          buttonGenerate.addEventListener("click",  function(event){ event.preventDefault();  generateGif(); });
        }
      }else if(shootMode === 'together'){
        //showCreatForm();
        createShoot();
      }else{

      }

    }

    /*
    function showCreatForm()
    {
      var htmlContent = '<button  class="btn" id="buttonCreateShoot" >Create Shoot</button>';

      document.getElementById('form-container').innerHTML = htmlContent;

      var buttonCreateShoot = document.getElementById('buttonCreateShoot');
      if(buttonCreateShoot){
        buttonCreateShoot.addEventListener("click", function(event){ event.preventDefault();  createShoot(); });
      }
    }*/


    function ajaxCall(url, data){

      return new Promise(function(resolve, reject) {

        var request = new XMLHttpRequest();
        request.open('POST', url, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            
            var response = JSON.parse(request.responseText);
            log(response);

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


    function createShoot(){

      var data = new FormData();
      data.append('type', shootMode);

      ajaxCall('create_shoot.php', data).then(function(response) {

        if(response !== null && typeof response === 'object'){

          if(response.status_code==1){
            shootTitle = response.title;
            shootId = response.uuid;
            shooterId = response.userFrame;
            gifFrames = 1;
            gifOwner = true;

            ShowFrameCounter();
            checkShootTimeout = window.setTimeout(checkFrames, 1000);
            initShootButton();
          }else{
            //showAlertMessage(false,response.status);
          }
        }

      }).catch(function() {
        log('bug!bug!bug!');
      });

    }

    function checkFrames(){
      var data = new FormData();
      data.append('uuid', shootId);
      var previousGifFrames = gifFrames;

      var clientTimestamp = Date.now(); 
      ajaxCall('timer.php', data).then(function(response) {
        // Code depending on result

        if(response !== null && typeof response === 'object'){

          if(response.status_code == 1){
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



    function ShowFrameCounter(){
      var p = document.createElement("p");
      p.className = "counter";
      p.id = "counter";
      videoParameters.appendChild(p);
      updateCounter();
    }

    function updateCounter(){
      if(shootMode === 'together'){
        var counterHtml = shooterId+' / '+gifFrames;
      }
      document.getElementById("counter").innerHTML = counterHtml;
    }


    function initShootButton(){
      if(shootMode === 'together'){
        showAlertMessage(true, 'Shoot well created. Invite people to join your shoot : '+shootTitle+'... and SHOOT!<br>You can also send them this link :<br><input type="text" value="'+baseURL+'/together_mode.php?join=true&id='+shootId+'">');
      }

      var htmlContent = '<input  class="btn" type="button" id="buttonShoot" value="SHOOT!" />';
      document.getElementById('form-container').innerHTML = htmlContent;
      var buttonShoot = document.getElementById('buttonShoot');
      if(buttonShoot){
        buttonShoot.addEventListener("click",  function(event){ 
          event.preventDefault();
          if(shootMode === 'together'){
            planShoot();
          }
        });
      }

    }


    function initPlayButton() {
      var buttonPlay = document.getElementById('buttonPlay');
      if(!buttonPlay){
        showAlertMessage(true, 'Click on the start button to start the camera... Simple no ?');
        formContainer.innerHTML = '<button class="btn" id="buttonPlay" >Start Now !</button>';
        var buttonPlay = document.getElementById('buttonPlay');
        buttonPlay.addEventListener("click", function(event){ event.preventDefault(); log('play click !'); mycameraCapturer.play(); });
      }
      events.off('streamSuccess', initPlayButton);
    }

    function ShowHidePlayButton() {
      log('ShowHidePlayButton');
      if (mycameraCapturer.checkIfVideoIsPlaying()) {
        if(buttonPlay){
          buttonPlay.style.display = "none";
          showAlertMessage(true, '', true);
        }
      }else{
        if(buttonPlay){
          showAlertMessage(true, 'Click on the start button to start the camera... Simple no ?');
          buttonPlay.style.display = "inline-block";
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
          Pause();
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

    function play()
    {
      if (captureVideo)
      {
        log('play');
        captureVideo.play();
      }
    }

    function pause()
    {
      if (captureVideo)
      {
        log('pause');
        captureVideo.Pause();
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
        captureVideo.play();
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
        
        if (captureStream) {
          captureVideo.src = null;
          //captureStream.stop();
          captureStream.getTracks().forEach(function (track) { track.stop(); });
        }

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
            i=1;
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
        i=1;
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
        play: play,
        pause: pause
      };
  };


  //gifShooter.shootMode = 'together';
  //gifShooter.init();

//}