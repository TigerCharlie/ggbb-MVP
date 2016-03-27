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

    var videoAlert = document.getElementById('video-alert');
    var videoParameters = document.getElementById('video-parameters');

    events.on('getUserMediaNotSupported', alertChangeNavigator);

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

    function alertChangeNavigator() {
      showAlertMessage(false,'Your Browser is not cool enough to run this site please use Chrome, Firefox.');
      console.log('Your Browser is not cool enough to run this site please use Chrome, Firefox.');
    }

    function init() {
       //log('init');
       mycameraCapturer = cameraCapturer();
       //mycameraCapturer.captureVideo = document.getElementById('video');
       mycameraCapturer.init(document.getElementById('video'));
    }


    events.on('videoSourcesAvailable', initVideoSourcesButton);

    function initVideoSourcesButton(videoSources) {
      if(videoSources.length==0){
        log('button');
        videoParameters.innerHTML = '<button class="btn nomargin camera-switch" type="button" id="buttonChange" >Change camera</button>';
        var buttonChange = document.getElementById('buttonChange');
        buttonChange.addEventListener("click", function(event){ event.preventDefault();  mycameraCapturer.startVideoStream(); });
      }else if(videoSources.length>1){
        log('select');
        videoParameters.innerHTML = '<select class="select nomargin camera-switch" id="videoSource"></select>';
        
        var videoSelect = document.getElementById('videoSource');

        for (var i = 0; i !== videoSources.length; ++i) {     
          var option = document.createElement('option');
          option.value = videoSources[i].id;
          option.text = videoSources[i].label;
          videoSelect.appendChild(option);
        }
        //console.log(mycameraCapturer);
        videoSelect.onchange = mycameraCapturer.startVideoStream(videoSelect.value);
      }
    }

    events.on('captureVideoCanPlay', ShowHidePlayButton);
    events.on('captureVideoOnPlay', ShowHidePlayButton);
    events.on('captureVideoOnPause', ShowHidePlayButton);

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
    var multipleVideoSourcesAvailable = false;
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
      }

      stream.onended = function ()
      {
        log('stream.onended');
      };

    }

    function Play()
    {
      if (captureVideo)
      {
        captureVideo.play();
      }
    }

    function Pause()
    {
      if (captureVideo)
      {
        captureVideo.Pause();
      }
    }



    function StreamSuccessCallback(stream) {
      log('successCallback');

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
          captureVideo.play();
        }
        else if (navigator.mozGetUserMedia)
        {//FF16a, 17a
          captureVideo.src = stream;
          captureVideo.play();
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


      events.on('videoSourcesAvailable', startVideoStream);

      function startVideoStream(streamId) {
        
        /*
        if (window.stream) {
          video.src = null;
          window.stream.stop();
        }*/

        if (typeof streamId === 'string' || streamId instanceof String)
        {
          log('with video sources…');
          var constraints = {
              video: {
                optional: [{
                  sourceId: streamId
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
        navigator.getUserMedia(constraints, StreamSuccessCallback, errorCallback);
      };      


      function init(thisCaptureVideo) {

        captureVideo = thisCaptureVideo;

        // enable getUserMedia
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
        checkIfVideoIsPlaying: checkIfVideoIsPlaying
      };


  };

  gifShooter.init();

}