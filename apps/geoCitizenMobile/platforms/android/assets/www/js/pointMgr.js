/* 
 * PointMgr obj
 * holds the whole point information and functionality
 * to get all points from the server
 * show point information
 * show point wheel information
 * get connected points
 */
function PointMgr(){
	
	var poiManagerObj = this;
	
	this.poiClickLat = null;
	this.poiClickLng = null;
	this.poiInfo = null;
	this.selectedTheme = null;
	this.reportedPoiId = null;
	this.reporting = false;

	
	/**
	 * Show the info on the wheel
	 */
	this.showWheelInfo = function(poiId, marker, poiType)
	{
		mapMgr.map.setCenter(marker.getPosition());
		mapMgr.map.setZoom(17);
						
		var height = $(window).height();
		var width = $(window).width();
		
		$.mobile.loading("show", {
			text: 'Cargando...',
			textVisible: false,
			theme: 'a'
		});
		
		$.post(url+"GeoProcess", {option: "getWheelInfo", poiId: poiId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				processObj.processId = json.process;
								
				processObj.showProcessInfo(json.process, 'empty');
				
				var div = '<div id="geocircle">'+
					'<div id="quarterCircleTopLeft"><div class="title"><span>SOLUCI�N</span></div><div id="wheelSolution"></div></div>'+
					'<div id="quarterCircleTopRight"><div class="title"><span>PROCESO</span></div><div id="wheelProcess" class="info"></div></div>'+ //'+'<img class="morePoiInfo" src="'+url+'Resources/images/info.png" onclick="event.stopPropagation(); showPoiInformation('+poiId+');"/>'+'
					'<div id="quarterCircleBottomLeft"><div class="title"><span>DISCUSI�N</span></div><div id="wheelForum" class="info"></div></div>'+
					'<div id="quarterCircleBottomRight"><div class="title"><span>PROPUESTA</span></div><div id="wheelProposal"></div></div>'+
					'<div class="wheelCenterClick" onclick="event.stopPropagation(); showPoiInformation('+poiId+');"></div></div>';

				$('#wheelContainer').html(div).css("position", "absolute").css("top", ((height/2)-185)+'px').css("left", ((width/2)-150)+"px");
				
				$('#wheelProcess').html('<span>hace <br>'+json.since+'<br>'+'por '+json.geouser+'</span>');
				
				var commentsInfo = json.comments+' publicacion'; 
				if (json.comments > 1) {
					commentsInfo += 'es';
				}
				commentsInfo += '<br>'+json.participants+' participante';
				if (json.participants > 1) {
					commentsInfo += 's';
				}
				$('#wheelForum').html('<span>'+commentsInfo+'</span>');
				
				$( "#quarterCircleTopRight" ).click(function() {
					
					//processObj.showProcessInfo(json.process, null);
					$.mobile.changePage(url+"Popups/process/processInfoPop.html");
				});
				
				$( "#quarterCircleBottomLeft" ).click(function() {
					
					//processObj.showProcessInfo(json.process, url+'Pages/forumPage.html');
					$.mobile.changePage(url+'Pages/forumPage.html');
				});
				
				google.maps.event.addListener(mapMgr.map, 'idle', function(event) {
					
					mapMgr.map.setCenter(marker.getPosition());
				});
				
				google.maps.event.addListener(mapMgr.map, 'dragstart', function(event) {
					
					hideWheel();
				});
				
				google.maps.event.addListener(mapMgr.map, 'click', function(event) {
					
					hideWheel();
				});
				//if the process has proposal
				if (poiType >= 3) {
					$('#quarterCircleBottomRight').css({"background": "yellow", "cursor": "pointer"});
					
					$( "#quarterCircleBottomRight" ).click(function() {
						
						processObj.getDetails(json.process, poiType);
					});
					
					//if the process has solution
					if (poiType == 4) {
						$('#quarterCircleTopLeft').css({"background": "#9FF781", "cursor": "pointer"});
						
						$( "#quarterCircleTopLeft" ).click(function() {
							
							processObj.getDetails(json.process, poiType);
						});
					}
				}
								
				$.mobile.loading('hide');
				
				//Call to draw all lines of the connected points
				processObj.getConnectedPoints(marker.getPosition());
			}
		});
		
	};
	
	/**
	 * Get the connected points
	 */
	this.getConnectedPoints = function(startPoint){
		
		mapMgr.clearOverlaysOnly();
		
		$.post(url+"GeoProcess", {option: "processPoints", process: processObj.processId}, function(data) {
			
			var json = $.parseJSON(data);
			
			var endPoint = null;
			
			var color = "#0040FF";
			
			switch(processObj.procStatus)
			{
				case 'process':
					color = "red";
					break;
				case 'proposal':
					color = "yellow";
					break;
				case 'solved':
					color = "green";
					break;					
			}
			
			$(json).each(function(i,val){
				
				endPoint = new google.maps.LatLng(val.X, val.Y);
				
				mapMgr.createLine(startPoint, endPoint, color);
			});
		});
	};
	
	/**
	 * Get all points
	 * @param clearOverlays
	 */
	this.allPoints = function(clearOverlays){

		$.post(url+"GeoPoiMobile", {option: "all"}, function(data) {
			
			if (clearOverlays) {
				mapMgr.clearMapBounds();
				mapMgr.clearOverlays();
				
				if (mapMgr.userPosMarker !== null) {
					mapMgr.userPosMarker.setMap(mapMgr.map);
				}
			}
					
			var json = $.parseJSON(data);
			
			$(json).each(function(i,val){
				
				var marker = mapMgr.addCustomMarker(val.X, val.Y, val.symbol);
				
				google.maps.event.addListener(marker, 'click', function(event) {
					
					poiClickLat = marker.getPosition().lat();
					poiClickLng = marker.getPosition().lng();
					
					if(val.symbol.split('_')[1] <= 1){
						
						hideWheel();
						showPoiInformation(val.id);
						
					}else{
						showWheelInfo(val.id, marker, val.symbol.split('_')[1]);
					}
					
				});
			});
		});
	}

	/**
	 * Get all the point information from the server of a given point
	 * @param poiId
	 */
	this.showPoiInfromation = function(poiId)
	{	
		$.post(url+"GeoPoiMobile",
				{	option: "getPoiInfo", 
					poiId: poiId}, 
			function(data) {
			
			poiInfo = $.parseJSON(data);
			
			try {
				//Go to the page to show the point information
				if(poiInfo.theme !== null){
					$.mobile.changePage('poiInfo.html', { transition: "slide" });
				}
			} catch (e) {
				alert("No information available");
				return;
			}
		});
	}
	/**
	 * Select the theme when the user want to report
	 * @param themeId
	 */
	this.themeSelection = function(themeId){
		
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
	this.reportPoi = function(){
		
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
	 * Upload a picture
	 */
	this.uploadPicture = function(){
		
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
	this.poiFiles = function(poiId, action, filename){
		
		$.post(url+"GeoPoiMobile",{option: "poiFiles", poiId: poiId, img: filename, action: action}, function(data) {

			var json = $.parseJSON(data);

			if (json.success) {

				$.mobile.loading("hide");
				//Get all points
				poiManagerObj.allPoints(true);
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
	this.sharePoi = function(){
		
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
}
