var params = arguments[0] || {};


var isAndroid = Ti.Platform.osname == 'android';

if (isAndroid) {
	// Landscape Mode
	var screenWidth = Ti.Platform.displayCaps.platformHeight;
	var screenHeight = Ti.Platform.displayCaps.platformWidth;
} else {
	var screenWidth = Ti.Platform.displayCaps.platformWidth;
	var screenHeight = Ti.Platform.displayCaps.platformHeight;
}

var overlay = $.overlay;
overlay.height = screenHeight;
overlay.width = screenWidth;


var MAX_ZOOM = 1.0;
var MIN_ZOOM = 0.35;
var DELTA_ZOOM = MAX_ZOOM - MIN_ZOOM;

var MIN_Y = Math.floor(screenHeight / 6);

var MAX_Y = Math.floor(screenHeight / 4 * 3);
var DELTA_Y = MAX_Y - MIN_Y;

// Setup the location  properties for callbacks
Ti.Geolocation.headingFilter = 1;
Ti.Geolocation.showCalibration = false;

if (isAndroid) {
	Ti.Geolocation.Android.accuracy = Ti.Geolocation.ACCURACY_HIGH;
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
} else {
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	Ti.Geolocation.purpose = "Augmented Reality";
}


/*
var accelerometerCallback = function(e) {
  labelTimestamp.text = 'timestamp: ' + e.timestamp;
  labelx.text = 'x: ' + e.x;
  labely.text = 'y: ' + e.y;
  labelz.text = 'z: ' + e.z;
};

if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1 ){
  alert('Accelerometer does not work on a virtual device');
} else {
  Ti.Accelerometer.addEventListener('update', accelerometerCallback);
  if (Ti.Platform.name === 'android'){
    Ti.Android.currentActivity.addEventListener('pause', function(e) {
      Ti.API.info("removing accelerometer callback on pause");
      Ti.Accelerometer.removeEventListener('update', accelerometerCallback);
    });
    Ti.Android.currentActivity.addEventListener('resume', function(e) {
      Ti.API.info("adding accelerometer callback on resume");
      Ti.Accelerometer.addEventListener('update', accelerometerCallback);
    });
  }
}
*/

function showAR() {
	Ti.Geolocation.addEventListener('heading', headingCallback);
	Ti.Geolocation.addEventListener('location', locationCallback);
	Ti.Media.showCamera({
		success : function(event) {
		},
		cancel : function() {
			// only gets called if Android
			closeAR();
		},
		error : function(error) {
			alert('unable to open AR Window');
//			closeAR();
		},
		mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO],
		showControls : false,
		autohide : false,
		autofocus : "off",
		animated : false,
		overlay : overlay
	});
}

function closeAR() {
	Ti.Geolocation.removeEventListener('heading', headingCallback);
	Ti.Geolocation.removeEventListener('location', locationCallback);
	if (!isAndroid) {
		Ti.Media.hideCamera();
	}
	setTimeout(function() {
		win.close();
	}, 500);
}




var deviceLocation = null;
var deviceBearing = 1;

var centerY = screenHeight / 2;

var arContainer = $.arContainer;
var headingLabel = $.headingLabel;
var radar = $.radarView;

if (params.overlay) {
	overlay.add(params.overlay);
}



// iPhone camera sees about 30 degrees left to right
var FIELD_OF_VIEW = 30;




var win = $.win;

var maxRange = 1000;

if (params.maxDistance) {
	maxRange = params.maxDistance;
}

win.addEventListener('open', function() {
	Ti.API.debug('AR Window Open...');
	setTimeout(showAR, 500);
});
function doClose() {
	closeAR();
};
$.closeButton.addEventListener('click', closeAR);

if (params.initialLocation) {
	deviceLocation = params.initialLocation;
}

function assignPOIs(_pois) {

	pois = _pois;

	addViews();
	createRadarBlips();
	
	if (deviceLocation && deviceBearing) {
		updateRelativePositions();
	}

}

if (params.pois) {
	assignPOIs(params.pois);
}

function poiClick(e) {
	Ti.API.debug('heard a click');
	Ti.API.debug('number=' + e.source.number);
	var poi = inRangePois[e.source.number];
	var view = poi.view;
	view.fireEvent('click', {
		source : poi.view,
		poi : poi
	});
}


/**
 * Device has indicated a new location
 * @param {Object} e
 */
function locationCallback(e) {

	deviceLocation = e.coords;
	
	if (!deviceLocation) {
		Ti.API.warn("location not known. Can't draw pois");
		return;
	}
	else {

		updateRelativePositions();

		for (i=0, l=pois.length; i<l; i++) {
			var poi = pois[i];
			updateRadarBlipPosition(poi);
		}

		updatePoiViews();
	}
};


/**
 * Compass has indicated a new heading
 * 
 * @param {Object} e
 */
function headingCallback(e) {

	deviceBearing = e.heading.trueHeading;

	// REM this if you don't want the user to see their heading
	headingLabel.text = Math.floor(deviceBearing) + "\xB0";

	// point the radar view
	radar.transform = Ti.UI.create2DMatrix().rotate(-1 * deviceBearing);
	
	updatePoiViews();
}


/**
 * Calculate heading/distance of each poi from deviceLocation
 */
