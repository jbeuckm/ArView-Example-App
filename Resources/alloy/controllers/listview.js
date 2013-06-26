function Controller() {
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
    $.__views.overlay = Ti.UI.createLabel({
        id: "overlay"
    });
    $.__views.win.add($.__views.overlay);
    $.__views.arViewButton = Ti.UI.createButton({
        id: "arViewButton"
    });
    $.__views.win.add($.__views.arViewButton);
    arViewButtonClick ? $.__views.arViewButton.addEventListener("click", arViewButtonClick) : __defers["$.__views.arViewButton!click!arViewButtonClick"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    __defers["$.__views.arViewButton!click!arViewButtonClick"] && $.__views.arViewButton.addEventListener("click", arViewButtonClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;