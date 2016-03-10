/* embed.js
 * GifGifBangBang
 * V 0.1
 * Jérémie Bersani
 *
 */

window.onload = function()
  {

  var resizeTimeout;
  var gifContainer = document.getElementById('embed');


  window.addEventListener('resize', function(event){
    clearTimeout(resizeTimeout);
    resizeTimeout= setTimeout(function() {
        afterResize();
    }, 200);
  });

  function afterResize() {
    console.log('after resize');
    
    if(gifContainer){
      centerGif();
    }
  }

  function centerGif()
  {
    var containerWidth = gifContainer.clientWidth;
    var containerHeight = gifContainer.clientHeight;
    
    if(containerWidth>containerHeight){
      
      var gifwidth = containerHeight;
      var gifHeight = containerHeight;
      var gifMarginTop=0;
      var gifMarginLeft= Math.round((containerWidth-gifwidth)/2);
    }else{

      var gifwidth = containerWidth;
      var gifHeight = containerWidth;
      var gifMarginTop = Math.round((containerHeight-gifHeight)/2);;
      var gifMarginLeft = 0;
    }

    gifImg = document.getElementById('gif-container');

    gifImg.style.width = gifwidth+"px";
    gifImg.style.height = gifHeight+"px";
    gifImg.style.marginTop = gifMarginTop+"px";
    gifImg.style.marginLeft = gifMarginLeft+"px";

  }

  centerGif();

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


var gifUUID = document.getElementById('gif-img').getAttribute('data-uuid');

var embedContent = '<section class="form-block last">';
embedContent += '<div><label for="iframe-embed-code">Iframe Embed</label></div>';
embedContent += '<div class="full-width"><input onClick="this.setSelectionRange(0, this.value.length)" id="iframe-embed-code" class="form-control" type="text" value="<iframe src=&quot;//camponthemoon.com/bullet/embed.php?uuid='+gifUUID+'&quot; width=&quot;400&quot; height=&quot;400&quot; frameBorder=&quot;0&quot; class=&quot;gifgifbangbang-embed&quot; allowFullScreen></iframe><p><a href=&quot;http://camponthemoon.com/bullet/gif.php?uuid='+gifUUID+'&quot;>via GifGifBangBang</a></p>" readonly="true" spellcheck="false"></div>';
embedContent += '</section>';

var linkContent = '<section class="form-block last">';
linkContent += '<div><label for="link-code">Link</label></div>';
linkContent += '<div class="full-width"><input onClick="this.setSelectionRange(0, this.value.length)" id="link-code" class="form-control" type="text" value="http://camponthemoon.com/bullet/gif.php?uuid='+gifUUID+'" readonly="true" spellcheck="false"></div>';
linkContent += '</section>';



  function initAction()
  {
    var linkBtn = document.getElementById('link-btn');
    if(linkBtn){
      linkBtn.addEventListener("click", function(event){ event.preventDefault(); openLightBox(linkContent); });
    }

    var embedBtn = document.getElementById('embed-btn');
    if(embedBtn){
      embedBtn.addEventListener("click", function(event){ event.preventDefault();  openLightBox(embedContent); });
    }
  }

  initAction();

}