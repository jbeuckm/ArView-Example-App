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

var Alloy = require("/alloy");

var loc = {
    latitude: 44.977329,
    longitude: -93.267714
};

var isAndroid = true;

var win;

exports.createHomeWindow = function() {
    win = Ti.UI.createWindow({
        title: "parmaVision",
        fullScreen: false
    });
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
    return win;
};

var overlay = Ti.UI.createLabel({
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
    }
});

var button = Ti.UI.createButton({
    title: "AR",
    width: "60dp",
    height: "40dp",
    right: "5dp",
    top: "2dp"
});

button.addEventListener("click", function() {
    arWin = require("/alloy").createWidget("ArView", null, {
        pois: pois,
        overlay: overlay,
        maxDistance: 1e4
    }).getView();
    arWin.addEventListener("close", function() {
        arWindowOpen = false;
        arWin = null;
    });
    arWin.open();
});

var pois = [];

Alloy.Collections.GooglePlace = Alloy.createCollection("GooglePlace");

Alloy.Collections.GooglePlace.on("reset", function() {
    var places = Alloy.Collections.GooglePlace.toJSON();
    for (i = 0, l = places.length; l > i; i++) pois.push(convertGooglePlaceToPoi(places[i]));
    var anns = createMapAnnotationsFromPois(pois);
    showMap(anns);
    isAndroid ? titleBar.add(button) : win.rightNavButton = button;
});

Alloy.Collections.GooglePlace.fetch({
    loc: loc
});