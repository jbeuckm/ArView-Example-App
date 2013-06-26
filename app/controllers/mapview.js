


var isAndroid = Ti.Platform.osname == 'android';

var win = $.win;

win.orientationModes = [Ti.UI.PORTRAIT];

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




var pois = [];




