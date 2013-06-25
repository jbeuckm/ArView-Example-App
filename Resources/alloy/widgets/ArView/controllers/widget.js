function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ArView/" + s : s.substring(0, index) + "/ArView/" + s.substring(index + 1);
    return true && 0 !== path.indexOf("/") ? "/" + path : path;
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
                closeAR();
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
        var currBearing = e.heading.trueHeading;
        var internalBearing = currBearing / (360 / views.length);
        var activeView = Math.floor(internalBearing);
        var pixelOffset = screenWidth - Math.floor(internalBearing % 1 * screenWidth);
        if (activeView != lastActiveView) {
            viewChange = true;
            lastActiveView = activeView;
        } else viewChange = false;
        for (var i = 0; views.length > i; i++) {
            var diff = activeView - i;
            if (diff >= -1 && 1 >= diff) {
                views[i].center = {
                    y: centerY,
                    x: pixelOffset + -1 * diff * screenWidth
                };
                viewChange && (views[i].visible = true);
            } else viewChange && (views[i].visible = false);
        }
        if (0 == activeView) {
            views[views.length - 1].center = {
                y: centerY,
                x: views[0].center.x - screenWidth
            };
            viewChange && (views[views.length - 1].visible = true);
        } else if (activeView == views.length - 1) {
            views[0].center = {
                y: centerY,
                x: views[views.length - 1].center.x + screenWidth
            };
            viewChange && (views[0].visible = true);
        }
        label.text = Math.floor(currBearing) + "°";
        radar.transform = Ti.UI.create2DMatrix().rotate(-1 * currBearing);
    }
    function poiClick(e) {
        Ti.API.debug("heard a click");
        Ti.API.debug("number=" + e.source.number);
        var poi = activePois[e.source.number];
        var view = poi.view;
        view.fireEvent("click", {
            source: poi.view,
            poi: poi
        });
    }
    function locationCallback(e) {
        myLocation = e.coords;
        redrawPois();
    }
    function redrawPois() {
        if (!myLocation) {
            Ti.API.warn("location not known. Can't draw pois");
            return;
        }
        for (var i = 0; views.length > i; i++) {
            var view = views[i];
            if (view.children && view.children.length > 0) for (var j = view.children.length; j > 0; j--) try {
                view.remove(view.children[j - 1]);
            } catch (e) {
                Ti.API.error("error removing child " + j + " from view");
            }
        }
        if (radar.children.length > 0) for (var j = radar.children.length; j > 0; j--) try {
            radar.remove(view.children[j - 1]);
        } catch (e) {
            Ti.API.error("error removing child " + j + " from radar");
        }
        activePois = [];
        for (var i = 0; win.pois.length > i; i++) {
            var poi = win.pois[i];
            if (poi.view) {
                var distance = exports.calculateDistance(myLocation, poi);
                var addPoint = true;
                win.maxDistance && distance > win.maxDistance && (addPoint = false);
                if (addPoint) {
                    var bearing = exports.calculateBearing(myLocation, poi);
                    var internalBearing = bearing / (360 / views.length);
                    var activeView = Math.floor(internalBearing);
                    activeView >= views.length && (activeView = 0);
                    var pixelOffset = Math.floor(internalBearing % 1 * screenWidth) + (views[0].width - screenWidth) / 2;
                    poi.distance = distance;
                    poi.pixelOffset = pixelOffset;
                    poi.activeView = activeView;
                    poi.bearing = bearing;
                    activePois.push(poi);
                } else Ti.API.debug(poi.title + " not added, maxDistance=" + win.maxDistance);
            }
        }
        activePois.sort(function(a, b) {
            return b.distance - a.distance;
        });
        var maxDistance = activePois[0].distance;
        var minDistance = activePois[activePois.length - 1].distance;
        var distanceDelta = maxDistance - minDistance;
        for (var i = 0; activePois.length > i; i++) {
            var poi = activePois[i];
            Ti.API.debug(poi.title);
            showColors && Ti.API.debug("viewColor=" + views[poi.activeView].backgroundColor);
            Ti.API.debug("bearing=" + poi.bearing);
            var distanceFromSmallest = poi.distance - minDistance;
            var percentFromSmallest = 1 - distanceFromSmallest / distanceDelta;
            var zoom = percentFromSmallest * DELTA_ZOOM + MIN_ZOOM;
            var y = MIN_Y + percentFromSmallest * DELTA_Y;
            var view = poi.view;
            var transform = Ti.UI.create2DMatrix();
            transform = transform.scale(zoom);
            view.transform = transform;
            Ti.API.debug("pixelOffset=" + poi.pixelOffset);
            view.center = {
                x: poi.pixelOffset,
                y: y
            };
            if (view.clickHandler) {
                view.clickHandler.removeEventListener("click", poiClick);
                view.remove(view.clickHandler);
                view.clickHandler = null;
            }
            var clickHandler = Ti.UI.createView({
                width: Ti.UI.FILL,
                height: Ti.UI.FILL
            });
            var number = i;
            clickHandler.number = number;
            clickHandler.addEventListener("click", poiClick);
            view.add(clickHandler);
            view.clickHandler = clickHandler;
            views[poi.activeView].add(view);
            Ti.API.debug("viewSize=" + view.width + "," + view.height);
            var clickHandler2 = Ti.UI.createView({
                width: view.width,
                height: view.height,
                transform: transform
            });
            clickHandler2.number = number;
            clickHandler2.addEventListener("click", poiClick);
            var nextView;
            var nextOffset;
            if (poi.pixelOffset > views[0].width / 2) {
                nextView = poi.activeView + 1;
                nextOffset = poi.pixelOffset - screenWidth;
            } else {
                nextView = poi.activeView - 1;
                nextOffset = poi.pixelOffset + screenWidth;
            }
            0 > nextView ? nextView = views.length - 1 : nextView == views.length && (nextView = 0);
            Ti.API.debug("nextView=" + nextView);
            Ti.API.debug("nextOffset=" + nextOffset);
            clickHandler2.center = {
                x: nextOffset,
                y: y
            };
            views[nextView].add(clickHandler2);
            var rad = toRad(poi.bearing);
            var relativeDistance = poi.distance / (1.2 * maxDistance);
            var centerX = 40 + 40 * relativeDistance * Math.sin(rad);
            var centerY = 40 - 40 * relativeDistance * Math.cos(rad);
            var displayBlip = Ti.UI.createView({
                height: "3dp",
                width: "3dp",
                backgroundColor: "white",
                borderRadius: 2,
                top: centerY - 1 + "dp",
                left: centerX - 1 + "dp"
            });
            radar.add(displayBlip);
        }
    }
    function toRad(val) {
        return val * Math.PI / 180;
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
    $.__views.overlayLabel = Ti.UI.createLabel({
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
        id: "overlayLabel"
    });
    $.__views.overlay.add($.__views.overlayLabel);
    $.__views.radarView = Ti.UI.createView({
        backgroundImage: "images/radar.png",
        width: "80dp",
        height: "80dp",
        bottom: "10dp",
        left: "10dp",
        opacity: .7,
        id: "radarView"
    });
    $.__views.overlay.add($.__views.radarView);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var params = arguments[0] || {};
    var isAndroid = true;
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
    var MAX_ZOOM = 1;
    var MIN_ZOOM = .35;
    var DELTA_ZOOM = MAX_ZOOM - MIN_ZOOM;
    var MIN_Y = Math.floor(screenHeight / 6);
    var MAX_Y = Math.floor(3 * (screenHeight / 4));
    var DELTA_Y = MAX_Y - MIN_Y;
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
    Ti.API.info("ArView() got params:");
    Ti.API.info(params);
    var views = [];
    var showColors = false;
    var colors = [ "red", "yellow", "pink", "green", "purple", "orange", "blue", "aqua", "white", "silver" ];
    var numberOfViews = 9;
    var myLocation = null;
    for (var i = 0; numberOfViews > i; i++) {
        views[i] = Ti.UI.createView({
            top: 0,
            height: screenHeight,
            right: 0,
            width: 1.6 * screenWidth,
            visible: false
        });
        if (showColors) {
            views[i].backgroundColor = colors[i];
            views[i].opacity = .5;
        }
        overlay.add(views[i]);
    }
    var label = $.overlayLabel;
    var radar = $.radarView;
    params.overlay && overlay.add(params.overlay);
    if (!isAndroid) {
        var button = Ti.UI.createButton({
            top: "5dp",
            right: "5dp",
            height: "45dp",
            width: "45dp",
            backgroundImage: WPATH("images/close.png")
        });
        button.addEventListener("click", closeAR);
        overlay.add(button);
    }
    var lastActiveView = -1;
    var viewChange = false;
    var centerY = screenHeight / 2;
    var activePois;
    var win = $.win;
    params.maxDistance && (win.maxDistance = params.maxDistance);
    win.doClose = function() {
        closeAR();
    };
    win.addEventListener("open", function() {
        Ti.API.debug("AR Window Open...");
        setTimeout(showAR, 500);
    });
    win.assignPOIs = function(pois) {
        win.pois = pois;
    };
    params.pois && win.assignPOIs(params.pois);
    exports.calculateBearing = function(point1, point2) {
        var lat1 = toRad(point1.latitude);
        var lat2 = toRad(point2.latitude);
        var dlng = toRad(point2.longitude - point1.longitude);
        var y = Math.sin(dlng) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlng);
        var brng = Math.atan2(y, x);
        return (brng * (180 / Math.PI) + 360) % 360;
    };
    exports.calculateDistance = function(loc1, loc2) {
        var R = 6371;
        var dLat = toRad(loc2.latitude - loc1.latitude);
        var dLon = toRad(loc2.longitude - loc1.longitude);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 1e3 * R * c;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;