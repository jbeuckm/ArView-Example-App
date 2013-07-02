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
    "Simulator" === Ti.Platform.model || -1 !== Ti.Platform.model.indexOf("sdk") ? Ti.API.error("Accelerometer does not work on a virtual device") : Ti.Accelerometer.addEventListener("update", accelerometerCallback);
};

exports.destroy = function() {
    Ti.Accelerometer.removeEventListener("update", accelerometerCallback);
    callback = null;
};

exports.setupCallback = function(_callback) {
    callback = _callback;
};