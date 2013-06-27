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
        layout: null,
        height: "150dp",
        width: "150dp",
        backgroundColor: "black",
        opacity: .6,
        borderRadius: 5,
        id: "poiView"
    });
    $.__views.poiView && $.addTopLevelView($.__views.poiView);
    $.__views.titleLabel = Ti.UI.createLabel({
        textAlign: "center",
        color: "white",
        font: {
            fontSize: "18dp",
            fontWeight: "bold"
        },
        height: "42dp",
        top: "5dp",
        id: "titleLabel"
    });
    $.__views.poiView.add($.__views.titleLabel);
    $.__views.poiImage = Ti.UI.createImageView({
        width: "130dp",
        height: "65dp",
        top: "57dp",
        id: "poiImage"
    });
    $.__views.poiView.add($.__views.poiImage);
    $.__views.ratingLabel = Ti.UI.createLabel({
        textAlign: "center",
        color: "white",
        font: {
            fontSize: "14dp",
            fontWeight: "bold"
        },
        height: "20dp",
        bottom: "5dp",
        id: "ratingLabel"
    });
    $.__views.poiView.add($.__views.ratingLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.poiView.modelId = args.id;
    $.titleLabel.text = args.title;
    $.ratingLabel.text = args.rating;
    args.image ? $.poiImage.image = args.image : $.poiImage.visible = false;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;