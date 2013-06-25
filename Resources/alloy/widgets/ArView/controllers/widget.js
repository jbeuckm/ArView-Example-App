function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ArView/" + s : s.substring(0, index) + "/ArView/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function showAR() {
        Ti.Geolocation.addEventListener("heading", headingCallback);
        Ti.Geolocation.addEventListener("location", locationCallback);
        Ti.Media.showCamera({
            success: function() {},
            cancel: function() {
                closeAR();
            },
            error: function() {
                alert("unable to open AR Window");
            },
            mediaTypes: [ Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO ],
            showControls: false,
            autohide: false,
            autofocus: "off",
            animated: false,
            overlay: overlay
        });
    }
    function closeAR() {
        Ti.Geolocation.removeEventListener("heading", headingCallback);
        Ti.Geolocation.removeEventListener("location", locationCallback);
        isAndroid || Ti.Media.hideCamera();
        setTimeout(function() {
            win.close();
        }, 500);
    }
    function headingCallback(e) {
        deviceBearing = e.heading.trueHeading;
        headingLabel.text = Math.floor(deviceBearing) + "°";
        radar.transform = Ti.UI.create2DMatrix().rotate(-1 * deviceBearing);
    }
    function doClose() {
        closeAR();
    }
    function assignPOIs(pois) {
        win.pois = pois;
        createRadarBlips(pois);
        addViews(pois);
        deviceLocation && deviceBearing && updateRelativePositions(pois);
    }
    function locationCallback(e) {
        deviceLocation = e.coords;
        if (!deviceLocation) {
            Ti.API.warn("location not known. Can't draw pois");
            return;
        }
        updateRelativePositions(win.pois);
        for (i = 0, l = win.pois.length; l > i; i++) {
            var poi = win.pois[i];
            updateRadarBlipPosition(poi);
        }
    }
    function updateRelativePositions(pois) {
        for (i = 0, l = pois.length; l > i; i++) {
            Ti.API.info("poi " + i);
            var poi = pois[i];
            if (poi.view) {
                poi.distance = calculateDistance(deviceLocation, poi);
                Ti.API.info("poi = " + poi.latitude + "," + poi.longitude);
                Ti.API.info("deviceLocation = " + deviceLocation.latitude + "," + deviceLocation.longitude);
                Ti.API.info("poi.distance = " + poi.distance);
                if (maxRange && maxRange > poi.distance) {
                    poi.inRange = true;
                    poi.bearing = calculateBearing(deviceLocation, poi);
                    positionRadarBlip(poi);
                    Ti.API.info("poi.bearing = " + poi.bearing);
                } else {
                    poi.inRange = false;
                    Ti.API.debug(poi.title + " not added, maxRange=" + maxRange);
                }
            } else poi.inRange = false;
        }
        pois.sort(function(a, b) {
            return b.distance - a.distance;
        });
    }
    function addViews(pois) {
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            $.arContainer.add(poi.view);
        }
    }
    function createRadarBlips(pois) {
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            var displayBlip = Ti.UI.createView({
                height: "3dp",
                width: "3dp",
                backgroundColor: "white",
                borderRadius: 2
            });
            poi.blip = displayBlip;
            positionRadarBlip(poi);
            radar.add(displayBlip);
        }
    }
    function positionRadarBlip(poi) {
        var rad = toRad(poi.bearing);
        var relativeDistance = poi.distance / (1.2 * maxRange);
        var x = 40 + 40 * relativeDistance * Math.sin(rad);
        var y = 40 - 40 * relativeDistance * Math.cos(rad);
        poi.blip.left = x - 1 + "dp";
        poi.blip.top = y - 1 + "dp";
        Ti.API.info("blip position: " + poi.blip.top + ", " + poi.blip.left);
    }
    function findAngularDistance(theta1, theta2) {
        a = theta1 - theta2;
        a > 180 && (a -= 360);
        -180 > a && (a += 360);
    }
    function toRad(val) {
        return val * Math.PI / 180;
    }
    function calculateBearing(point1, point2) {
        var lat1 = toRad(point1.latitude);
        var lat2 = toRad(point2.latitude);
        var dlng = toRad(point2.longitude - point1.longitude);
        var y = Math.sin(dlng) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlng);
        var brng = Math.atan2(y, x);
        return (brng * (180 / Math.PI) + 360) % 360;
    }
    function calculateDistance(loc1, loc2) {
        var R = 6371;
        var dLat = toRad(loc2.latitude - loc1.latitude);
        var dLon = toRad(loc2.longitude - loc1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 1e3 * R * c;
    }
    new (require("alloy/widget"))("ArView");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        modal: true,
        navBarHidden: true,
        fullscreen: true,
        orientationModes: [ Ti.UI.PORTRAIT ],
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.overlay = Ti.UI.createView({
        top: 0,
        left: 0,
        backgroundColor: "transparent",
        id: "overlay"
    });
    $.__views.win.add($.__views.overlay);
    $.__views.arContainer = Ti.UI.createView({
        top: 0,
        left: 0,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: "transparent",
        id: "arContainer"
    });
    $.__views.overlay.add($.__views.arContainer);
    $.__views.closeButton = Ti.UI.createButton({
        top: "5dp",
        right: "5dp",
        height: "45dp",
        width: "45dp",
        backgroundImage: "/images/ArView/close.png",
        id: "closeButton"
    });
    $.__views.overlay.add($.__views.closeButton);
    $.__views.radarView = Ti.UI.createView({
        backgroundImage: "/images/ArView/radar.png",
        width: "80dp",
        height: "80dp",
        bottom: "10dp",
        left: "10dp",
        opacity: .7,
        id: "radarView"
    });
    $.__views.overlay.add($.__views.radarView);
    $.__views.headingLabel = Ti.UI.createLabel({
        bottom: "20dp",
        height: "20dp",
        text: "",
        textAlign: "center",
        color: "white",
        backgroundColor: "black",
        opacity: .5,
        font: {
            fontSize: "12dp"
        },
        id: "headingLabel"
    });
    $.__views.overlay.add($.__views.headingLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var params = arguments[0] || {};
    var isAndroid = "android" == Ti.Platform.osname;
    if (isAndroid) {
        var screenWidth = Ti.Platform.displayCaps.platformHeight;
        var screenHeight = Ti.Platform.displayCaps.platformWidth;
    } else {
        var screenWidth = Ti.Platform.displayCaps.platformWidth;
        var screenHeight = Ti.Platform.displayCaps.platformHeight;
    }
    var overlay = $.overlay;
    overlay.height = screenHeight;
    overlay.width = screenWidth;
    Math.floor(screenHeight / 6);
    Math.floor(3 * (screenHeight / 4));
    Ti.Geolocation.headingFilter = 1;
    Ti.Geolocation.showCalibration = false;
    if (isAndroid) {
        Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
    } else {
        Ti.Geolocation.distanceFilter = 10;
        Ti.Geolocation.preferredProvider = "gps";
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
        Ti.Geolocation.purpose = "Augmented Reality";
    }
    var deviceLocation = null;
    var deviceBearing = 1;
    $.arContainer;
    var headingLabel = $.headingLabel;
    var radar = $.radarView;
    params.overlay && overlay.add(params.overlay);
    var win = $.win;
    var maxRange = 1e3;
    params.maxDistance && (maxRange = params.maxDistance);
    win.addEventListener("open", function() {
        Ti.API.debug("AR Window Open...");
        setTimeout(showAR, 500);
    });
    $.closeButton.addEventListener("click", closeAR);
    params.initialLocation && (deviceLocation = params.initialLocation);
    params.pois && assignPOIs(params.pois);
    exports = {
        findAngularDistance: findAngularDistance,
        calculateDistance: calculateDistance,
        calculateBearing: calculateBearing,
        toRad: toRad,
        doClose: doClose,
        closeAR: closeAR
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;