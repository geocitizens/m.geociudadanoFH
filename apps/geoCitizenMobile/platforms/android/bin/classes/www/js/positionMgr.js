/* User obj */
function PositionMgr(){
	
	//To have access from methods
	var positionObj = this;
	
	//Public properties
	this.watchID = null;
	this.timerID = null;
	this.options = { enableHighAccuracy: true };
	this.posAttempt = 0;
	this.posMsg = false;
	this.watchID = null;
	this.lat = null;
	this.lng = null;
	this.latLng = null //google maps latLng obj
	this.neighborhood = null;
	this.firstPos = true;
		
	//**************************************** Public Methods ****************************************************//
	this.findPosition = function()
	{		
		//Show msg while we are locating the user
		$.mobile.loading("show", {
			text: 'Obteniendo ubicación',
			textVisible: true,
			theme: 'a'
		});
		
		positionObj.stopWatchingPosition();
		
		//Get current position
		navigator.geolocation.getCurrentPosition(onSuccess, onError, {timeout: 15000});
		
		//Watch for the position
		positionObj.watchID = navigator.geolocation.watchPosition(onSuccess, onError, positionObj.options);
			
	};
	/**
	 * Stops watching user position
	 */
	this.stopWatchingPosition = function()
	{
		if (positionObj.watchID !== null) {
			
			navigator.geolocation.clearWatch(positionObj.watchID);			
			positionObj.watchID = null;
		}
	};
	
	//**************************************** Private Methods ****************************************************//
	/**
	 * Position acquired
	 */
	function onSuccess(position) 
	{	
		//Save coordinates
		positionObj.lat = position.coords.latitude;
		positionObj.lng = position.coords.longitude;
		positionObj.latLng = new google.maps.LatLng(positionObj.lat, positionObj.lng);
		
		//Center the user on map
		if (positionObj.firstPos) {
			
			mapMgr.map.setCenter(positionObj.latLng);
			mapMgr.map.setZoom(16);
			
			positionObj.firstPos = false;
		}
		
		//If the accuracy is < 50 stop watching position
		if (position.coords.accuracy <= 50) {
			
			positionObj.stopWatchingPosition();
		}	
		
		//Create the user marker
		if (mapMgr.userPosMarker === null) {
			
			var markerOptions = {
				position: positionObj.latLng,
				draggable: true
		    };
			
			mapMgr.userPosMarker = mapMgr.addMarker(positionObj.lat, positionObj.lng, markerOptions);
			mapMgr.userPosMarker.setMap(mapMgr.map);
			
		} else {
			mapMgr.userPosMarker.setPosition(positionObj.latLng);
		}
		
		$.mobile.loading("hide");
	}
	
	// onError Callback receives a PositionError object
	function onError(error) {
	    /*alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');*/
		if (error.code !== 3) {
			positionObj.stopWatchingPosition();
			
			defaultNoti("Por favor revisa la configuración de la ubicación en tu celular. No pudimos ubicarte.", "Ubicación", "Aceptar");
		}
	}
}


