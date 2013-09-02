

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
        address: "The North",
        image: "/images/north.jpg",
        latitude: loc.latitude + .01,
        longitude: loc.longitude,
        rating: 5.0, 
        title: "North"
});
pois.push({
        address: "The South",
        image: "/images/south.jpg",
        latitude: loc.latitude - .01,
        longitude: loc.longitude,
        rating: 5.0, 
        title: "South"
});
pois.push({
        address: "The East",
        image: "/images/east.jpg",
        latitude: loc.latitude,
        longitude: loc.longitude + .01,
        rating: 5.0, 
        title: "East"
});
pois.push({
        address: "The West",
        image: "/images/west.jpg",
        latitude: loc.latitude,
        longitude: loc.longitude - .01,
        rating: 5.0, 
        title: "West"
});



function arViewButton() {
	var arWin = require('/alloy').createWidget('ArView', null, {
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




$.win.open();

