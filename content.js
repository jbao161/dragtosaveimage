console.log("demo drag loaded");

// toggle log messages
function log(msg){
if (log_enabled) {
		console.log('debug: ' + msg);
	}
}
var log_enabled = false;
var saved_event;

function _getPosition(htmlElement) {

	     var curleft = 0;
	     var curtop = 0;
	     if (htmlElement && htmlElement.offsetParent) {
	 	    do {
	 	         curleft += htmlElement.offsetLeft;
	 	         curtop += htmlElement.offsetTop;
	 	     } while (htmlElement = htmlElement.offsetParent);
	     }
	     return {left :curleft, top: curtop};
    }
	
function detect_image(event){
	var htmlElement = event.target;
	     var tagName = htmlElement.tagName.toLowerCase();
		 var isOnImage = (tagName=="img");
		 var isOnLink = (tagName=="a");

		 if(isOnImage){
			 log("image detected by tag name");
    		 return htmlElement;
         }

         // Check image link
         if(isOnLink){
             var imgRegExp = new RegExp("\.png|\.jpg|\.jpeg|\.bmp|\.gif|\.webp|\.tif", "g");
             var link = htmlElement.href.toLowerCase();
             if(link.match(imgRegExp)){
                 var HTML_NS = "http://www.w3.org/1999/xhtml";
                 var imgElem = document.createElementNS(HTML_NS, "img");
                 imgElem.src = link;
				log("image detected by url name");
                 return imgElem;
             }
         }

         // Check all images under parent node on the same position
         var eventX = event.clientX;
         var eventY = event.clientY;

         var parentNode = htmlElement;
         for(var loop=0; (loop<2 && parentNode!=null); loop++) { // until 2nd level parent
             var imageElements = parentNode.getElementsByTagName('img');
             log("detect image, parentNode="+ parentNode +", images=" + imageElements.length +", eventX=" + eventX + ", eventY=" + eventY);

             if(imageElements.length == 1){
                 return imageElements[0];
             }

             for(var i=0; i<imageElements.length; i++) {
                 var imgElem = imageElements[i];
                 var point = _getPosition(imgElem);
                 var isBetweenX = (point.left < eventX) && (eventX < (point.left + imgElem.offsetWidth));
                 var isBetweenY = (point.top < eventY) && (eventY < (point.top + imgElem.offsetHeight));
                 log("detect image, src="+ imgElem.src +", isBetweenX=" + isBetweenX + ", isBetweenY=" + isBetweenY);
                 if(isBetweenX && isBetweenY){
                     return imgElem;
                 }
             }
             parentNode = parentNode.parentNode;
         }


         return null;
}

	function onDragstart(event) {
	  log("On dragstart");
	  // store a ref. on the dragged elem
	  saved_event=event;
      // make it half transparent
      event.target.style.opacity = .1;
	}

	function onDragend(event) {
		log("On dragend");
		// check if the event target is an image 
		let is_image = detect_image(event);
		if (is_image){
		// if so, open save dialog
			log("opening save dialog for: "+event.target.src);
			chrome.runtime.sendMessage(event.target.src);
		}
		
		event.target.style.opacity = 1.0;
	}

if (log_enabled){
document.addEventListener("dragstart", function(event) {
	document.body.style.border = "5px solid blue";
	log( "Started to drag the p element.");
});

document.addEventListener("dragend", function(event) {
	document.body.style.border = "none";
    log( "Finished dragging the p element.");
});
}
document.addEventListener("dragstart",onDragstart, false);
document.addEventListener("dragend",onDragend, false);