function updateRelativePositions() {

	for (i=0, l=pois.length; i<l; i++) {

//Ti.API.info('poi '+i);
		var poi = pois[i];
		
		if (poi.view) {

			poi.distance = calculateDistance(deviceLocation, poi);
//Ti.API.info('poi = '+poi.latitude+','+poi.longitude);
//Ti.API.info('deviceLocation = '+deviceLocation.latitude+','+deviceLocation.longitude);
//Ti.API.info('poi.distance = '+poi.distance);

			if (maxRange && (poi.distance <= maxRange) ) {
				poi.inRange = true;
				poi.bearing = calculateBearing(deviceLocation, poi);
				
				positionRadarBlip(poi);

//Ti.API.info('poi.bearing = '+poi.bearing);
			} 
			else {
				// don't show pois that are beyond maxDistance
				poi.inRange = false;
//				Ti.API.debug(poi.title + " not added, maxRange=" + maxRange);
			}
		}
		else {
			// don't show pois that don't have views
			poi.inRange = false;
		}
	}

	// Sort by Distance
	pois.sort(function(a, b) {
		return b.distance - a.distance;
	});

}

var limitLeft = -50;
var limitRight = screenWidth + 50;

function updatePoiViews(pois) {

	for (i=0, l=pois.length; i<l; i++) {

		var poi = pois[i];
Ti.API.info(poi);
		if (poi.inRange) {
Ti.API.info('updating view for '+i+'/'+pois.length);
/*			
			poi.blip.visible = true;
Ti.API.info('will update poi with bearing '+poi.bearing);
			var horizontalPositionInScene = projectBearingIntoScene(poi.bearing);
Ti.API.info('horizontalPositionInScene = '+horizontalPositionInScene);
	
			if ((horizontalPositionInScene > limitLeft) && (horizontalPositionInScene < limitRight)) {
				poi.view.visible = true;
/*	
				// Calcuate the Scaling (for distance)
				var distanceFromSmallest = poi.distance - minDistance;
				var percentFromSmallest = 1 - (distanceFromSmallest / distanceDelta);
				var zoom = (percentFromSmallest * DELTA_ZOOM) + MIN_ZOOM;
				// Calculate the y (farther away = higher )
				var y = MIN_Y + (percentFromSmallest * DELTA_Y);
				
				var view = poi.view;
				// Apply the transform
				var transform = Ti.UI.create2DMatrix();
				transform = transform.scale(zoom);
				view.transform = transform;
*	
				poi.view.center = {
					left : horizontalPositionInScene,
					top : 200
				};
			}
			else {
				poi.view.visible = false;
			}
*/
		}
		else {
			poi.view.visible = false;
			poi.blip.visible = false;
		}
	}
}


function addViews() {
	for (i=0, l=pois.length; i<l; i++) {
		var poi = pois[i];
		if (poi.view) {
			$.arContainer.add(poi.view);
			poi.inRange = true;
		}
	}
}

function createRadarBlips() {

	for (i=0, l=pois.length; i<l; i++) {

		var poi = pois[i];
		// add to blip to the radar
		// The Radar Blips ....

		var displayBlip = Ti.UI.createView({
			height : '3dp',
			width : '3dp',
			backgroundColor : 'white',
			borderRadius : 2,
		});
		
		poi.blip = displayBlip;

		positionRadarBlip(poi);		
		
		radar.add(displayBlip);
	}
}


function positionRadarBlip(poi) {

	if (!poi.bearing) return;
	
	var rad = toRad(poi.bearing);

	var relativeDistance = poi.distance / (maxRange * 1.2);
	var x = (40 + (relativeDistance * 40 * Math.sin(rad)));
	var y = (40 - (relativeDistance * 40 * Math.cos(rad)));
	
	poi.blip.left = (x - 1) + "dp";
	poi.blip.top = (y - 1) + "dp";
	
Ti.API.info('blip position: '+poi.blip.top+', '+poi.blip.left);	
}



/**
 * Calculate the pixel left/right position of a particular bearing, using device bearing.
 * 
 * @param {Object} poiBearing
 */
function projectBearingIntoScene(poiBearing) {
	
	return screenWidth/2 + exports.findAngularDistance(poiBearing - deviceBearing) * screenWidth / FIELD_OF_VIEW;

}


function findAngularDistance(theta1, theta2) {
	a = theta1 - theta2;
	if (a > 180) a -= 360;
	if (a < -180) a += 360;
}

function toRad(val) {
	return val * Math.PI / 180;
};

function calculateBearing(point1, point2) {
	var lat1 = toRad(point1.latitude);
	var lat2 = toRad(point2.latitude);
	var dlng = toRad((point2.longitude - point1.longitude));
	var y = Math.sin(dlng) * Math.cos(lat2);
	var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlng);
	var brng = Math.atan2(y, x);
	return ((brng * (180 / Math.PI)) + 360) % 360;
};

function calculateDistance(loc1, loc2) {
	var R = 6371;
	// Radius of the earth in km
	var dLat = (toRad(loc2.latitude - loc1.latitude));
	// Javascript functions in radians
	var dLon = (toRad(loc2.longitude - loc1.longitude));
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	// Distance in m
	return R * c * 1000;
};


exports = {
	findAngularDistance: findAngularDistance,
	calculateDistance: calculateDistance,
	calculateBearing: calculateBearing,
	toRad: toRad,
	doClose: doClose,
	closeAR: closeAR
};

