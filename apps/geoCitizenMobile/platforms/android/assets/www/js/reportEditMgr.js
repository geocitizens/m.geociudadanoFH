var editReport = null;
var poiInfo = null;
var poiAction = null;
var poiLat = null;
var poiLng = null;
var uploadImg = null;
var reportListener = false;
var confirmDelete = false;
var reportMarker = null;
var savePhoto = false;
var saveDoc = false;
var imgName = null;
var docName = null;
var eraseImg = null;
var eraseDoc = null;
var ytVideoId = null;
var ytApiReady = false;

//Called only when the page is loaded
//$('#PoiInfoPop').live('pageshow', function(){
$(document).on("pageshow", "#PoiInfoPop", function (event, ui){
			
	// Add dynamic stuff to the page here
	viewPoiInformation();
});

//Called only when the page is loaded
//$('#EditPoiPop').live('pageshow', function(){
$(document).on("pageshow", "#EditPoiPop", function (event, ui){
		
	savePhoto = false;
	saveDoc = false;
	
	// Add dynamic stuff to the page here
	if (poiAction === 'edit') {
		
		editPoiInformation();
		
	}else if (poiAction === 'report') {
		
		reportInformation();
		
		$("#eraseCheckBoxes").hide();
	}
	
	$('#imgUpload').on('change', handlePhotoSelect);
	$('#docUpload').on('change', handleFileSelect);
	
	$('#imgUpload').attr("data-url", url+"GeoFile");
	$('#docUpload').attr("data-url", url+"GeoFile");
	
	$('#imgUpload').fileupload({
        dataType: 'json',
        progress: function (e, data) {
        	var progress = parseInt(data.loaded / data.total * 100, 10);
        	//console.log(progress);
        	$('#_progressImg').css('width', progress+'%');
        	if(progress == 100){
        		$('#_progressImg').html('<span>Hecho</span>');
        	}
        },
        add: function (e, data) {
        	if ($("#submitPhoto").length == 0){
        		data.context = $('#epFinalContent').append('<a href="#" id="submitPhoto">.</a> ');
                $('#submitPhoto').click(function () {
                	                	
                	data.submit();
                	$('#_progressImg').html('<span>Subiendo...</span>');
                });
                $('#submitPhoto').hide();
        	}
        },
        done: function (e, data) {
        	
        	try {
        		imgName = data.result.filename;
                
            	if (saveDoc) {
            			        		
    				$('#submitDoc').click();
    				
    			}else{
    				
    				poiFiles(editReport.poi, poiAction, null);
    				
    				if (poiAction === 'edit') {
    					
    					showPoiInformation(editReport.poi);
    					
    				}else if (poiAction === 'report') {
    					
    					$.mobile.changePage(url+'Popups/process/StartProcessPop.html');
    					
    				}
    			}
			} catch (e) {
				// TODO: handle exception
			}
        }
    });
	
	$('#docUpload').fileupload({
        dataType: 'json',
        progress: function (e, data) {
        	var progress = parseInt(data.loaded / data.total * 100, 10);
        	//console.log(progress);
        	$('#_progressDoc').css('width', progress+'%');
        	if(progress == 100){
        		$('#_progressDoc').html('<span>Hecho</span>');
        	}
        },
        add: function (e, data) {
        	if ($("#submitDoc").length == 0){
        		data.context = $('#epFinalContent').append('<a href="#" id="submitDoc">.</a> ');
                $('#submitDoc').click(function () {
                    data.submit();
                    $('#_progressDoc').html('<span>Subiendo...</span>');
                });
                $('#submitDoc').hide();
        	}
        },
        done: function (e, data) {
        	
        	try {
        		docName = data.result.filename;
                
            	poiFiles(editReport.poi, poiAction, null);
            	
            	if (poiAction === 'edit') {
    				
    				showPoiInformation(editReport.poi);
    				
    			}else if (poiAction === 'report') {
    				
    				$.mobile.changePage(url+'Popups/process/StartProcessPop.html');
    				
    			}
			} catch (e) {
				// TODO: handle exception
			}
        	
        }
    });
	
	if (!ytApiReady) {
		$("#youTubeDiv").hide();
	}
});

/**
 * Get all the information of the point, then shows the editPop
 * @param poiId
 */
function editPoi(poiId)
{
	$.post(url+"GeoPoi",{option: "getPoiInfo", poiId: poiId}, function(data) {
		
		editReport = $.parseJSON(data);
				
		poiAction = 'edit';
		
		$.mobile.changePage(url+'Popups/EditPoiPop.html');
	});
}

