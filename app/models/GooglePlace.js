
exports.definition = {
	
	config: {
		"columns": {
			id: 'TEXT',
			name: 'TEXT',
			icon: 'TEXT',
			vicinity: 'TEXT',
			
			reference: 'TEXT',
			
			formatted_phone_number: 'TEXT',
			website: 'TEXT'
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
};


