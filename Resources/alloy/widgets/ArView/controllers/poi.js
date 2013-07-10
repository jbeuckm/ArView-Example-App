function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "ArView/" + s : s.substring(0, index) + "/ArView/" + s.substring(index + 1);
    return path;
}

function Controller() {
    new (require("alloy/widget"))("ArView");
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    $.__views.poiView = Ti.UI.createView({
        layout: "horizontal",
        height: "28dp",
        width: Ti.UI.SIZE,
        backgroundColor: "white",
        opacity: .6,
        id: "poiView"
    });
    $.__views.poiView && $.addTopLevelView($.__views.poiView);
    $.__views.poiImage = Ti.UI.createImageView({
        width: "24dp",
        height: "24dp",
        left: "2dp",
        id: "poiImage"
    });
    $.__views.poiView.add($.__views.poiImage);
    $.__views.titleLabel = Ti.UI.createLabel({
        color: "#000",
        width: Ti.UI.SIZE,
        font: {
            fontSize: "20dp",
            fontWeight: "bold"
        },
        top: "3dp",
        right: "7dp",
        left: "3dp",
        id: "titleLabel"
    });
    $.__views.poiView.add($.__views.titleLabel);
    $.__views.distanceLabel = Ti.UI.createLabel({
        color: "#000",
        width: Ti.UI.SIZE,
        font: {
            fontSize: "16dp"
        },
        top: "6dp",
        right: "5dp",
        id: "distanceLabel"
    });
    $.__views.poiView.add($.__views.distanceLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.poiView.modelId = args.id;
    $.titleLabel.text = args.title;
    exports.setDistance = function(d) {
        $.distanceLabel.text = d;
    };
    args.image ? $.poiImage.image = args.image : $.poiImage.visible = false;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;