/**
 * Show all the edit information of a point
 */
function editPoiInformation(){
	
	var html = '';
	
	//Get the countries and set the poi country on the list
	getListItems('GeoPlace', {option: "getCountries"}, 'epCountry', editReport[0].country, true);
	
	$('#epCountry').on('change', function(e) {
	    
		var country = $('#epCountry').val();
		
		$('#epCity').html('<option value="choose-one">Seleccione...</option>');
		$('#epCity').selectmenu('refresh');
		
		$('#epNeighborhood').html('<option value="choose-one">Seleccione...</option>');
		$('#epNeighborhood').selectmenu('refresh');
				
		if (country !== 'choose-one') {
			
			//Get the cities of a country
			getListItems('GeoPlace', {option: "getCities", country: country}, 'epCity', editReport[0].city, true);
			
		}	    
	});
	
	$('#epCity').on('change', function(e) {
	    
		var city = $('#epCity').val();
				
		$('#epNeighborhood').html('<option value="choose-one">Seleccione...</option>');
		$('#epNeighborhood').selectmenu('refresh');
		
		if (city !== 'choose-one') {
			
			//Get the neighborhoods of a city
			getListItems('GeoPlace', {option: "getNeighborhood", city: city}, 'epNeighborhood', editReport[0].neighborhood_id, false);
			
		}	    
	});
	
	//Get the neighborhoods for the user city
	//getListItems('GeoPlace', {option: "getNeighborhood", city: editReport[0].city}, 'epNeighborhood', editReport[0].neighborhood_id, false);
		
	$('#epThemes').append('<option value="choose-one">'+editReport[0].theme+'</option>');
	$('#epCategories').append('<option value="choose-one">'+editReport[0].category+'</option>');
	$('#epThemes').selectmenu('refresh');
	$('#epCategories').selectmenu('refresh');
	
	$('#txtPoiDate').val(editReport[0].observation_date);
	$('#txtPoiStatus').val(editReport[0].status);
	$('#txtUrl').val(editReport[0].docs);
	$('#flipAnonymous').val(editReport[0].anonymous+'').slider('refresh');
	$('#txtRegister').val(editReport[0].register_date);	
	$('#txtCommitment').val(editReport[0].commitment);
	
	if (poiInfo[0].imgName != undefined) {
		$('#piImg').attr('src', poiInfo[0].imgName);
		eraseImg = poiInfo[0].imgName;
	}else{
		$("#eraseImg").checkboxradio('disable');
	}
	
	if (poiInfo[0].docName != undefined) {
		eraseDoc = poiInfo[0].docName;
	}else{
		$("#eraseDoc").checkboxradio('disable');
	}
	

	$('#epThemes').selectmenu('disable');
	$('#epCategories').selectmenu('disable');
	$('#txtPoiStatus').textinput('disable');
	$('#txtRegister').textinput('disable');
	
	var size = $(editReport).length;
	for ( var index = 1; index < size; index++) {
		
		if (editReport[index].type == 'date') {
			
			html += '<div data-role="fieldcontain" class="smaller" data-theme="c">'+
						'<label for="'+editReport[index].div+'" class="label-block-one">'+editReport[index].attrib_label+':</label>'+
						'<input name="'+editReport[index].div+'" id="'+editReport[index].div+'" value="'+editReport[index].attrib_value+'" data-mini="true" class="input-block-one"/>'+
						'<script>$("#'+editReport[index].div+'").DatePicker({'+
							'format:\'d/m/Y\', date: \''+editReport[index].attrib_value+'\', current: \''+editReport[index].attrib_value+'\', starts: 1,'+
							'onBeforeShow: function(){'+
								'$("#'+editReport[index].div+'").DatePickerSetDate(\''+editReport[index].attrib_value+'\', true); '+
							'},'+
							'onChange: function(formated, dates){'+
								'var date = $("#'+editReport[index].div+'").val();'+
								'if (date != formated) {'+
									'$("#'+editReport[index].div+'").val(formated); $("#'+editReport[index].div+'").DatePickerHide();'+
								'}'+
							'}});</script>'+						
						//'<input type="date" name="'+editReport[index].div+'" id="'+editReport[index].div+'" data-role="datebox" data-options=\'{"mode": "calbox", "useNewStyle":true, "calHighToday":false}\' value="'+editReport[index].attrib_value+'" data-mini="true" class="input-block-one"/>'+
					'</div>';
			
		} else {

			html += '<div data-role="fieldcontain" class="smaller">'+
						'<label for="'+editReport[index].div+'" class="label-block-one">'+editReport[index].attrib_label+':</label>'+
						'<input type="text" name="'+editReport[index].div+'" id="'+editReport[index].div+'" value="'+editReport[index].attrib_value+'" data-mini="true" class="input-block-one"/>'+
					'</div>';	
		}
		
				
	}
	
	$('#editPoiContent').html(html);
	
	$('#editPoiContent').trigger('create');
}

