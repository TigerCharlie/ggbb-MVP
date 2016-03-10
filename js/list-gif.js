/* main.js
 * Bullet 
 * V 0.1
 * Jérémie Bersani
 *
 */

window.onload = function()
  {

  var preLog = document.getElementById('preLog');

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



  function removeGif(uuid){

    gifDom = document.getElementById(uuid);

    if (gifDom) {
      gifDom.parentNode.removeChild(gifDom);
    }
  
  }


  function DeleteGif(uuid){
    //console.log(uuid);
    var data = new FormData();
    data.append('uuid', uuid);
   

    ajaxCall('delete_gif.php', data).then(function(response) {
      if(response !== null && typeof response === 'object'){

        if(response.status_code==1){

          removeGif(uuid);

        }else{
          showAlertMessage(false,response.status);
        }
      }
    }).catch(function() {
      log('bug!bug!bug!');
    });

  }



  function initDeleteBoutton(){
    
    if (document.querySelectorAll){
      
      var deleteButtons = document.querySelectorAll(".delete-gif");

      for (var i=0, max=deleteButtons.length; i < max; i++) {

        var deleteButton = deleteButtons[i];
        if(deleteButton){
          deleteButton.addEventListener("click", function(event){ event.preventDefault();  DeleteGif(this.dataset.uuid); });
        }

      }

    }
  }

  initDeleteBoutton();
}