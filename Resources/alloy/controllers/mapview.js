function Controller() {
    function attachArViewsToPois(pois) {
        for (var i = 0; pois.length > i; i++) {
            var poi = pois[i];
            var view = Ti.UI.createView({
                height: "150dp",
                width: "150dp",
                backgroundColor: "black",
                opacity: .6,
                borderRadius: 5
            });
            var label = Ti.UI.createLabel({
                textAlign: "center",
                text: poi.title,
                color: "white",
                font: {
                    fontSize: "18dp",
                    fontWeight: "bold"
                },
                height: "42dp",
                top: "5dp"
            });
            view.add(label);
            if (poi.image) {
                var image = Ti.UI.createImageView({
                    width: "130dp",
                    height: "65dp",
                    top: "57dp",
                    image: poi.image
                });
                view.add(image);
            }
            var rating = Ti.UI.createLabel({
                textAlign: "center",
                text: "rating: " + poi.rating,
                color: "white",
                font: {
                    fontSize: "14dp",
                    fontWeight: "bold"
                },
                height: "20dp",
                bottom: "5dp"
            });
            view.add(rating);
            view.addEventListener("click", function(e) {
                if (!e.poi) return;
                alert(e.poi.title + " got a click!");
            });
            poi.view = view;
        }
    }
    function createMapAnnotationsFromPois(pois) {
        var annotations = [];
        for (var i = 0; pois.length > i; i++) {
            var poi = pois[i];
            var annotation = Ti.Map.createAnnotation({
                latitude: poi.latitude,
                longitude: poi.longitude,
                pincolor: Ti.Map.ANNOTATION_RED,
                title: poi.title,
                subtitle: poi.address
            });
            annotations.push(annotation);
        }
        return annotations;
    }
    function showMap(annotations) {
        var map = Ti.Map.createView({
            top: win.topStart,
            mapType: Titanium.Map.STANDARD_TYPE,
            region: {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: .05,
                longitudeDelta: .05
            },
            animate: true,
            regionFit: true,
            userLocation: true,
            annotations: annotations
        });
        win.add(map);
    }
    function arViewButtonClick() {
        arWin = require("/alloy").createWidget("ArView", null, {
            pois: pois,
            overlay: $.overlay,
            maxDistance: 500,
            initialLocation: loc
        }).getView();
        arWin.addEventListener("close", function() {
            arWindowOpen = false;
            arWin = null;
        });
        arWin.open();
    }
    function convertGooglePlaceToPoi(place) {
        return {
            address: place.vicinity,
            image: place.icon,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            link: place.icon,
            rating: 5,
            title: place.name
        };
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.win = Ti.UI.createWindow({
        title: "parmaVision",
        fullScreen: false,
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.overlay = Ti.UI.createLabel({
        top: 0,
        height: "44dp",
        backgroundColor: "black",
        color: "white",
        width: Ti.UI.FILL,
        text: "parmaVision",
        opacity: .3,
        textAlign: "center",
        font: {
            fontWeight: "bold",
            fontSize: "18dp"
        },
        id: "overlay"
    });
    $.__views.overlay && $.addTopLevelView($.__views.overlay);
    $.__views.arViewButton = Ti.UI.createButton({
        title: "AR",
        width: "60dp",
        height: "40dp",
        right: "5dp",
        top: "2dp",
        id: "arViewButton"
    });
    $.__views.arViewButton && $.addTopLevelView($.__views.arViewButton);
    arViewButtonClick ? $.__views.arViewButton.addEventListener("click", arViewButtonClick) : __defers["$.__views.arViewButton!click!arViewButtonClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Alloy = require("/alloy");
    Ti.API.info(Ti.Platform.model);
    var loc;
    loc = "google_sdk" == Titanium.Platform.model || "Simulator" == Titanium.Platform.model ? {
        latitude: 37.78583526611328,
        longitude: -122.40641784667969
    } : {
        latitude: 44.977329,
        longitude: -93.267714
    };
    var isAndroid = "android" == Ti.Platform.osname;
    var win = $.win;
    win.orientationModes = [ Ti.UI.PORTRAIT ];
    if (isAndroid) {
        var titleBar = Ti.UI.createView({
            top: 0,
            height: "44dp",
            backgroundColor: "black",
            width: Ti.UI.FILL
        });
        var titleText = Ti.UI.createLabel({
            color: "white",
            text: win.title,
            textAlign: "center",
            font: {
                fontWeight: "bold",
                fontSize: "18dp"
            }
        });
        titleBar.add(titleText);
        win.add(titleBar);
        win.topStart = titleBar.height;
    } else win.topStart = 0;
    var arWin = null;
    var arWindowOpen = false;
    var pois = [];
    Alloy.Collections.GooglePlace = Alloy.createCollection("GooglePlace");
    Alloy.Collections.GooglePlace.on("reset", function() {
        var places = Alloy.Collections.GooglePlace.toJSON();
        for (i = 0, l = places.length; l > i; i++) pois.push(convertGooglePlaceToPoi(places[i]));
        var anns = createMapAnnotationsFromPois(pois);
        attachArViewsToPois(pois);
        showMap(anns);
        isAndroid ? titleBar.add($.arViewButton) : win.rightNavButton = $.arViewButton;
    });
    Alloy.Collections.GooglePlace.fetch({
        loc: loc
    });
    __defers["$.__views.arViewButton!click!arViewButtonClick"] && $.__views.arViewButton.addEventListener("click", arViewButtonClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;