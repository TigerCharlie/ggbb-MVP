/* gif-maker.js
 * GifGifBangBang
 * V 0.1
 * Jérémie Bersani
 *
 */




window.onload = function()
{
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
      
    var shootMode = 'alone';
    var shootTitle = '';
    var shootId = '';
    var shooterId ;
    var gifOwner = false;
    var mycameraCapturer;

    var video = document.getElementById('video');
    var videoContainer = document.getElementById("container-video");

    var videoAlert = document.getElementById('video-alert');
    var videoParameters = document.getElementById('video-parameters');
    var formContainer =  document.getElementById('form-container');
    var videoSelect;
    

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
      showAlertMessage(false,'Your Browser is not cool enough to run this site please use Chrome, Firefox.');
      console.log('Your Browser is not cool enough to run this site please use Chrome, Firefox.');
    }

    function init() {
       //log('init');
       mycameraCapturer = cameraCapturer();
       //mycameraCapturer.captureVideo = document.getElementById('video');
       mycameraCapturer.init(video);
    }


    events.on('videoSourcesAvailable', initVideoSourcesButton);

    function initVideoSourcesButton(videoSources) {

      var userAgent = navigator.userAgent.toLowerCase();

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


    function initShootCreation() {
      log('initiate Shoot ! in mode :'+shootMode);
      events.off('captureVideoOnPlay', initShootCreation);
    }

    function initPlayButton() {
      var buttonPlay = document.getElementById('buttonPlay');
      if(!buttonPlay){
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
      shootMode: shootMode,
      init: init,
      videoAlert: videoAlert
    };

  })();

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //cameraCapturer
  var cameraCapturer = function(){

    var captureVideo;
    //console.log(captureVideo);
    var getUserMediaSupport = false;
    var MediaStreamTrackSupport = false;
    var currentVideoSourceId;


    var errorCallback = function(e) {
      log(e);
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
      window.stream = stream; // make stream available to console

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
        
        if (window.stream) {
          video.src = null;
          window.stream.stop();
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


  gifShooter.shootMode = 'together';
  gifShooter.init();

}