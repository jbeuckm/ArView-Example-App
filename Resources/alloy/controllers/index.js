function Controller() {
    function arViewButton() {
        arWin = require("/alloy").createWidget("ArView", null, {
            pois: pois,
            overlay: null,
            maxDistance: 500,
            initialLocation: loc
        }).getView();
        arWin.addEventListener("close", function() {
            arWindowOpen = false;
            arWin = null;
        });
        arWin.open();
    }
    function mapViewButton() {
        var map = Alloy.createController("mapview", {
            loc: loc,
            pois: pois
        }).getView();
        $.nav.open(map, {
            animated: true
        });
    }
    function listViewButton() {
        var list = Alloy.createController("listview", {
            loc: loc,
            pois: pois
        }).getView();
        $.nav.open(list, {
            animated: true
        });
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
    Alloy.Collections.instance("GooglePlace");
    $.__views.win = Ti.UI.createWindow({
        layout: "vertical",
        backgroundColor: "#666",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId3 = Ti.UI.createWindow({
        layout: "vertical",
        backgroundColor: "#666",
        title: "ArView Demo",
        id: "__alloyId3"
    });
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        id: "activityIndicator"
    });
    $.__views.__alloyId3.add($.__views.activityIndicator);
    $.__views.buttonHolder = Ti.UI.createView({
        layout: "vertical",
        id: "buttonHolder"
    });
    $.__views.__alloyId3.add($.__views.buttonHolder);
    $.__views.__alloyId4 = Ti.UI.createButton({
        top: 10,
        title: "Map View",
        id: "__alloyId4"
    });
    $.__views.buttonHolder.add($.__views.__alloyId4);
    mapViewButton ? $.__views.__alloyId4.addEventListener("click", mapViewButton) : __defers["$.__views.__alloyId4!click!mapViewButton"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        top: 10,
        title: "A-R View",
        id: "__alloyId5"
    });
    $.__views.buttonHolder.add($.__views.__alloyId5);
    arViewButton ? $.__views.__alloyId5.addEventListener("click", arViewButton) : __defers["$.__views.__alloyId5!click!arViewButton"] = true;
    $.__views.__alloyId6 = Ti.UI.createButton({
        top: 10,
        title: "List View",
        id: "__alloyId6"
    });
    $.__views.buttonHolder.add($.__views.__alloyId6);
    listViewButton ? $.__views.__alloyId6.addEventListener("click", listViewButton) : __defers["$.__views.__alloyId6!click!listViewButton"] = true;
    $.__views.nav = Ti.UI.iPhone.createNavigationGroup({
        window: $.__views.__alloyId3,
        id: "nav"
    });
    $.__views.win.add($.__views.nav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var pois = [];
    var loc;
    loc = "google_sdk" == Titanium.Platform.model || "Simulator" == Titanium.Platform.model ? {
        latitude: 37.78583526611328,
        longitude: -122.40641784667969
    } : {
        latitude: 44.977329,
        longitude: -93.267714
    };
    try {
        exports.close = function() {
            winBase.close();
            mapWin = null;
            winBase = null;
        };
        Ti.API.info("Running in TiShadow");
    } catch (e) {
        Ti.API.info("Running stand-alone");
    }
    Alloy.Collections.GooglePlace.on("reset", function() {
        var places = Alloy.Collections.GooglePlace.toJSON();
        for (i = 0, l = places.length; l > i; i++) pois.push(convertGooglePlaceToPoi(places[i]));
        $.buttonHolder.visible = true;
        $.activityIndicator.hide();
    });
    $.buttonHolder.visible = false;
    $.activityIndicator.show();
    Alloy.Collections.GooglePlace.fetch({
        loc: loc
    });
    $.win.open();
    __defers["$.__views.__alloyId4!click!mapViewButton"] && $.__views.__alloyId4.addEventListener("click", mapViewButton);
    __defers["$.__views.__alloyId5!click!arViewButton"] && $.__views.__alloyId5.addEventListener("click", arViewButton);
    __defers["$.__views.__alloyId6!click!listViewButton"] && $.__views.__alloyId6.addEventListener("click", listViewButton);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;