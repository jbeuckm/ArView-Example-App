module.exports.sync = function(method, model, options) {
    var globals = require("globals");
    switch (method) {
      case "read":
        if (model.get("reference")) {
            var xhr = Ti.Network.createHTTPClient({
                onerror: function(e) {
                    options.error(e);
                },
                onload: function() {
                    if (200 == this.status) {
                        var resp = JSON.parse(this.responseText);
                        options.success({
                            formatted_phone_number: resp.result.formatted_phone_number,
                            website: resp.result.website
                        });
                    } else {
                        globals.ajaxError("There was a problem finding place details with google.");
                        options.error(this.responseText);
                    }
                }
            });
            var params = {
                key: globals.googleApiKey,
                sensor: "true",
                reference: options.reference
            };
            var request = globals.googlePlaceDetailUrl + "?" + require("utilities").serialize(params);
            xhr.open("GET", request);
            xhr.send();
        } else {
            var params = {
                key: globals.googleApiKey,
                location: [ options.loc.latitude, options.loc.longitude ],
                rankby: "distance",
                sensor: "true",
                types: [ "beauty_salon", "food", "restaurant", "meal_takeaway", "clothing_store", "department_store", "electronics_store", "grocery_or_supermarket" ]
            };
            var xhr = Ti.Network.createHTTPClient({
                onerror: function(e) {
                    Ti.API.info("ERROR LOADING GOOGLE PLACES");
                    Ti.API.info(JSON.stringify(e));
                    options.error(e);
                },
                onload: function() {
                    if (200 == this.status) {
                        var resp = JSON.parse(this.responseText);
                        nextPageToken = resp["next_page_token"];
                        Ti.API.info("adapter found places " + resp.results.length);
                        options.success(resp.results);
                    } else options.error(this.responseText);
                }
            });
            var request = globals.googleNearbyPlacesUrl;
            request += "?" + require("utilities").serialize(params);
            xhr.open("GET", request);
            xhr.send();
        }
        break;

      case "create":
        options.error("create not implemented");
        break;

      case "update":
        options.error("update not implemented");
        break;

      case "delete":
        options.error("delete not implemented");
    }
};

module.exports.beforeModelCreate = function(config) {
    config = config || {};
    return config;
};

module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
};