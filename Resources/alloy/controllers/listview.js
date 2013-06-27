function Controller() {
    function __alloyId20() {
        var models = __alloyId19.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId11 = models[i];
            __alloyId11.__transform = {};
            var __alloyId12 = Ti.UI.createTableViewRow({
                height: 50,
                hasDetail: "true",
                model: "undefined" != typeof __alloyId11.__transform["id"] ? __alloyId11.__transform["id"] : __alloyId11.get("id")
            });
            rows.push(__alloyId12);
            var __alloyId14 = Ti.UI.createImageView({
                left: 0,
                height: 40,
                image: "undefined" != typeof __alloyId11.__transform["icon"] ? __alloyId11.__transform["icon"] : __alloyId11.get("icon")
            });
            __alloyId12.add(__alloyId14);
            var __alloyId16 = Ti.UI.createLabel({
                top: 5,
                left: 65,
                font: {
                    fontSize: 20
                },
                wordWrap: false,
                text: "undefined" != typeof __alloyId11.__transform["name"] ? __alloyId11.__transform["name"] : __alloyId11.get("name")
            });
            __alloyId12.add(__alloyId16);
            var __alloyId18 = Ti.UI.createLabel({
                bottom: 5,
                left: 65,
                font: {
                    fontSize: 10
                },
                text: "undefined" != typeof __alloyId11.__transform["vicinity"] ? __alloyId11.__transform["vicinity"] : __alloyId11.get("vicinity")
            });
            __alloyId12.add(__alloyId18);
        }
        $.__views.__alloyId9.setData(rows);
    }
    function tableClick(e) {
        alert(JSON.stringify(e));
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
        id: "win",
        title: "List View"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId9 = Ti.UI.createTableView({
        id: "__alloyId9"
    });
    $.__views.win.add($.__views.__alloyId9);
    var __alloyId19 = Alloy.Collections["GooglePlace"] || GooglePlace;
    __alloyId19.on("fetch destroy change add remove reset", __alloyId20);
    tableClick ? $.__views.__alloyId9.addEventListener("click", tableClick) : __defers["$.__views.__alloyId9!click!tableClick"] = true;
    exports.destroy = function() {
        __alloyId19.off("fetch destroy change add remove reset", __alloyId20);
    };
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Collections.GooglePlace.on("reset", function() {
        alert(Alloy.Collections.GooglePlace.at(0).toJSON());
    });
    Alloy.Collections.GooglePlace.trigger("reset");
    __defers["$.__views.__alloyId9!click!tableClick"] && $.__views.__alloyId9.addEventListener("click", tableClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;