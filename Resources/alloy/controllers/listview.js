function Controller() {
    function __alloyId14() {
        var models = __alloyId13.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId11 = models[i];
            __alloyId11.__transform = {};
            var __alloyId12 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId11.__transform["title"] ? __alloyId11.__transform["title"] : __alloyId11.get("title")
            });
            rows.push(__alloyId12);
        }
        $.__views.__alloyId9.setData(rows);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    var $ = this;
    var exports = {};
    Alloy.Collections.instance("GooglePlace");
    $.__views.win = Ti.UI.createWindow({
        layout: "vertical",
        backgroundColor: "#666",
        id: "win",
        title: "List View"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId9 = Ti.UI.createTableView({
        id: "__alloyId9"
    });
    $.__views.win.add($.__views.__alloyId9);
    var __alloyId13 = Alloy.Collections["GooglePlace"] || GooglePlace;
    __alloyId13.on("fetch destroy change add remove reset", __alloyId14);
    exports.destroy = function() {
        __alloyId13.off("fetch destroy change add remove reset", __alloyId14);
    };
    _.extend($, $.__views);
    arguments[0] || {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;