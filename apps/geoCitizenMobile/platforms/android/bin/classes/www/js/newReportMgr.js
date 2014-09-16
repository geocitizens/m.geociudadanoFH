/* newReportMgr 
 * manage Data for a new Report
 * load the form data
 * holds the new report data
 */
function NewReportMgr(){
	
	newReportObj = this;
	
	
	//Public properties
	this.searchResults = null;
	this.theme = null;
	this.category = null;
	this.title = null;
	this.description = null;
	this.date = null;
	this.country = null;
	this.city = null;
	this.neighborhood = null;
	this.anonymous = null;
	
	
	/**
	 * Load necessary data for new Report -> Theme
	 */
	this.loadNewReportThemes = function() {
				
		var themeSelect = $('#ThemeSelect');
		var loadedThemes = null;
				
		$.post( url+'GeoAdmin', 
				{option: "Themes"})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedThemes += "<option value=\"" + object.id + "\">" + object.name + "</option>";
					});
					
					themeSelect.empty().html("<option>" + "Select a Theme" + "</option>").selectmenu('refresh', true);
					themeSelect.append(loadedThemes);
					
				} else {
					themeSelect.empty().selectmenu('refresh', true);
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        countriesSelect.empty().selectmenu('refresh', true);
		    });
	};
	
	
	/**
	 * Load necessary data for new Report -> Categories
	 */
	this.loadNewReportCategories = function(userSubgeo) {
				
		var categorySelect = $('#CategorySelect');
		var loadedCategories = null;
		
		var selectedTheme = $( "#ThemeSelect option:selected" ).val();
		//alert("Selected Theme = " + selectedTheme);
		
		if(userSubgeo === null){
			alert("You have not entered your SubGeo in your Profil");
			return;
		}
		
		$.post( url+'GeoAdmin', 
				{option: "Categories",
				 subgeo: userSubgeo,
				 theme:	selectedTheme}
		
		).done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedCategories += "<option value=\"" + object.id + "\">" + object.name + "</option>";
					});
					
					categorySelect.empty().html("<option>" + "Select a Category" + "</option>").selectmenu('refresh', true);
					categorySelect.append(loadedCategories);
					
				} else {
					categorySelect.empty().selectmenu('refresh', true);
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        citiesSelect.empty().selectmenu('refresh', true);
		    });
	};
	
	
	/**
	 * Load necessary data for Registration -> Countries
	 */
	this.loadNewReportCountries = function() {
				
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
					countriesSelect.empty().selectmenu('refresh', true);
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        countriesSelect.empty().selectmenu('refresh', true);
		    });
	};
	
	/**
	 * Load necessary data for Registration -> Cities
	 */
	this.loadNewReportCities = function() {
				
		var citiesSelect = $('#CitiesSelect');
		var loadedCities = null;
		
		var selectedCountry = $( "#CountriesSelect option:selected" ).val();
		//alert("Selected Country = " + selectedCountry);
		
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
					citiesSelect.empty().selectmenu('refresh', true);
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        citiesSelect.empty().selectmenu('refresh', true);
		    });
	};
	
	/**
	 * Load necessary data for Registration -> Neighborhood
	 */
	this.loadNewReportNeighborhood = function() {
				
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
					neighborhoodSelect.empty().selectmenu('refresh', true);
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        neighborhoodSelect.empty().selectmenu('refresh', true);
		    });
	};
	
}