/**
 * Show all the report information
 */
function reportInformation(){
	
	var first = true;
	var html = '';
	
	$('#epThemes').append('<option value="choose-one">Seleccione...</option>');
	$('#epCategories').append('<option value="choose-one">Seleccione...</option>');
	$('#epCategories').selectmenu('refresh');
	
	$('#epNeighborhood').selectmenu('disable');
	//$('#txtPoiDate').textinput('disable');
	$('#txtPoiStatus').textinput('disable');
	$('#txtUrl').textinput('disable');
	$('#txtCommitment').textinput('disable');
	$('#txtRegister').textinput('disable');
	
	//Get the themes
	getListItems('GeoTheme', {option: "getThemes", extent: extent.extent}, 'epThemes', null, false);
	
	if (extent.extent !== null && extent.extent !== undefined && extent.extent !== '') {
		
		$('#epCountryDiv').hide();
		$('#epCityDiv').hide();
		
		getListItems('GeoPlace', {option: "getSubgeoNeighborhood", subgeo: extent.extent}, 'epNeighborhood', null, false);
		
	}else{
		$('#epCountry').selectmenu('disable');
		$('#epCity').selectmenu('disable');
		
		//Get the neighborhoods for the user city
		getListItems('GeoPlace', {option: "getCountries"}, 'epCountry', '68', true);
		
		//Listen to the change event of the epCountry list
		$('#epCountry').on('change', function(){
			
			var value = $('#epCountry').val();
			
			$('#epCity').html('<option value="choose-one">Seleccione...</option>');
			$('#epCity').selectmenu('refresh');
			
			$('#epNeighborhood').html('<option value="choose-one">Seleccione...</option>');
			$('#epNeighborhood').selectmenu('refresh');
			
			if (value !== 'choose-one') {
				
				if (first) {
					//Get the cities of the country
					getListItems('GeoPlace', {option: "getCities", country: value}, 'epCity', '680861', true);
					first = false;
				}else{
					//Get the cities of the country
					getListItems('GeoPlace', {option: "getCities", country: value}, 'epCity', null, false);
				}		
			}
		});
		
		//Listen to the change event of the epCity list
		$('#epCity').on('change', function(){
			
			var value = $('#epCity').val();
			
			$('#epNeighborhood').html('<option value="choose-one">Seleccione...</option>');
			$('#epNeighborhood').selectmenu('refresh');
			
			if (value !== 'choose-one') {
				
				//Get the cities of the country
				getListItems('GeoPlace', {option: "getNeighborhood", city: value}, 'epNeighborhood', null, false);	
			}
		});
	}
	
	//Listen to the change event of the themes list
	$('#epThemes').on('change', function(){
		// Do something when this happens
		var theme_id = $('#epThemes').val();
		
		$("#epCategories").empty();
		$("#epCategories").append('<option value="choose-one">Seleccione...</option>');
		$('#epCategories').selectmenu('refresh');
		
		if (theme_id !== 'choose-one') {
			
			//Get the categories of a given theme
			getListItems('GeoCategory', {option: "getThemeCategories", theme_id: theme_id, subgeo: extent.extent}, 'epCategories', null, false);
			
		}
	});
	
	//Listen to the change event of the themes list
	$('#epCategories').on('change', function(){
		// Do something when this happens
		var category = $('#epCategories').val();
				
		if (category !== 'choose-one') {
			
			$("#editPoiContent").empty();
			$("#editPoiContent").html('<img src="../Resources/images/ajax-loader.gif" class="center">');
			
			//Get the attributes of a category
			$.post(url+"GeoCategory",{option: "getCategoryAttributes", category: category}, function(data) {
				
				$("#editPoiContent").empty();
				html = "";
				
				editReport = $.parseJSON(data);
						
				var size = $(editReport).length;
				for ( var index = 0; index < size; index++) {
					
					if (editReport[index].type == 'date') {
						
						html += '<div data-role="fieldcontain" class="smaller" data-theme="c">'+
									'<label for="'+editReport[index].div+'" class="label-block-one">'+editReport[index].attrib_label+':</label>'+
									'<input name="'+editReport[index].div+'" id="'+editReport[index].div+'" data-mini="true" class="input-block-one"/>'+
									'<script>$("#'+editReport[index].div+'").DatePicker({'+
										'format:\'d/m/Y\', date: \''+editReport[index].attrib_value+'\', current: \''+editReport[index].attrib_value+'\', starts: 1,'+
										'onBeforeShow: function(){'+
											'var today = new Date(); var dd = today.getDate(); var mm = today.getMonth()+1; var yyyy = today.getFullYear(); if(dd<10){dd=\'0\'+dd;} if(mm<10){ mm=\'0\'+mm; } today = dd+\'/\'+mm+\'/\'+yyyy;'+
											'$("#'+editReport[index].div+'").DatePickerSetDate(today, true); '+
										'},'+
										'onChange: function(formated, dates){'+
											'var date = $("#'+editReport[index].div+'").val();'+
											'if (date != formated) {'+
												'$("#'+editReport[index].div+'").val(formated); $("#'+editReport[index].div+'").DatePickerHide();'+
											'}'+
										'}});</script>'+						
									//'<input type="date" name="'+editReport[index].div+'" id="'+editReport[index].div+'" data-role="datebox" data-options=\'{"mode": "calbox", "useNewStyle":true, "calHighToday":false}\' value="'+editReport[index].attrib_value+'" data-mini="true" class="input-block-one"/>'+
								'</div>';
						/*
						html += '<div data-role="fieldcontain" class="smaller" data-theme="c">'+
									'<label for="'+editReport[index].div+'" class="label-block-one">'+editReport[index].attrib_label+':</label>'+
									'<input type="date" name="'+editReport[index].div+'" id="'+editReport[index].div+'" data-role="datebox" data-options=\'{"mode": "calbox", "useNewStyle":true, "calHighToday":false}\' data-mini="true" class="input-block-one"/>'+
								'</div>';*/
						
					} else {
						html += '<div data-role="fieldcontain" class="smaller">'+
									'<label for="'+editReport[index].div+'" class="label-block-one">'+editReport[index].attrib_label+':</label>'+
									'<input type="text" name="'+editReport[index].div+'" id="'+editReport[index].div+'" value="" data-mini="true" class="input-block-one"/>'+
								'</div>';
					}
								
				}
				
				$('#editPoiContent').html(html);
				
				$('#epCountry').selectmenu('enable');
				$('#epCity').selectmenu('enable');
				$('#epNeighborhood').selectmenu('enable');
				//$('#txtPoiDate').textinput('enable');
				$('#txtCommitment').textinput('enable');
				$('#txtUrl').textinput('enable');
				
				$('#editPoiContent').trigger('create');
			});
		}else{
			$("#editPoiContent").empty();
			html = "";
			
			$('#epNeighborhood').selectmenu('disable');
			//$('#txtPoiDate').textinput('disable');
			$('#txtPoiStatus').textinput('disable');
			$('#txtUrl').textinput('disable');
			$('#txtRegister').textinput('disable');
		}
	});

}

