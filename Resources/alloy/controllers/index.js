function Controller() {
    function arViewButton() {
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
    function mapViewButton() {}
    function listViewButton() {}
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("GooglePlace");
    $.__views.win = Ti.UI.createWindow({
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        id: "activityIndicator"
    });
    $.__views.win.add($.__views.activityIndicator);
    $.__views.__alloyId3 = Ti.UI.createButton({
        title: "Map View",
        id: "__alloyId3"
    });
    $.__views.win.add($.__views.__alloyId3);
    mapViewButton ? $.__views.__alloyId3.addEventListener("click", mapViewButton) : __defers["$.__views.__alloyId3!click!mapViewButton"] = true;
    $.__views.__alloyId4 = Ti.UI.createButton({
        title: "A-R View",
        id: "__alloyId4"
    });
    $.__views.win.add($.__views.__alloyId4);
    arViewButton ? $.__views.__alloyId4.addEventListener("click", arViewButton) : __defers["$.__views.__alloyId4!click!arViewButton"] = true;
    $.__views.__alloyId5 = Ti.UI.createButton({
        title: "List View",
        id: "__alloyId5"
    });
    $.__views.win.add($.__views.__alloyId5);
    listViewButton ? $.__views.__alloyId5.addEventListener("click", listViewButton) : __defers["$.__views.__alloyId5!click!listViewButton"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
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
    $.win.open();
    __defers["$.__views.__alloyId3!click!mapViewButton"] && $.__views.__alloyId3.addEventListener("click", mapViewButton);
    __defers["$.__views.__alloyId4!click!arViewButton"] && $.__views.__alloyId4.addEventListener("click", arViewButton);
    __defers["$.__views.__alloyId5!click!listViewButton"] && $.__views.__alloyId5.addEventListener("click", listViewButton);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;