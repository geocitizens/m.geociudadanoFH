/* 
 * To handle all the maps functions
 * load and show the map
 * set custom markers
 * clear overlays
 * draw lines
 * ...
 */
function MapMgr(){
	
	//To access the map from inside methods
	var mapObj = this;
	
	//Public properties
	this.homeMapShown = false;
	this.map = null;
	this.latlng = null;
	this.latLngExtent = null;
	this.markerOptions = null;
	this.mapBounds = null;
	this.markersArray = [];
	this.overlaysArray = [];
	this.markerCluster = null;
	this.circle = null;
	this.userPosMarker = null;
	this.zoom = 14;
	this.overlay = null;
	
	//**************************************** Public Methods ****************************************************//
	/**
	 * Show the map
	 */
	this.showMap = function(map_div) 
	{	
		var element = document.getElementById(map_div);
		
		this.latLngExtent = new google.maps.LatLng(-0.21426,  -78.40787);
		
	    var myOptions = {
	      zoom: this.zoom,
	      center: this.latLngExtent,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      mapTypeControl: true,
	      mapTypeControlOptions: {
	        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
	      },
	      zoomControlOptions: {
	          position: google.maps.ControlPosition.LEFT_TOP
	      },
	      minZoom: 3,
	      maxZoom: 18,
	      streetViewControl: false
	    };
		
	    this.map = new google.maps.Map(element, myOptions);
	    
	    google.maps.event.trigger(this.map, 'resize');
	    
	};
	
	/**
	 * Trigger resize event
	 */
	this.fixMapSize = function(){
		google.maps.event.trigger(this.map, 'resize');
	};

	/**
	 * Clear all the overlays and markers on the map
	 */
	this.clearOverlays = function() {
		//Clear all markers
		var size = this.markersArray.length;
		for (var i = 0; i < size; i++ ) {
			this.markersArray[i].setMap(null);
		}
		this.markersArray = [];
		//Clear overlays
		size = this.overlaysArray.length; 
		for (var i = 0; i < size; i++ ) {
			this.overlaysArray[i].setMap(null);
		}
		this.overlaysArray = [];
	};
	
	/**
	 * Clear only the overlays
	 */
	this.clearOverlaysOnly = function() {
			
		var size = this.overlaysArray.length; 
		for (var i = 0; i < size; i++ ) {
			this.overlaysArray[i].setMap(null);
		}
		this.overlaysArray = [];
	};

	/**
	 * Adds a marker to the map in the given coordinate and symbol
	 */
	this.addCustomMarker = function(latitude, longitude, symbol)
	{
		this.latlng = new google.maps.LatLng(latitude, longitude);
				
		var image = new google.maps.MarkerImage(url+"Resources/images/markerSymbols/"+symbol+".png",
				  new google.maps.Size(32, 37),
				  // The origin for this image is 0,0.
				  new google.maps.Point(0,0),
				  // The anchor for this image is the center bottom 
				  new google.maps.Point(16, 37));
		
		var shadow = new google.maps.MarkerImage(url+"Resources/images/markerSymbols/shadow.png",
				  // The shadow image is larger in the horizontal dimension
		      	  // while the position and offset are the same as for the main image.
				  new google.maps.Size(54, 37),
				  // The origin for this image is 0,0.
				  new google.maps.Point(0,0),
				  // The anchor for this image is the center bottom 
				  new google.maps.Point(16, 37));
		
		this.markerOptions = {
			position: this.latlng,
			icon: image,
			shadow: shadow,
			optimized: false
	    };
		
		var marker = new google.maps.Marker(this.markerOptions);
		marker.setMap(this.map);
		
		this.extendMapBounds(this.latlng);
		
		//Put marker on the array
		this.markersArray.push(marker);
		
		return marker;
	};
	
	/**
	 * Adds a simple marker to the map in the given coordinate
	 */
	this.addMarker = function(latitude, longitude, markerOptions)
	{
		this.latlng = new google.maps.LatLng(latitude, longitude);
		
		var marker = new google.maps.Marker(markerOptions);
				
		this.extendMapBounds(this.latlng);
		
		this.markersArray.push(marker);
		
		return marker;
	};
	/**
	 * Extend the maps bounds to show all the markers on the screen
	 */
	this.extendMapBounds = function(latlng)
	{
		if(this.mapBounds === null)
		{
			this.mapBounds = new google.maps.LatLngBounds();
		}
		
		this.mapBounds.extend(latlng);
	};
	/**
	 * Center the maps bounds
	 */
	this.centerMapBounds = function()
	{
		this.map.fitBounds(this.mapBounds);		
	};
	/**
	 * Clear the maps bounds
	 */
	this.clearMapBounds = function()
	{
		this.mapBounds = null;
	};
	
	/**
	 * from here on it is code from the web version
	 */
	this.findPlaceOnMap = function (address, zoom){
		
		var geocoder = new google.maps.Geocoder();
		
	    geocoder.geocode({ address: address },function(responses){
	    	
	        if(responses && responses.length > 0){
	        	
	        	$("#locationPop").popup("close");
	        	
	        	mapObj.map.setCenter(responses[0].geometry.location);
	        	mapObj.map.setZoom(zoom);
	        	
				//$('#homeMsgId').html('<p>Ahora puedes ver todos los puntos reportados que cumplen con tu busqueda!</p><a href="#" data-rel="back" data-role="button" data-mini="true" class="orange-btn">Aceptar</a>');
					        	
	        }else{
	        	$('#homeMsgId').html('<p>Tu búsqueda no obtuvo resultados!</p><a href="#" data-rel="back" data-role="button" data-mini="true" class="orange-btn">Aceptar</a>');
	        	
	        	$("#homeMsg").trigger( "create" ).popup('open');
	        }
	        
	        /*
	        else{
	            alert("No hubo resultados, intente solo con la Ciudad");
	        }*/
	    });
	};
	
	this.createCircle = function(latLng, onlyOne){
		
		if (onlyOne) {
			if (this.circle == null) {
				this.circle = new google.maps.Circle({
			        center: latLng,
			        map: mapObj.map,
			        fillColor: '#0000FF',
			        fillOpacity: 0.3,
			        strokeColor: '#0000FF',
			        strokeOpacity: 0.3,
			        strokeWeight: 1,
			        radius: 60
			    });
			}else{
				this.circle.setCenter(latLng);
				this.circle.setVisible(true);
			}
		} else {

			var circle = new google.maps.Circle({
		        center: latLng,
		        map: mapObj.map,
		        fillColor: '#0000FF',
		        fillOpacity: 0.3,
		        strokeColor: '#0000FF',
		        strokeOpacity: 0.3,
		        strokeWeight: 1,
		        radius: 70
		    });
			
			this.overlaysArray.push(circle);
		}	
	};
	/**
	 * Create a line beetwen to coordinates
	 */
	this.createLine = function(start, end, color){

		var geoLine = new google.maps.Polyline({
							path: [start,end],
							map: mapObj.map,
							strokeColor: color,
							strokeOpacity: 0.9,
							strokeWeight: 2,
							clickable: false
						});
			
		this.overlaysArray.push(geoLine);
	};
}