/**
 * Check if the user is authenticated and then allows the user to put a marker on the map to report
 */
function getReportMarker(){
	
	hideWheel();
	
	poiAction = 'report';
	
	if (checkCookie('geocitizen') && checkCookie('geouser')) {
		
		$.post(url+"GeoSession", {option: "isAuth"}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.value) {

				if (userProfile) {
					if (!reportListener) {
						
						reportListener = true;
						
						if (mapMgr.map.getZoom() < 14) {
							mapMgr.map.setZoom(14);
						}
						
						mapMgr.map.setOptions({ draggableCursor: 'url('+url+'/Resources/images/markerSymbols/markerCursor.png) 10 44, crosshair' });
											
						var confirmButton = '<a id="confirmReportBtn" href="#" onclick="getReportPop(); return false" rel="external" data-role="button" data-inline="true" data-mini="true" class="orange-small-btn">Confirmar</a>';
						var cancelButton = '<a id="cancelReportBtn" href="#" onclick="cancelReport(); return false" rel="external" data-role="button" data-inline="true" data-mini="true" class="orange-small-btn">Cancelar</a>';
											
						var reportBtns = '<div id="reportBtns" class="ui-grid-a">'+
											'<div style="width: 100%; margin: 0 5px;"><span>Debes hacer clic o tap sobre el mapa para reportar! <br>Puedes mover el punto antes de confirmar. Si necesitas ayuda, por favor haz clic en el botón AYUDA.</span></div>'+
											'<div class="ui-block-a">'+confirmButton+'</div>'+
											'<div class="ui-block-b">'+cancelButton+'</div>'+
										 '</div><!-- /grid-a -->';
											
						$('#homeContent').append(reportBtns);
						$("#homeContent a[data-role='button']").button();
						
						$('#confirmReportBtn').addClass('ui-disabled');
						//$('#cancelReportBtn').removeClass('ui-disabled');
						
						google.maps.event.addListener(mapMgr.map, 'click', function(event) {
							
							$('#confirmReportBtn').removeClass('ui-disabled');
							
							mapMgr.map.setCenter(event.latLng);
							
							var markerOptions = {
								position: event.latLng,
								animation: google.maps.Animation.DROP,
								draggable: true
						    };
							
							//poiLat = event.latLng.lat();
							//poiLng = event.latLng.lng();
							
							reportMarker = mapMgr.addMarker(poiLat, poiLng, markerOptions);
							reportMarker.setMap(mapMgr.map);	
							
							if (mapMgr.map.getZoom() < 17) {
								mapMgr.map.setZoom(17);
							}
							
							//Removes the listener
							google.maps.event.clearListeners(mapMgr.map, 'click');
							mapMgr.map.setOptions({draggableCursor: null });
						});
					}
				}else{
					
					var msgContent = '<p>Debes completar tu perfil antes de reportar!</p>'+
	 				 				 '<a href="'+url+'Popups/AccountPop.html" data-role="button" data-inline="true" data-mini="true" class="blue-btn">Aceptar</a>';

					isReporting = true;
					
					showDialogMsg(null,'<div class="centerText" style="padding-top: 5px;"><span class="text-orange large-text">Aviso!</span></div>', msgContent);
					
				}
				
			} else{
				$.mobile.changePage(url+json.url);
			}
		});
	}else{
		$.mobile.changePage(url+'Popups/LogInPop.html');
	}
}

