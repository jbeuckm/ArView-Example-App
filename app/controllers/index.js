//var Alloy = require('/alloy');


Ti.API.info(Ti.Platform.model);

var loc;
if (Titanium.Platform.model == 'google_sdk' || Titanium.Platform.model == 'Simulator') { 
	loc = {
		latitude : 37.78583526611328,
		longitude : -122.40641784667969
	};
}
else {
	loc = {
		latitude : 44.977329,
		longitude : -93.267714
	}
}


try {
	exports.close = function() {
		winBase.close();
		mapWin = null;
		winBase = null;
	};
	Ti.API.info("Running in TiShadow");
} catch (e) {
	Ti.API.info("Running stand-alone");
}



function arViewButton() {
	arWin = require('/alloy').createWidget('ArView', null, {
		pois : pois,
		overlay : null,
		maxDistance : 500, //in m
		initialLocation: loc
	}).getView();
	
	arWin.addEventListener('close', function() {
		arWindowOpen = false;
		arWin = null;
	});
	
	arWin.open();
}

function mapViewButton() {
	
	var map = Alloy.createController('mapview', {
		loc: loc,
		pois: pois
	}).getView();

	map.open();
}

function listViewButton() {
	
	var list = Alloy.createController('listview', {
		loc: loc,
		pois: pois
	}).getView();

	list.open();
}


function convertGooglePlaceToPoi(place) {
	return {
		address: place.vicinity,
		image: place.icon,
		latitude: place.geometry.location.lat,
		longitude: place.geometry.location.lng,
		link: place.icon,
		rating: 5.0, 
		title: place.name
	};
}

//Alloy.Collections.GooglePlace = Alloy.createCollection('GooglePlace');

var pois = [];

Alloy.Collections.GooglePlace.on('reset', function(e){ 
	
	var places = Alloy.Collections.GooglePlace.toJSON();
	
	for (i=0, l=places.length; i<l; i++) {
		pois.push(convertGooglePlaceToPoi(places[i]));
	}
	
	$.buttonHolder.visible = true;
	$.activityIndicator.hide();

});


$.buttonHolder.visible = false;
$.activityIndicator.show();
Alloy.Collections.GooglePlace.fetch({
	loc: loc
});


$.win.open();

