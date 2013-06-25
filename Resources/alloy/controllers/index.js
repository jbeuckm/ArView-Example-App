function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createWindow({
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
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
    Ti.UI.setBackgroundColor("#000");
    var mapWin = Alloy.createController("mapview").getView();
    var winBase = require("/ui/navWindow").createNavigationWindow(mapWin);
    winBase.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;