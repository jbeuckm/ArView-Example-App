var args = arguments[0] || {};

var pois = args.pois;
var loc = args.loc;


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


function showMap(anns) {
	
	$.mapview.region = {
		latitude : loc.latitude,
		longitude : loc.longitude,
		latitudeDelta : 0.01,
		longitudeDelta : 0.01
	};
	
	for (var i=0, l=anns.length; i<l; i++) {
		$.mapview.addAnnotation(anns[i]);
	}

}


var anns = createMapAnnotationsFromPois(pois);
showMap(anns);




