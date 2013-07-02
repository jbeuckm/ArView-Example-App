exports.definition = {
    config: {
        columns: {
            id: "TEXT",
            name: "TEXT",
            icon: "TEXT",
            vicinity: "TEXT",
            reference: "TEXT",
            formatted_phone_number: "TEXT",
            website: "TEXT"
        },
        defaults: {},
        adapter: {
            type: "googlePlacesAdapter",
            collection_name: "GooglePlaces"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            idAttribute: "id"
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("GooglePlace", exports.definition, []);

collection = Alloy.C("GooglePlace", exports.definition, model);

exports.Model = model;

exports.Collection = collection;