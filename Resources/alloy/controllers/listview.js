function Controller() {
    function __alloyId16() {
        var models = __alloyId15.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId11 = models[i];
            __alloyId11.__transform = {};
            var __alloyId12 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId11.__transform["name"] ? __alloyId11.__transform["name"] : __alloyId11.get("name")
            });
            rows.push(__alloyId12);
            var __alloyId14 = Ti.UI.createLabel({
                text: "undefined" != typeof __alloyId11.__transform["formatted_phone_number"] ? __alloyId11.__transform["formatted_phone_number"] : __alloyId11.get("formatted_phone_number")
            });
            __alloyId12.add(__alloyId14);
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
    var __alloyId15 = Alloy.Collections["GooglePlace"] || GooglePlace;
    __alloyId15.on("fetch destroy change add remove reset", __alloyId16);
    exports.destroy = function() {
        __alloyId15.off("fetch destroy change add remove reset", __alloyId16);
    };
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Collections.GooglePlace.trigger("reset");
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;