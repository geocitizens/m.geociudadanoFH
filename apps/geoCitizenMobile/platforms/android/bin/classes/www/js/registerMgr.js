/*** RegisterMgr - manage Data for Registration*****/
function RegisterMgr(){
	
	registerObj = this;
	
	/**
	 * Load necessary data for Registration -> Countries
	 */
	this.loadRegisterCountries = function() {
				
		var countriesSelect = $('#CountriesSelect');
		var loadedCountries = null;
				
		$.post( url+'GeoAdmin', 
				{option: "Countries"})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedCountries += "<option value=\"" + object.id + "\">" + object.Name + "</option>";
					});
					/*										
					for (var key in json) {
				         if (json.hasOwnProperty(key)) 
				         {
				        	 loadedCountries += "<option value=\"" + json[key].id + "\">" + json[key].name + "</option>";
				         }
					}
					*/
					
					countriesSelect.empty().html("<option>" + "Select your Country" + "</option>").selectmenu('refresh', true);
					countriesSelect.append(loadedCountries);
										
				} else {
					countriesSelect.empty();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        countriesSelect.empty();
		    });
	};
	
	/**
	 * Load necessary data for Registration -> Cities
	 */
	this.loadRegisterCities = function() {
				
		var citiesSelect = $('#CitiesSelect');
		var loadedCities = null;
		
		var selectedCountry = $( "#CountriesSelect option:selected" ).val();
		// alert("Selected Country = " + selectedCountry); // TESTONLY
		
		$.post( url+'GeoAdmin', 
				{option: "Cities",
				 country: selectedCountry})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedCities += "<option value=\"" + object.id + "\">" + object.Name + "</option>";
					});
					
					/*
					for (var key in json) {
				         if (json.hasOwnProperty(key)) 
				         {
				        	 loadedCities += "<option value=\"" + json[key].id + "\">" + json[key].name + "</option>";
				         }
					}
					*/
					
					citiesSelect.empty().html("<option>" + "Select your City" + "</option>").selectmenu('refresh', true);
					citiesSelect.append(loadedCities);
					
				} else {
					citiesSelect.empty();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        citiesSelect.empty();
		    });
	};
	
	/**
	 * Load necessary data for Registration -> Neighborhood
	 */
	this.loadRegisterNeighborhood = function() {
				
		var neighborhoodSelect = $('#NeighborhoodSelect');
		var loadedNeighborhoods = null;
		
		var selectedCity = $( "#CitiesSelect option:selected" ).val();		
		
		$.post( url+'GeoAdmin', 
				{option: "Neighborhoods",
				 city: selectedCity})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedNeighborhoods += "<option value=\"" + object.id + "\">" + object.Name + "</option>";
					});
					
					/*
					for (var key in json) {
				         if (json.hasOwnProperty(key)) 
				         {
				        	 loadedNeighborhoods += "<option value=\"" + json[key].id + "\">" + json[key].name + "</option>";
				         }
					}
					*/
					
					neighborhoodSelect.empty().html("<option>" + "Select your Neighborhood" + "</option>").selectmenu('refresh', true);
					neighborhoodSelect.append(loadedNeighborhoods);
					
				} else {
					neighborhoodSelect.empty();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        neighborhoodSelect.empty();
		    });
	};
	
}