/**
 * Show the reportPop
 */
function getReportPop(){
	$.mobile.changePage(url+'Popups/EditPoiPop.html');
}

function cancelReport(){
	
	google.maps.event.clearListeners(mapMgr.map, 'click');
	
	if (reportMarker != null) {
		
		reportMarker.setMap(null);
		delete reportMarker;
		reportMarker = null;
	}
	
	reportListener = false;
	
	mapMgr.map.setOptions({draggableCursor: null });
	
	$('#reportBtns').remove();
	$('#reportHelpDiv').remove();
}

/**
 * Get all the point information from the server of a given point
 * @param poiId
 */
function showPoiInformation(poiId)
{
		
	//centerPoiOnClick();
	
	$.post(url+"GeoPoi",{option: "getPoiInfo", poiId: poiId}, function(data) {
		
		poiInfo = $.parseJSON(data);
		
		try {
			if(poiInfo[0].theme != null){
				$.mobile.changePage(url+'Popups/PoiInfoPop.html');
			}
		} catch (e) {
			// TODO: handle exception
		}
	});
}

/**
 * Show the process wheel
 * @param poiId
 */
function showWheel(poiId, marker, poiType)
{
	hideWheel();
	
	if (processMgr === null) {
		processMgr = new ProcessMgr();
	}
	
	processMgr.showWheelInfo(poiId, marker, poiType);
}

/**
 * Hide the process wheel
 * @param poiId
 */
function hideWheel()
{
	if ($('#wheelContainer').html() != "") {
		$('#wheelContainer').empty();
		mapMgr.clearOverlaysOnly();
		
		google.maps.event.clearListeners(mapMgr.map, 'idle');
		google.maps.event.clearListeners(mapMgr.map, 'dragstart');
		google.maps.event.clearListeners(mapMgr.map, 'click');
	}
}
/**
 * Show the point information
 */
