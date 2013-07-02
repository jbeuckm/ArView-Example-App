function androidPause() {
    Ti.API.info("removing accelerometer callback on pause");
    Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
}

function androidResume() {
    Ti.API.info("adding accelerometer callback on resume");
    Ti.Accelerometer.addEventListener("update", accelerometerCallback);
}

var callback;

var accelerometerCallback = function(e) {
    callback && callback(e);
};

exports.start = function() {
    if ("Simulator" === Ti.Platform.model || -1 !== Ti.Platform.model.indexOf("sdk")) Ti.API.error("Accelerometer does not work on a virtual device"); else {
        Ti.Accelerometer.addEventListener("update", accelerometerCallback);
        Ti.Android.currentActivity.addEventListener("pause", androidPause);
        Ti.Android.currentActivity.addEventListener("resume", androidResume);
    }
};

exports.destroy = function() {
    Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
    Ti.Android.currentActivity.removeEventListener("pause", androidPause);
    Ti.Android.currentActivity.removeEventListener("resume", androidResume);
    callback = null;
};

exports.setupCallback = function(_callback) {
    callback = _callback;
};