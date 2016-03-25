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

    var videoAlert = document.getElementById('video-alert');

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
       var mycameraCapturer = cameraCapturer();
       mycameraCapturer.init();
    }

    return {
      shootMode: shootMode,
      init: init,
      videoAlert: videoAlert
    };

  })();

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  //cameraCapturer
  var cameraCapturer = function(){

    var getUserMediaSupport = false;
    var MediaStreamTrackSupport = false;

    var errorCallback = function(e) {
    console.log('Reeeejected!', e);
    };


      events.on('videoSourcesAvailable', initVideoSourcesButton);

      function initVideoSourcesButton(videoSources) {
        if(videoSources.length==0){
          log('button');
        }else if(videoSources.length>1){
          log('select');
        }
      }


      function init() {
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
        
        //console.log(sourceInfos);
        //return sourceInfos;

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
        getUserMediaSupport: getUserMediaSupport,
        MediaStreamTrackSupport: MediaStreamTrackSupport,
        init: init
      };

  };

  gifShooter.init();

}