function viewPoiInformation(){
	
	
	var html = '';
	
	//theme
	html += '<span style="font-weight: bold;">Tema: </span>'+
			'<span>'+poiInfo[0].theme+'</span><br>';
	//category
	html += '<span style="font-weight: bold;">Categoria: </span>'+
			'<span>'+poiInfo[0].category+'</span><br>';
	//neighborhood
	html += '<span style="font-weight: bold;">Barrio: </span>'+
			'<span>'+poiInfo[0].neighborhood+'</span><br>';
	//Observation date
	/*html += '<span style="font-weight: bold;">Fecha observación: </span>'+
			'<span>'+poiInfo[0].observation_date+'</span><br>';*/
	//status
	html += '<span style="font-weight: bold;">Estado: </span>'+
			'<span>'+poiInfo[0].status+'</span><br>';
	
	//alert(url.split('GeoCitizen')[0]+'uploads/'+poiInfo[0].imgName);
	
	if (poiInfo[0].imgName != undefined) {
		$('#piImg').attr('src', poiInfo[0].imgName);
	}
		
	$('#piRightContent').html(html);
	
	html = '';
	var size = $(poiInfo).length;
	for ( var index = 1; index < size; index++) {
		
		html += '<span style="font-weight: bold;">'+poiInfo[index].attrib_label+': </span>'+
				'<span>'+poiInfo[index].attrib_value+'</span><br>';
		
	}
	
	$('#poiInfoContent').html(html);
	
	html = '';
	//document
	html += '<span style="font-weight: bold;">Documento: </span>';
			if (poiInfo[0].docName != undefined) {
				html += '<a href="'+poiInfo[0].docName+'" target="_blank">Ver documento</a><br>';
			} else {
				html += '<span>No hay documento</span><br>';
			}
	
	var poiUrl = poiInfo[0].docs;
	if (poiInfo[0].docs.indexOf('http://') == -1) {
		poiUrl = 'http://'+poiInfo[0].docs;
	}
	//url
	html += '<span style="font-weight: bold;">Url: </span>'+
			'<a href="'+poiUrl+'" target="_blank">'+poiInfo[0].docs+'</a><br>';
	//commitment
	html += '<span style="font-weight: bold;">Compromiso: </span>'+
			'<span>'+poiInfo[0].commitment+'</span><br>';
	//user
	html += '<span style="font-weight: bold;">Usuario: </span>'+
			'<span>'+poiInfo[0].anonymous+'</span><br>';
	//register date
	html += '<span style="font-weight: bold;">Registrado: </span>'+
			'<span>'+poiInfo[0].register_date+'</span><br>';
	
	html += poiInfo[0].buttons.replace(new RegExp('[' + "$" + ']', 'g'), "'");
	
	$('#piFinalContent').html(html);
	
	$('#piFinalContent').trigger('create');
	
	$('#googlePlusBtn').append('<div class="g-plusone" data-href="'+shareUrl+'?point='+ poiInfo[0].poiId +'" data-size="medium"></div>');
	
	$('#twitterBtn').append('<a href="https://twitter.com/share" class="twitter-share-button" data-url="'+shareUrl+'?point='+ poiInfo[0].poiId +'" data-dnt="true">Tweet</a>'+
								'<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="http://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
	
	$.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
	
	$('#facebookBtn').append('<iframe src="//www.facebook.com/plugins/like.php?href='+shareUrl+'?point='+ poiInfo[0].poiId +'&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=true&amp;font&amp;colorscheme=light&amp;action=like&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:120px; height:21px;" allowTransparency="true"></iframe>');
	
	$('#facebookBtn').append('<a href="#"'+ 
							  'onclick="'+
								    'window.open('+
								      '\'https://www.facebook.com/sharer/sharer.php?u=\'+encodeURIComponent(\''+shareUrl+'?point='+ poiInfo[0].poiId+'\'),'+ 
								      '\'facebook-share-dialog\','+ 
								      '\'width=500,height=400\');'+ 
								    'return false;">'+
								      '<img src="'+url+'Resources/images/share_fb.gif"/></a>');
	
	if(processMgr == null){
		processMgr = new ProcessMgr();
		processMgr.reportedPoiId = poiInfo[0].poiId;
		processMgr.themeCatFilter = 'category';
		processMgr.placeFilter = 'neighborhood';
	}
}
/**
 * Save the point changes when the user is in edit mode
 */
function savePoiChanges(){
	
	var country = $('#epCountry').val();
	var city = $('#epCity').val();
	var neighborhood = $('#epNeighborhood').val();
	if (neighborhood === "choose-one") {
		neighborhood = 'null';
	}
	
	if (!$('#eraseImg').is(':checked')) {
		eraseImg = null;
	}else{
		$.cookie('poi', editReport[0].poiId);
	}
	
	if (!$('#eraseDoc').is(':checked')) {
		eraseDoc = null;
	}else{
		$.cookie('poi', editReport[0].poiId);
	}
	
	var size = $(editReport).length;
	var arrayAttribs = new Array(size-1);
	var arrayValues = new Array(size-1);
	for ( var index = 1; index < size; index++) {
		
		arrayAttribs[index-1] = editReport[index].div;
		arrayValues[index-1] = $('#'+editReport[index].div).val();
					
	}
	
	if (country != 'choose-one' && city != 'choose-one') {
		
		$('#epMessage').html("<img src=\"../Resources/images/ajax-loader.gif\">");
		
		$.post(url+"GeoPoi",{option: "updatePoi", 
							 poiId: editReport[0].poiId,
							 country: country,
							 city: city,
							 neighborhood: neighborhood,
							 docs: $('#txtUrl').val(),
							 anonymous: $('#flipAnonymous').val(),
							 commitment: $('#txtCommitment').val(),
							 status: editReport[0].status_id,
							 eraseImg: eraseImg,
							 eraseDoc: eraseDoc,
							 attribs: arrayAttribs,
							 values: arrayValues
							 }, function(data) {
			
			editReport = $.parseJSON(data);
			
			if (editReport.success) {
				
				allPoints(true);
				
				if(savePhoto){
					$('#submitPhoto').click();
				}else if (saveDoc) {
					$('#submitDoc').click();
				}else{
					showPoiInformation(editReport.poi);
				}
			}
		});
	}else{
		$('#epMessage').html('<span class=\"text-red\">Completa los campos obligatorios</span>');
	}
	
}
/**
 * Report the point
 */
function reportPoint(){
	
	var attribsComplete = true;
	var size = $(editReport).length;
	var arrayAttribs = new Array(size);
	var arrayValues = new Array(size);
	for ( var index = 0; index < size; index++) {
		
		arrayAttribs[index] = editReport[index].div;
		arrayValues[index] = $('#'+editReport[index].div).val();
				
		if (arrayValues[index] === "") {
			attribsComplete = false;
		}
	}	
	
	var theme = $('#epThemes').val();
	var category = $('#epCategories').val();
	var country = $('#epCountry').val();
	var city = $('#epCity').val();
	
	if (extent.extent !== null && extent.extent !== undefined && extent.extent !== '') {
		country = extent.country;
		city = extent.city;
	}
	
	var neighborhood = $('#epNeighborhood').val();
	if (neighborhood === "choose-one") {
		neighborhood = 'null';
	}
	var docs = $('#txtUrl').val();
	var commitment = $('#txtCommitment').val();
	var anonymous = $('#flipAnonymous').val();
		
	poiLat = reportMarker.getPosition().lat();
	poiLng = reportMarker.getPosition().lng();
	
	if(theme !== "choose-one" && category !== "choose-one" && country !== "choose-one" && city !== "choose-one" && attribsComplete){
		
		$('#epMessage').html("<img src=\"../Resources/images/ajax-loader.gif\">");
		
		$.post(url+"GeoPoi",{
				option: "reportPoi",
				lat: poiLat,
				lng: poiLng,
				theme: theme,
				category: category,
				country: country,
				city: city,
				neighborhood: neighborhood,
				docs: docs,
				commitment: commitment,
				anonymous: anonymous,
				attribs: arrayAttribs,
				values: arrayValues,
				youTubeVideoId: ytVideoId
		}, function(data) {
			
			editReport = $.parseJSON(data);

			if (editReport.success) {
				
				processMgr = new ProcessMgr();
				processMgr.placeFilter = 'neighborhood';
				processMgr.themeCatFilter = 'category';
				processMgr.reportedPoiId = editReport.poi;
				processMgr.isAnonymous = anonymous;

				ytVideoId = null;
				
				allPoints(true);
				
				//To remove the controls and the aditional marker...
				cancelReport();
				/*				
				$('#homeMsgId').html('<p>Nos gustaria saber que opinas sobre la facilidad de "Reportar una observación". Ayudanos a mejorar realizando una breve encuesta.<br>'+
									 '<div class="ui-grid-a">'+
										'<div class="ui-block-a">'+
											'<a href="http://de.surveymonkey.com/s/PVRQ5WD" target="_blank" data-role="button" data-mini="true" class="orange-btn">Aceptar</a>'+
										'</div>'+
										'<div class="ui-block-b">'+
											'<a href="'+url+'Pages/homePage.html" data-role="button" data-mini="true" class="blue-btn">Cancelar</a>'+
										'</div>'+
									'</div><!-- /grid-a -->');
				
				showHomePop = true;*/
				showCircle = true;
				mapMgr.createCircle(new google.maps.LatLng(poiLat, poiLng), true);
				
				if (!savePhoto && !saveDoc){
					$.mobile.changePage(url+'Popups/process/StartProcessPop.html');
					
				}else{
					
					if(savePhoto){
						$('#submitPhoto').click();
					}
					
					if (saveDoc) {
						$('#submitDoc').click();
					}
				}							
			}
		});
	}else{
		$('#epMessage').html('<span class=\"text-red\">Completa los campos obligatorios</span>');
	}
}

function savePoi(){

	if (poiAction === "edit") {
		savePoiChanges();
	} else if (poiAction === "report") {
		reportPoint();
	}
}

function erasePoint(){

	//To maintain the map in the same position
	isAllPoints = false;
	
	if (poiAction === "edit") {
		
		if (confirmDelete) {
			
			$('#epMessage').html("<img src=\"../Resources/images/ajax-loader.gif\">");
			
			$.post(url+"GeoPoi",{option: "erasePoint", poiId: editReport[0].poiId}, function(data) {

				poiInfo = $.parseJSON(data);

				if (poiInfo.success) {

					allPoints(true);
					
					$.mobile.changePage(url+'Pages/homePage.html');
				}else{
					$('#epMessage').html('<span class=\"text-red\">'+poiInfo.msg+'</span>');
				}
			});
			
			confirmDelete = false;
		} else {
			
			confirmDelete = true;
			
			$('#epMessage').html('<span class=\"text-red\">De clic en el botón Borrar para confirmar</span>');
		}
		
	} else if (poiAction === "report") {
		
		if (confirmDelete) {
			
			cancelReport();
			
			confirmDelete = false;
			
			$.mobile.changePage(url+'Pages/homePage.html');
		}else {
			
			confirmDelete = true;
			
			$('#epMessage').html('<span class=\"text-red\">De clic en el botón Borrar para confirmar</span>');
		}
	}
}
/**
 * To save the name of the files related with the poi
 */
function poiFiles(poiId, action, id){
	
	var img = null;
	var doc = null;
	
	if (imgName != null) {
		img = imgName;
	}
	if (docName != null) {
		doc = docName;
	}
	
	$.post(url+"GeoPoi",{option: "poiFiles", poiId: poiId, img: img, doc: doc, action: action, id: id}, function(data) {

		var json = $.parseJSON(data);

		if (json.success) {

			imgName = null;
			docName = null;
		}
	});
}
/*
var normalize = (function() {
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
	to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
	mapping = {};

	for(var i = 0, j = from.length; i < j; i++ )
		mapping[ from.charAt( i ) ] = to.charAt( i );

	return function( str ) {
		var ret = [];
		for( var i = 0, j = str.length; i < j; i++ ) {
			var c = str.charAt( i );
			if( mapping.hasOwnProperty( str.charAt( i ) ) )
				ret.push( mapping[ c ] );
			else
				ret.push( c );
		}
		return ret.join( '' ).replace( /[^-A-Za-z0-9]+/g, '-' ).toLowerCase();
	};

})();*/

function checkFields(){
	
	var fieldsComplete = false;
	var attribsComplete = true;
	var size = $(editReport).length;
	var arrayAttribs = new Array(size);
	var arrayValues = new Array(size);
	for ( var index = 0; index < size; index++) {
		
		arrayAttribs[index] = editReport[index].div;
		arrayValues[index] = $('#'+editReport[index].div).val();
				
		if (arrayValues[index] === "") {
			attribsComplete = false;
		}
	}	
		
	if($('#epThemes').val() !== "choose-one" && $('#epCategories').val() !== "choose-one" && $('#epNeighborhood').val() !== "choose-one" &&
			$('#txtPoiDate').val() !== "" && $('#txtUrl').val() !== "" && attribsComplete)
	{
		fieldsComplete = true;
	}else{
		$('#epMessage').html('<span class=\"text-red\">Completa los campos obligatorios</span>');
	}
	
	return fieldsComplete;
}
