

var pois = [];

var loc;
if (Titanium.Platform.model == 'google_sdk' || Titanium.Platform.model == 'Simulator') { 
	loc = {
		latitude : 37.785835,
		longitude : -122.406417
	};
}
else {
	loc = {
		latitude : 44.977329,
		longitude : -93.267714
	};
}


pois.push({
        image: "/images/north.jpg",
        latitude: loc.latitude + .01,
        longitude: loc.longitude,
        title: "North"
});
pois.push({
        image: "/images/south.jpg",
        latitude: loc.latitude - .01,
        longitude: loc.longitude,
        title: "South"
});
pois.push({
        image: "/images/east.jpg",
        latitude: loc.latitude,
        longitude: loc.longitude + .01,
        title: "East"
});
pois.push({
        image: "/images/west.jpg",
        latitude: loc.latitude,
        longitude: loc.longitude - .01,
        title: "West"
});



function arViewButton() {
	var arWin = require('/alloy').createWidget('ArView', null, {
		pois : pois,
		overlay : null,
		maxDistance : 50000, //in m
		initialLocation: loc,
		showDebugView: true,
		staticLocation: true
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

$.win.open();

