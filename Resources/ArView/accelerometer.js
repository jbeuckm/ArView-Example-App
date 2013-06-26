var callback;

var accelerometerCallback = function(e) {
    callback && callback(e);
};

void 0 === Ti.Accelerometer ? Ti.API.error("Accelerometer NOT available in this environment.") : "Simulator" === Ti.Platform.model || -1 !== Ti.Platform.model.indexOf("sdk") ? alert("Accelerometer does not work on a virtual device") : Ti.Accelerometer.addEventListener("update", accelerometerCallback);

exports.setupCallback = function(_callback) {
    callback = _callback;
};