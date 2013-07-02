function Controller() {
    function __alloyId19() {
        var models = __alloyId18.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId10 = models[i];
            __alloyId10.__transform = {};
            var __alloyId11 = Ti.UI.createTableViewRow({
                height: 50,
                hasDetail: "true",
                modelId: "undefined" != typeof __alloyId10.__transform["id"] ? __alloyId10.__transform["id"] : __alloyId10.get("id")
            });
            rows.push(__alloyId11);
            var __alloyId13 = Ti.UI.createImageView({
                left: 0,
                height: 40,
                image: "undefined" != typeof __alloyId10.__transform["icon"] ? __alloyId10.__transform["icon"] : __alloyId10.get("icon")
            });
            __alloyId11.add(__alloyId13);
            var __alloyId15 = Ti.UI.createLabel({
                top: 5,
                left: 65,
                font: {
                    fontSize: 20
                },
                wordWrap: false,
                text: "undefined" != typeof __alloyId10.__transform["name"] ? __alloyId10.__transform["name"] : __alloyId10.get("name")
            });
            __alloyId11.add(__alloyId15);
            var __alloyId17 = Ti.UI.createLabel({
                bottom: 5,
                left: 65,
                font: {
                    fontSize: 10
                },
                text: "undefined" != typeof __alloyId10.__transform["vicinity"] ? __alloyId10.__transform["vicinity"] : __alloyId10.get("vicinity")
            });
            __alloyId11.add(__alloyId17);
        }
        $.__views.__alloyId8.setData(rows);
    }
    function tableClick(e) {
        alert(e.row.modelId);
        Alloy.Collections.GooglePlace.where({
            id: e.row.modelId
        });
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
    $.__views.__alloyId8 = Ti.UI.createTableView({
        id: "__alloyId8"
    });
    $.__views.win.add($.__views.__alloyId8);
    var __alloyId18 = Alloy.Collections["GooglePlace"] || GooglePlace;
    __alloyId18.on("fetch destroy change add remove reset", __alloyId19);
    tableClick ? $.__views.__alloyId8.addEventListener("click", tableClick) : __defers["$.__views.__alloyId8!click!tableClick"] = true;
    exports.destroy = function() {
        __alloyId18.off("fetch destroy change add remove reset", __alloyId19);
    };
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Collections.GooglePlace.trigger("reset");
    __defers["$.__views.__alloyId8!click!tableClick"] && $.__views.__alloyId8.addEventListener("click", tableClick);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;