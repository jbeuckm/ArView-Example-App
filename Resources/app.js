var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

var Alloy = require("/alloy");

Alloy.Globals.googleNearbyPlacesUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

Alloy.Globals.googlePlaceDetailUrl = "https://maps.googleapis.com/maps/api/place/details/json";

Alloy.Globals.googleApiKey = "AIzaSyDV44bmXbcfcTzBuIvEwkSW7L0Th25iGuE";

Alloy.createController("index");