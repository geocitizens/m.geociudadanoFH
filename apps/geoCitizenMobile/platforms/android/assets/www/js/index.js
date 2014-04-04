var url = 'http://ec2-107-22-58-53.compute-1.amazonaws.com:8080/GeoCitizen/';
var shareUrl = 'http://www.geociudadano.org';
var mapMgr = null;
var positionMgr = null;
var userMgr = null;
var apiLoaded = false; //Para saber si el api de google maps esta cargado
var extent = null;

//Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	
	document.addEventListener("backbutton", onBackKeyDown, false);
	
	$.mobile.allowCrossDomainPages = true;
    $.mobile.zoom.enabled = false;
    $.mobile.buttonMarkup.hoverDelay = 0; 
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';
    $.mobile.useFastClick = true;
    $.support.cors = true;
}
//Called only when the page is loaded
$( document ).on("pageshow", '#homePage', function(event, ui){
	    
    ui.prevPage.remove();
    
    userMgr = new UserMgr();
    
    var email = window.localStorage.getItem("email");
    if (email !== null && email !== '' && email !== undefined) {
		$('#logintxtEmail').val(email);
	}
});

//Handle the back button
function onBackKeyDown() {
	
	var active_page = $.mobile.activePage.attr("id");
	
	if (active_page != 'homePage' && active_page != 'mapPage') {
		history.back();
		
	}else{
		notiExit();		
	}
}

//Called only when the page is loaded
$( document ).on("pageshow", '#mapPage', function(event, ui){

    if (!apiLoaded) {
    	
    	//Load the google maps api
    	var script = document.createElement("script");
    	script.src = "https://maps.google.com/maps/api/js?sensor=true&callback=loadMap";
    	script.type = "text/javascript";
    	document.getElementsByTagName("head")[0].appendChild(script);
    	
    	$( "#getLocation" ).click(function() {
    		
    		//Create the position obj if null
    		if (positionMgr == null) {
    			positionMgr = new PositionMgr();
    		}
    		//Find user position
    		positionMgr.findPosition();
    	});
    	
	}else{
		//If map is already loaded fixMapSize
		if (mapMgr !== null) {
			mapMgr.fixMapSize();
		}
	}
});

//Called only when the page is loaded
$( document ).on("pageshow", '#poiInfoPage', function(event, ui){

	//Show the point information
	$('#poiDesc').html(poiInfo.description);
	$('#poiTheme').html(poiInfo.theme);
	$('#poiDate').html(poiInfo.observation_date);
	
	//Calculate the img height
	var imgMaxHeight = $('#poiInfoDiv').height();
	imgMaxHeight = imgMaxHeight - $('#poiDesc').height() - $('#poiTheme').height() - $('#poiDate').height();
	
	//Check if there is an img
	if (poiInfo.imgName !== '' && poiInfo.imgName !== undefined) {
		
		//Show loading gif
		$('#poiImg').html('<img src="../img/ajax-loader.gif" style="padding-bottom: 25px;" class="center">');
		
		//Create img obj
		var img = new Image();
		// image onload
	    $(img).load(function () {
			
	    	$('#poiImg').html(this);
	    				
	    }).error(function () {
	    		    	
	    	$('#poiImg').html('');
	    	
	    }).attr('src', poiInfo.imgName).css('max-width', '100%').css('max-height', imgMaxHeight).addClass('center');
	}
});

/**
 * Load the map
 */
function loadMap(){
	
	apiLoaded = true;
	//Create the map
	if (mapMgr == null) {
		//To show the map
		mapMgr = new mapManager();				
	}
	//Show map on the div map_canvas
	mapMgr.showMap('map_canvas');
		
	//Add listener when the map gets idle state
	google.maps.event.addListenerOnce(mapMgr.map, 'idle', function(){
	    
	    //this part runs when the mapobject shown for the first time
		//Get all points
		allPoints(true);
		
		if (positionMgr == null) {
			positionMgr = new PositionMgr();
		}
		//Get position
		positionMgr.findPosition();
	});
}