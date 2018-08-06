// toggle log messages
function log(msg){
if (log_enabled) {
		console.log('debug: ' + msg);
	}
}
log_enabled=true;

let imgRegExp = new RegExp("[\/]([^\/]+(?!\/)+)$");
// regular expression finding the filename after the last slash


browser.runtime.onMessage.addListener(
  function(img_url){
	 let img_filename = imgRegExp.exec(img_url)[1];
	 // prefix date and time to filename
	 let current_datetime = new Date();
	 let yyyy = current_datetime.getFullYear();
	 let mo = current_datetime.getMonth() +1; // 0 to 11 +1
	 let dd = current_datetime.getDate(); // 1 to 31
	 let hh = current_datetime.getHours(); // 0 to 23
	 let mm = current_datetime.getMinutes(); // 0 to 59
	 let ss = current_datetime.getSeconds(); // 0 to 59
	 let time_digits = [mo, dd, hh, mm, ss];
	 for (let i=0; i < 5; i++){ // pad leading zero to 2 digits
		time_digits[i] = ('0' + time_digits[i]).slice(-2);
	 }
	 let date_time = yyyy+"_"
	 +time_digits[0]+"_"
	 +time_digits[1]+"_"
	 +time_digits[2]
	 +time_digits[3]
	 +time_digits[4]+"_";
	 log("current date and time: " + date_time);
	 log("save request received for: " + img_url);
     browser.downloads.download({
     url: img_url,
     filename: date_time + img_filename
    });
   }
);
