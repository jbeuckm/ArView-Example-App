
var Alloy = require('/alloy');

module.exports.sync = function(method, model, options) {
            	
    switch (method) {
    	
        case "read":

			// load details about a single place
            if (model.get('reference')) {
            	
				var xhr = Ti.Network.createHTTPClient({
					onerror : function(e) {
						//if (failure) { failure(e); }
						options.error(e);
					},
					onload : function() {

						if (this.status == 200) {
							var resp = JSON.parse(this.responseText);
							
							options.success({
								formatted_phone_number: resp.result.formatted_phone_number,
								website: resp.result.website
							});
				
						} else {
							alert('There was a problem finding place details with google.');
							options.error(this.responseText);
						}
					}
				});
				
				var params = {
					key: Alloy.Globals.googleApiKey,
					sensor: 'true',
					reference: options.reference
				};
				
				var request = Alloy.Globals.googlePlaceDetailUrl + '?' + require('utilities').serialize(params);
				xhr.open('GET', request);
				xhr.send();
            }
            else {
            	
				var params = {
					key: Alloy.Globals.googleApiKey,
					location: [options.loc.latitude, options.loc.longitude],
					rankby: 'distance',
					sensor: 'true',
					types: [
			//			'art_gallery', 
						'beauty_salon', 
			//			'car_repair', 
						'food', 'restaurant', 'meal_takeaway',
			//			'convenience_store', 
						'clothing_store', 
						'department_store', 
						'electronics_store',
						'grocery_or_supermarket',
			/*			'gym',
						'hair_care',
						'shoe_store',
						'movie_theater',
						'parking',
						'spa',
						'store'
			*/
					]
				};
				
				var xhr = Ti.Network.createHTTPClient({
					onerror: function(e) {
						Ti.API.info('ERROR LOADING GOOGLE PLACES');
						Ti.API.info(JSON.stringify(e));
						options.error(e);
					},
					onload: function() {
						if (this.status == 200) {
							var resp = JSON.parse(this.responseText);
							nextPageToken = resp['next_page_token'];				

							Ti.API.info('adapter found '+resp.results.length+' places');									
							options.success(resp.results);
						} 
						else {
							options.error(this.responseText); 
						}
					}
				});
			
				var request = Alloy.Globals.googleNearbyPlacesUrl;
				request += '?' + require('utilities').serialize(params);
			
				xhr.open('GET', request);
				xhr.send();
			}
			
            break;
            
        case "create":
            options.error('create not implemented');
            break;
        case "update":
            options.error('update not implemented');
            break;
        case "delete":
            options.error('delete not implemented');
            break;
    }

};


module.exports.beforeModelCreate = function(config) {
    config = config || {};
    // Perform some pre-checks (as an example)
    return config;
};


module.exports.afterModelCreate = function(Model) {
    Model = Model || {};
    // Set up the persistent storage device, apply migrations or preload data (as examples)
};

