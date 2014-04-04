var poiClickLat = null;
var poiClickLng = null;
var poiInfo = null;
var selectedTheme = null;
var reportedPoiId = null;
var reporting = false;

/**
 * Get all points
 * @param clearOverlays
 */
function allPoints(clearOverlays){

	$.post(url+"GeoPoi", {option: "all", subgeo: extent}, function(data) {
		
		if (clearOverlays) {
			mapMgr.clearMapBounds();
			mapMgr.clearOverlays();
			
			if (mapMgr.userPosMarker !== null) {
				mapMgr.userPosMarker.setMap(mapMgr.map);
			}
		}
				
		var json = $.parseJSON(data);
								
		$(json).each(function(i,val){
			
			var latitude = 0.0;
			var longitude = 0.0;
			var poiId = 0;
			var symbol = null;
			
		    $.each(val,function(k,v){
		    		    			    	
		    	if (k == "id") {
		    		poiId = v;
				}else if (k == "X") {
					latitude = v;
				}else if (k == "Y") {
					longitude = v;
				}else {
					
					symbol = v;
					
					//Create the point marker
					var marker = mapMgr.addCustomMarker(latitude, longitude, symbol);
					//Add click listener 
					google.maps.event.addListener(marker, 'click', function() {
						
						poiClickLat = latitude;
						poiClickLng = longitude;
						
						showPoiInformation(poiId);
					});
				}       
		    });
		});
	});
}

/**
 * Get all the point information from the server of a given point
 * @param poiId
 */
function showPoiInformation(poiId)
{	
	$.post(url+"GeoPoiMobile",{option: "getPoiInfo", poiId: poiId}, function(data) {
		
		poiInfo = $.parseJSON(data);
		
		try {
			//Go to the page to show the point information
			if(poiInfo.theme != null){
				$.mobile.changePage('poiInfo.html', { transition: "slide" });
			}
		} catch (e) {
			// TODO: handle exception
		}
	});
}
/**
 * Select the theme when the user want to report
 * @param themeId
 */
function themeSelection(themeId){
	
	//If there is another theme selected back to normal state
	if (selectedTheme !== null) {
		
		$('#theme'+selectedTheme).css('background', 'blue').css('color', '#FFBF00');
		
	}
	//highlight the selected theme
	$('#theme'+themeId).css('background', 'orange').css('color', '#000000');
		
	//Save the selected theme id
	selectedTheme = themeId;
}
/**
 * Report the point
 */
function reportPoi(){
	
	//Allow only one reporting at a time
	if (!reporting) {
		if (mapMgr.userPosMarker !== null) {
			
			//Get the report description
			var description = $('#reportDescription').val();
			if (description !== '') {
				//Check if there is already a picture to upload
				if (imgBase64 !== null) {
					//Check if the user select a theme
					if (selectedTheme !== null) {
					
						$.mobile.loading("show", {
							text: 'Reportando...',
							textVisible: true,
							theme: 'a'
						});
						
						reporting = true;
						
						$.post(url+"GeoPoiMobile",
								{option: "reportPoi", 
								 lat: mapMgr.userPosMarker.getPosition().lat(), 
								 lng: mapMgr.userPosMarker.getPosition().lng(),
								 theme: selectedTheme,
								 description: description,
								 userid: userMgr.userId}, function(data) {
							
							var json = $.parseJSON(data);
							
							if (json.success) {
								//Get the id of the reported point
								reportedPoiId = json.poi;
								//Upload the picture
								uploadPicture();
								
							} else {
								reporting = false;
								
								defaultNoti('Intenta mas tarde...', 'Opps!', 'Aceptar');
							}
						});
					}else{
						defaultNoti('Selecciona un tema', 'Aviso', 'Aceptar');
					}		
					
				} else {
					defaultNoti('Debes tomar una foto o seleccionar una de tu galeria!', 'Falta poco', 'Aceptar');
				}
				
			} else {
				defaultNoti('Debes poner una descripción!', 'Aviso', 'Aceptar');
			}
					
		} else {
			defaultNoti('No hemos podido ubicarte, verifica que tu GPS esté encendido y que nada bloquee su señal', 'Ubicación', 'Aceptar');
		}
	}	
}
/**
 * Upload the picture
 */
function uploadPicture(){
	
	//Show msg
	$.mobile.loading("show", {
		text: 'Subiendo imagen...',
		textVisible: true,
		theme: 'a'
	});
	
	$.post(url+"GeoFileMobile",
			{option: "uploadFile", 
			 poiId: reportedPoiId,
			 imgBase64: imgBase64})
		.done( function(json) {
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				//Asign the image to the point
				poiFiles(reportedPoiId, 'report', json.filename);
				
			} else {
				reporting = false;
				
				defaultNoti('Intenta mas tarde...', 'Opps!', 'Aceptar');
			}
	    })
	    .fail( function(xhr, textStatus, errorThrown) {
	    	
	    	reporting = false;
	    	
	    	defaultNoti('Opps, hubo un problema en la conexión. Intenta de nuevo.', 'Aviso', 'Aceptar');
	    });
}

/**
 * To save the name of the files related with the poi
 */
function poiFiles(poiId, action, filename){
	
	$.post(url+"GeoPoiMobile",{option: "poiFiles", poiId: poiId, img: filename, action: action}, function(data) {

		var json = $.parseJSON(data);

		if (json.success) {

			$.mobile.loading("hide");
			//Get all points
			allPoints(true);
			//Go back to mapPage
			$.mobile.changePage("mapPage.html");
			//Get the user position
			positionMgr.findPosition();
			//Clear vars
			reporting = false;
			imgBase64 = null;
			positionMgr.firstPos = true;
			mapMgr.userPosMarker = null;
			//Show success msg of the report process
			defaultNoti('Denuncio realizado!', 'Exito', 'Aceptar');
		}
	});
}
/**
 * Share the point, using a plugin
 */
function sharePoi(){
	
	if (reportedPoiId !== null) {
		// note: instead of available(), you could also check the useragent (android or ios6+)
		window.plugins.socialsharing.available(function(isAvailable) {
		  if (isAvailable) {
		    window.plugins.socialsharing.share(shareUrl+'?point='+reportedPoiId);
		  }
		});
	}else{
		defaultNoti('Debes denunciar algo para compartirlo!', 'Aviso', 'Aceptar');
	}
}
