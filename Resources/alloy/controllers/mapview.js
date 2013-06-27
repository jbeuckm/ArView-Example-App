function Controller() {
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
            mapType: Titanium.Map.STANDARD_TYPE,
            region: {
                latitude: loc.latitude,
                longitude: loc.longitude,
                latitudeDelta: .01,
                longitudeDelta: .01
            },
            animate: true,
            regionFit: true,
            userLocation: true,
            annotations: annotations
        });
        $.win.add(map);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    Alloy.Collections.instance("GooglePlace");
    $.__views.win = Ti.UI.createWindow({
        layout: "vertical",
        id: "win",
        title: "Map View"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var pois = args.pois;
    var loc = args.loc;
    var anns = createMapAnnotationsFromPois(pois);
    showMap(anns);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;