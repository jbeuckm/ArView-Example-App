
exports.definition = {
	
	config: {
		"columns": {
			id: "String",
			name: 'String',
			icon: 'String',
			vicinity: 'String',
			
			reference: 'String',
			
			formatted_phone_number: 'String',
			website: 'String'
		},
		"defaults": {
		},
		"adapter": {
			"type": "googlePlacesAdapter",
			"collection_name": "GooglePlaces"
		}
	},		

	extendModel: function(Model) {		
		_.extend(Model.prototype, {
			idAttribute: 'id'
		}); // end extend
		
		return Model;
	},
	
	
    extendCollection: function(Collection) {        
        _.extend(Collection.prototype, {

        }); // end extend
 
        return Collection;
    }		
}

