var Alloy = require('/alloy');

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



var isAndroid = Ti.Platform.osname == 'android';

var win = $.win;

win.orientationModes = [Ti.UI.PORTRAIT];

if (isAndroid) {
	var titleBar = Ti.UI.createView({
		top : 0,
		height : '44dp',
		backgroundColor : 'black',
		width : Ti.UI.FILL
	});

	var titleText = Ti.UI.createLabel({
		color : 'white',
		text : win.title,
		textAlign : 'center',
		font : {
			fontWeight : 'bold',
			fontSize : '18dp'
		}
	});
	titleBar.add(titleText);
	win.add(titleBar);
	win.topStart = titleBar.height;
} else {
	win.topStart = 0;
}

var arWin = null;
var arWindowOpen = false;


	
function createMapAnnotationsFromPois(pois) {
	
	var annotations = [];

	for (var i=0; i < pois.length; i++) {
		
		var poi = pois[i];
		
		var annotation = Ti.Map.createAnnotation({
			latitude : poi.latitude,
			longitude : poi.longitude,
			pincolor : Ti.Map.ANNOTATION_RED,
			title : poi.title,
			subtitle : poi.address
		});
		annotations.push(annotation);
		// add the view to the parma
		var view = Ti.UI.createView({
			height : '150dp',
			width : '150dp',
			backgroundColor : 'black',
			opacity : 0.6,
			borderRadius : 5
		});
		var label = Ti.UI.createLabel({
			textAlign : 'center',
			text : poi.title,
			color : 'white',
			font : {
				fontSize : '18dp',
				fontWeight : 'bold'
			},
			height : '42dp',
			top : '5dp'
		});
		view.add(label);
		if (poi.image) {
			var image = Ti.UI.createImageView({
				width : '130dp',
				height : '65dp',
				top : '57dp',
				image : poi.image
			});
			view.add(image);
		}
		var rating = Ti.UI.createLabel({
			textAlign : 'center',
			text : "rating: " + poi.rating,
			color : 'white',
			font : {
				fontSize : '14dp',
				fontWeight : 'bold'
			},
			height : '20dp',
			bottom : '5dp'
		});
		view.add(rating);
		view.addEventListener('click', function(e) {
			// Need to do this for Android for the moment
			// because the click will fire this without a poi
			if( ! e.poi ){
				return;
			}
			alert(e.poi.title + ' got a click!');
		});
		poi.view = view;

	}
	
	return annotations;
}


function showMap(annotations) {
	
	var map = Ti.Map.createView({
		top : win.topStart,
		mapType : Titanium.Map.STANDARD_TYPE,
		region : {
			latitude : loc.latitude,
			longitude : loc.longitude,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		},
		animate : true,
		regionFit : true,
		userLocation : true,
		annotations : annotations
	});

	win.add(map);

}




function arViewButtonClick() {

	arWin = require('/alloy').createWidget('ArView', null, {
		pois : pois,
		overlay : $.overlay,
		maxDistance : 500, //in m
		initialLocation: loc
	}).getView();
	
	arWin.addEventListener('close', function() {
		arWindowOpen = false;
		arWin = null;
	});
	arWin.open();
		
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



var pois = [];

Alloy.Collections.GooglePlace = Alloy.createCollection('GooglePlace');

Alloy.Collections.GooglePlace.on('reset', function(e){ 
	var places = Alloy.Collections.GooglePlace.toJSON();
	
	for (i=0, l=places.length; i<l; i++) {
		pois.push(convertGooglePlaceToPoi(places[i]));
	}
	
	var anns = createMapAnnotationsFromPois(pois);

	showMap(anns);

	if (isAndroid) {
		titleBar.add($.arViewButton);
	} else {
		win.rightNavButton = $.arViewButton;
	}

});




Alloy.Collections.GooglePlace.fetch({
	loc: loc
});
	
