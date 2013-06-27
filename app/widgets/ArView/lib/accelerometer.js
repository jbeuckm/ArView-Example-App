/**
 * Wrap the logic around adding listeners to the accelerometer, including testing for Ti.Accelerometer undefined (TiShadow, Simulator)
 * 
 */

var callback;

var accelerometerCallback = function(e) {
	if (callback) {
		callback(e);
	}
};


exports.start = function() {
	
	if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1) {
		alert('Accelerometer does not work on a virtual device');
	} else {
		Ti.Accelerometer.addEventListener('update', accelerometerCallback);
		if (Ti.Platform.name === 'android') {
			Ti.Android.currentActivity.addEventListener('pause', androidPause);
			Ti.Android.currentActivity.addEventListener('resume', androidResume);
		}
	}
}

function androidPause(e) {
	Ti.API.info("removing accelerometer callback on pause");
	Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
}
function androidResume(e) {
	Ti.API.info("adding accelerometer callback on resume");
	Ti.Accelerometer.addEventListener('update', accelerometerCallback);
}


exports.destroy = function() {
	Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
	if (Ti.Platform.name === 'android') {
		Ti.Android.currentActivity.removeEventListener('pause', androidPause);
		Ti.Android.currentActivity.removeEventListener('resume', androidResume);
	}
	callback = null;
}



exports.setupCallback = function(_callback) {
	callback = _callback;
}

