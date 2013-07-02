function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ArView/" + s : s.substring(0, index) + "/ArView/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
}

function Controller() {
    function accelerate(e) {
        viewAngle = Math.atan2(e.y, e.z);
        yOffset = stability * yOffset + volatility * halfScreenHeight * (viewAngle + PI_2);
        updatePoiViews();
    }
    function showAR() {
        var cameraTransform = Ti.UI.create2DMatrix();
        cameraTransform = cameraTransform.scale(1);
        Ti.Geolocation.addEventListener("heading", headingCallback);
        Ti.Geolocation.addEventListener("location", locationCallback);
        Ti.Media.showCamera({
            success: function() {},
            cancel: function() {
                closeAR();
            },
            error: function() {
                Ti.API.error("unable to open camera view");
            },
            mediaTypes: [ Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO ],
            showControls: false,
            autohide: false,
            autofocus: "off",
            animated: false,
            overlay: overlay,
            transform: cameraTransform
        });
    }
    function closeAR() {
        acc.destroy();
        Ti.Geolocation.removeEventListener("heading", headingCallback);
        Ti.Geolocation.removeEventListener("location", locationCallback);
        isAndroid || Ti.Media.hideCamera();
        setTimeout(function() {
            $.win.close();
        }, 500);
    }
    function doClose() {
        closeAR();
    }
    function assignPOIs(_pois) {
        pois = _pois;
        attachArViewsToPois(pois);
        addViews();
        createRadarBlips();
        deviceLocation && deviceBearing && updateRelativePositions();
    }
    function poiClick(e) {
        Ti.API.info(e.source);
    }
    function locationCallback(e) {
        deviceLocation = e.coords;
        if (!deviceLocation) {
            Ti.API.warn("location not known. Can't draw pois");
            return;
        }
        updateRelativePositions();
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            positionRadarBlip(poi);
        }
        updatePoiViews();
    }
    function headingCallback(e) {
        deviceBearing = e.heading.trueHeading;
        headingLabel.text = Math.floor(deviceBearing) + "°";
        radar.transform = Ti.UI.create2DMatrix().rotate(-1 * deviceBearing);
        updatePoiViews();
    }
    function updateRelativePositions() {
        minPoiDistance = 1e6;
        maxPoiDistance = 0;
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            if (poi.view) {
                poi.distance = calculateDistance(deviceLocation, poi);
                if (maxRange && maxRange >= poi.distance) {
                    maxPoiDistance = Math.max(maxPoiDistance, poi.distance);
                    minPoiDistance = Math.min(minPoiDistance, poi.distance);
                    poi.inRange = true;
                    poi.bearing = calculateBearing(deviceLocation, poi);
                    positionRadarBlip(poi);
                } else poi.inRange = false;
            } else poi.inRange = false;
        }
        poiDistanceRange = maxPoiDistance - minPoiDistance;
        pois.sort(function(a, b) {
            return b.distance - a.distance;
        });
        for (i = 0, l = pois.length; l > i; i++) pois[i].view.zIndex = i;
    }
    function updatePoiViews() {
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            if (poi.inRange) {
                poi.blip.visible = true;
                var horizontalPositionInScene = projectBearingIntoScene(poi.bearing);
                if (horizontalPositionInScene > limitLeft && limitRight > horizontalPositionInScene) {
                    poi.view.visible = true;
                    var transform = Ti.UI.create2DMatrix();
                    var distanceRank = (poi.distance - minPoiDistance) / poiDistanceRange;
                    var y = lowY + distanceRank * yRange + yOffset;
                    transform = transform.translate(horizontalPositionInScene, y);
                    var scale = maxPoiScale - distanceRank * poiScaleRange;
                    transform = transform.scale(scale);
                    poi.view.transform = transform;
                } else poi.view.visible = false;
            } else {
                poi.view.visible = false;
                poi.blip.visible = false;
            }
        }
    }
    function addViews() {
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            if (poi.view) {
                poi.view.addEventListener("click", poiClick);
                poi.view.visible = false;
                poi.inRange = true;
                $.arContainer.add(poi.view);
            }
        }
    }
    function createRadarBlips() {
        for (i = 0, l = pois.length; l > i; i++) {
            var poi = pois[i];
            poi.blip = require("/alloy").createWidget("ArView", "blip", {}).getView();
            positionRadarBlip(poi);
            radar.add(poi.blip);
        }
    }
    function positionRadarBlip(poi) {
        var rad = toRad(poi.bearing);
        var relativeDistance = poi.distance / (1.2 * maxRange);
        var x = 40 + 40 * relativeDistance * Math.sin(rad);
        var y = 40 - 40 * relativeDistance * Math.cos(rad);
        poi.blip.left = x - 1 + "dp";
        poi.blip.top = y - 1 + "dp";
    }
    function projectBearingIntoScene(poiBearing) {
        var delta = findAngularDistance(poiBearing, deviceBearing);
        return delta * screenWidth / FIELD_OF_VIEW;
    }
    function findAngularDistance(theta1, theta2) {
        var a = theta1 - theta2;
        a > 180 && (a -= 360);
        -180 > a && (a += 360);
        return a;
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
    function attachArViewsToPois(pois) {
        for (var i = 0; pois.length > i; i++) {
            var poi = pois[i];
            var view = require("/alloy").createWidget("ArView", "poi", {
                id: poi.id,
                title: poi.title,
                image: poi.image,
                rating: "rating: " + poi.rating
            }).getView();
            poi.view = view;
        }
    }
    new (require("alloy/widget"))("ArView");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        layout: null,
        backgroundColor: "#666",
        modal: true,
        navBarHidden: true,
        fullscreen: true,
        orientationModes: [ Ti.UI.PORTRAIT ],
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.overlay = Ti.UI.createView({
        layout: null,
        top: 0,
        left: 0,
        backgroundColor: "transparent",
        id: "overlay"
    });
    $.__views.win.add($.__views.overlay);
    $.__views.arContainer = Ti.UI.createView({
        layout: null,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        id: "arContainer"
    });
    $.__views.overlay.add($.__views.arContainer);
    $.__views.radarView = Ti.UI.createView({
        layout: null,
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
    var args = arguments[0] || {};
    var isAndroid = true;
    if (isAndroid) {
        var screenWidth = Ti.Platform.displayCaps.platformHeight;
        var screenHeight = Ti.Platform.displayCaps.platformWidth;
    } else {
        var screenWidth = Ti.Platform.displayCaps.platformWidth;
        var screenHeight = Ti.Platform.displayCaps.platformHeight;
    }
    var halfScreenHeight = screenHeight / 2;
    var halfScreenWidth = screenWidth / 2;
    var overlay = $.overlay;
    overlay.height = screenHeight;
    overlay.width = screenWidth;
    $.arContainer.height = screenHeight;
    $.arContainer.width = screenWidth;
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
    var yOffset = 0;
    var stability = .6;
    var volatility = 1 - stability;
    var PI_2 = Math.PI / 2;
    var viewAngle;
    var acc = require(WPATH("accelerometer"));
    acc.setupCallback(accelerate);
    acc.start();
    var deviceLocation = null;
    var deviceBearing = 1;
    $.arContainer;
    var headingLabel = $.headingLabel;
    var radar = $.radarView;
    args.overlay && overlay.add(args.overlay);
    var FIELD_OF_VIEW = 30;
    var maxRange = 1e3;
    args.maxDistance && (maxRange = args.maxDistance);
    $.win.addEventListener("open", function() {
        Ti.API.debug("AR Window Open...");
        setTimeout(showAR, 500);
    });
    $.closeButton.addEventListener("click", closeAR);
    args.initialLocation && (deviceLocation = args.initialLocation);
    args.pois && assignPOIs(args.pois);
    var minPoiDistance, maxPoiDistance;
    var minPoiScale = .3, maxPoiScale = 1;
    var poiScaleRange = maxPoiScale - minPoiScale;
    var limitLeft = -halfScreenWidth - 100;
    var limitRight = +halfScreenWidth + 100;
    var lowY = .8 * (screenHeight / 2);
    var highY = .8 * (-screenHeight / 2);
    var yRange = highY - lowY;
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