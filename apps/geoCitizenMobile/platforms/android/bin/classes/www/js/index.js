/*
 * index.js = main script-file
 * provides the main functionality of the
 * whole app (every single page)
 */

//var url = 'http://ec2-107-22-58-53.compute-1.amazonaws.com:8080/GeoCitizen/';
//var url = 'http://10.0.2.2:8080/GeoCitizen/';//TESTONLY
var url = 'http://192.168.8.133:8080/GeoCitizen/';//TESTONLY
//var shareUrl = 'http://www.geociudadano.org';

/*
 * Manager Objects which handle the functionality
 */
var mapMgr = null;
var positionMgr = null;
var userMgr = null;
var facebookMgr = null;
var procAobsMgr = null;
var registerMgr = null;
var reportMgr = null;
var newReportMgr = null;
var subGeoMgr = null;
var pointMgr = null;
var discussionMgr = null;
//Parameter for google maps api
var apiLoaded = false;

var initialMapPage = true;

var SearchTriggerClick = 0;
var FilterTriggerClick = 0;
var ProfileTriggerClick = 0;


// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);
/*
 * onDeviceReady is called when Cordova (Phonegap) successfully loaded 
 */
function onDeviceReady(){
	
	document.addEventListener("backbutton", onBackKeyDown, false);
	
	$.mobile.allowCrossDomainPages = true;
	$.mobile.autoInitializePage = false;
    $.mobile.zoom.enabled = false;
    $.mobile.buttonMarkup.hoverDelay = 0; 
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.defaultPageTransition = 'none';
    $.mobile.useFastClick = true;
    $.support.cors = true;
    
    // initialising Facebook
	try {
    	console.log("FB - Init start");
		FB.init({ 
			appId: '540400396076898',
			nativeInterface: CDV.FB,
            useCachedDialogs: false
            //status: true,
		});
		console.log("FB - Init - finished");
	} catch (e) {
		console.log("FB - Init - failed");
		//link.style.display = 'none';
	};
	
    console.log("Finished loading facebook and cordova api");
    
}

/*
 * Method to prevent page transitions

$(document).on('pagebeforechange', function(e, data){  
    var to = data.toPage,
        from = data.options.fromPage;

    if (typeof to  === 'string') {
        var u = $.mobile.path.parseUrl(to);
        to = u.hash || '#' + u.pathname.substring(1);
        if (from) from = '#' + from.attr('id');

        if (from === '#indexPage' && to === '#loginPage') {
            alert('Can not transition from #index to #second!');
            e.preventDefault();
            e.stopPropagation();

            // remove active status on a button, if transition was triggered with a button
            $.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-focus ui-btn');;
        }  
    }
});
 */

/*
 * Method to stop the toggeling of the pages

$(document).on("pagebeforechange", function(e, data){
	var to_page = data.toPage[0].id;
	  
	if (to_page == "loginPage") {
		alert("in pagebeforechange to loginPage");
		if(userMgr.checkLogin()){
			alert("logindata was correct! ;)")
			$.mobile.changePage("#mapPage");
			e.stopPropagation();
			e.preventDefault();
		}
	}
});
*/

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Index Page +++++++++++++++++++++++++++++++++++++++++
 */

/*
 * Called before the indexPage (the subGeoPage) is shown
 */
$( document ).on("pagebeforecreate", '#indexPage', function(event, ui){
	    
    console.log("Load all Manager Objects");
    
    // creating all necessary Manager-Objects
    userMgr = new UserMgr();
	registerMgr = new RegisterMgr();
	reportMgr = new ReportMgr();
	newReportMgr = new NewReportMgr();
	procAobsMgr = new ProcAobsMgr();
	positionMgr = new PositionMgr();
	subGeoMgr= new SubGeoMgr();
	pointMgr = new PointMgr();
	discussionMgr = new DiscussionMgr();
	
	console.log("Loaded all Manager Objects");
	
	// check if subgeocitzizen was already choosen and saved at the local storage
	// if it is already saved -> go to mapPage and save the subgeo into the userMgr object
	if(window.localStorage.getItem("subgeo") !== null){
		userMgr.setSubGeo();
		event.stopPropagation();
		event.preventDefault();
	}
	// else -> load and show the subgeos
	else{
		subGeoMgr.loadSubGeos();
	}
	
	// add functionality to the buttons
	// 'okay'-button to choose a subgeo
	$('#indexOkayButton').click(function(){
		userMgr.setSubGeo();
		userMgr.skipSubGeo();
    });
	
	// skip subgeo-Button
	$('#skipSubGeoButton').click(function(){
		userMgr.skipSubGeo();
    });
	
});

/*
 * Called when the indexPage (the subGeoPage) is shown
 * $( document ).on("pageshow", '#indexPage', function(event, ui){
 * });
*/

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Login Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the loginPage is created
 */
$( document ).on("pagebeforecreate", '#loginPage', function(event, ui){
	
	// Check if user already logged in once and wants to be
	// automatically logged in
	if(window.localStorage.getItem("keepLoggedIn") != null){
		if(window.localStorage.getItem("keepLoggedIn") == "true"){
			if(userMgr.checkLogin()){
				$.mobile.changePage("mapPage.html");
				e.stopPropagation();
				e.preventDefault();
			}
		}
	}
});

/*
 * Called before the loginPage is shown
 * $( document ).on("pagebeforeshow", '#loginPage', function(event, ui){
 * });
*/

/*
 * Called when the loginPage is shown
 */
$( document ).on("pageshow", '#loginPage', function(event, ui){
    
	// initialising the facebookMgr object
	facebookMgr = new FacebookMgr();
	
	// if an email address is already saved put it into
	// the email-address field
	var email = window.localStorage.getItem("email");
    if (email !== null && email !== '' && email !== undefined) {
		$('#logintxtEmail').val(email);
	}
	
	// remove preview page to allow exit with back button
    ui.prevPage.remove();
	
	// Login button functionality
    $('#LoginButton').on("click", function(){
    	userMgr.loginUser();
    	//userMgr.gotoMapPage(); //TESTONLY
    });
    
    // Register button functionality
    $('#RegisterButton').on("click", function(){
    	userMgr.gotoRegister();
    });
	
	//If user choose Facebook Login
    $('#facebookLoginButton').on("click", function(){
    	facebookMgr.fb_login();
    	// alert("FB-User-ID: " + facebookMgr.fbId);//TESTONLY
    	userMgr.gotoRegisterSocial(facebookMgr.fbId, "facebook");
    });
	
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Register Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the registerPage is shown
 */
$( document ).on("pagebeforeshow", '#registerPage', function(event, ui){
	
	//Create the user Manager object if null
	if (userMgr === null) {
		userMgr = new UserMgr();
	}
	//Create the register Manager object if null
	if (registerMgr === null) {
		registerMgr = new RegisterMgr();
	}
	
	//load countries
	registerMgr.loadRegisterCountries();
	
});

/*
 * Called when the registerPage is shown
 */
$( document ).on("pageshow", '#registerPage', function(event, ui){
	
	// if countries are chosen load cities
    $("#CountriesSelect").change(function() {
    	registerMgr.loadRegisterCities();
    });
    
    //if cities are chosen load neigborhoods
    $("#CitiesSelect").change(function() {
    	registerMgr.loadRegisterNeighborhood();
    });
    
    //If user clicks Register button
    $('#sendRegisterButton').on("click", function(){
    	if(userMgr.socialMediaID === null){
    		userMgr.registerUser();
    	}
    	else{
    		userMgr.registerSocialUser();
    	}
    });
	
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Map Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the loginPage is created
 */
$( document ).on("pageinit", '#mapPage', function(event, ui){
	
	
	if(initialMapPage === true){
		
		//hide profile options
		$('.userprofile-bar').hide();
		
		//hide search-input-bar
		$('.search-input-bar').hide();
		
		
		// get the location of the user
	   	$( "#getLocation" ).click(function() {
		   		
	   		// Create the position object if null
	   		if (positionMgr === null) {
				positionMgr = new PositionMgr();
	   		}
	   		
	  		//Find user position
	  		positionMgr.findPosition();
	   	});
	   	
	   	// Show profile options on click or hide it
	    $('.profileNav .ui-icon').click(function(){
	    	if(ProfileTriggerClick === 0){
	    		ProfileTriggerClick = 1;
	    		$('.userprofile-bar').show("slow");
	        	$('#map_canvas').animate({top: 180},1500);
	        }
	    	else{
	    		ProfileTriggerClick = 0;
	    		$('#map_canvas').animate({top: 50},1500);
	    		$('.userprofile-bar').hide("slow");
	    	}
	    });
	    
	    // Handle userprofile options
	    // handle user activities
	    $("#profile_myactivities").on("click", function() {
	    	
	    	//Create the report Manager object if null
			if (reportMgr === null) {
				reportMgr = new ReportMgr();
			}
			
			// open Listview with users activities
			userMgr.gotoListViewPage();
	    	reportMgr.showMyActivities(userMgr.userId);
	
	    });
	    
	    // handle userprofile settings
	    $("#profile_profile").on("click", function() {
	    	
	    	// Create the report Manager object if null
			if (reportMgr === null) {
				reportMgr = new ReportMgr();
			}
			
			// open userProfile -> TODO
			userMgr.gotoProfilePage();
	
	    });
	    
	    // handle user logout
	    $("#profile_logout").on("click", function() {
	    	
			// delete user password from local storage and 
	    	// go to loginPage
			userMgr.logoutUser();
	    });
	    
	    
	    // Show search-input field
	    $('.searchNav .ui-icon').click(function(){
	    	if(SearchTriggerClick === 0){
	    		SearchTriggerClick=1;
	    		$('.search-input-bar').show("slow");
	        	$('#map_canvas').animate({top: 130},1500);
	    	}
	    	else{
	    		SearchTriggerClick = 0;
	    		$('#map_canvas').animate({top: 50},1500);
	    		$('.search-input-bar').hide("slow");
	    	}
	    });
	    
	    // Handle Search
	    $("#searchButton").on("click", function() {
	    	
	    	// Create the report Manager obj if null
			if (reportMgr === null) {
				reportMgr = new ReportMgr();
			}
			
			// search Reports and open Listview
			userMgr.gotoListViewPage();
			reportMgr.searchReport();
	    });
	    
	    
	    // Manage suggestion (autocomplete)
	    $("#searchtxt").on("input", function() {
	    	
	    	// Create the search Manager obj if null
			if (reportMgr === null) {
				reportMgr = new ReportMgr();
			}
			
			// Make suggestions to user (autocomplete)
			reportMgr.makeSuggestions();
	    });
	    
	    // Open Report-ListView
		$('.listviewNav .ui-icon').click(function(){
			
			//Create the search Manager obj if null
			if (reportMgr === null) {
				reportMgr = new ReportMgr();
			}
			
			// open listviewPage and load all reports
			userMgr.gotoListViewPage();
			// alert("Your user id: " + userMgr.userId); //TESTONLY
			reportMgr.showAllReports(userMgr.userId);
			
		});
		
		// Open Map-Layer TODO -> Get MapLayers from Map to this button
		$('.mapLayerNav .ui-icon').click(function(){
			
			
		});
		
		// Open newReportPage
		$('.reportNav .ui-icon').on("click", function(e){
			userMgr.gotoNewReportPage();
		});
		
		initialMap = false;
	}
});

/*
 * Called before the mapPage is shown
 */
$( document ).on("pagebeforeshow", '#mapPage', function(event, ui){
		
	if(!apiLoaded) {
    	
		/* Old code
		 * Load the google maps api on initial page-loading
		 * and get all points on it		
    	 * var script = document.createElement("script");
    	 * script.type = "text/javascript";
    	 * script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBo8AneTk5ADFCnLCvvK8l7uD20Y3AJKAY&sensor=true&callback=loadMap";
    	 * document.body.appendChild(script);
    	 * document.getElementsByTagName("head")[0].appendChild(script);
		 */
		
		loadMap();
    	
	}else{
		//If map is already loaded fixMapSize
		if (mapMgr !== null) {
			mapMgr.fixMapSize();
		}
	}	
	
});

/*
 * Called when the mapPage is shown
 */
$( document ).on("pageshow", '#mapPage', function(event, ui){
	
	// resize the map at on everytime it's shown
	google.maps.event.trigger(mapMgr.map, 'resize');
	
});


/*
 * Called when the mapPage is shown
 */
$( document ).on("pagehide", '#mapPage', function(event, ui){
	
	// alert("leaving map page"); // TESTONLY
	
   	// Hide profile options when they are open
    if(ProfileTriggerClick === 1){
    	ProfileTriggerClick = 0;
    	$('#map_canvas').animate({top: 50},1500);
		$('.userprofile-bar').hide("slow");
    }
    
    // Hide search-input field when it is open
    if(SearchTriggerClick === 1){
    	SearchTriggerClick = 0;
    	$('#map_canvas').animate({top: 50},1500);
		$('.search-input-bar').hide("slow");
    }
    
    $('#map_canvas').clearQueue().stop();
    $('.userprofile-bar').clearQueue().stop();
    $('.search-input-bar').clearQueue().stop();
});


/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Listview Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the listviewPage is shown
 */
$( document ).on("pagebeforeshow", '#listviewPage', function(event, ui){
		
	// hide profile options
	$('.userprofile-bar').hide();
	
	// hide filter and search-input-bar
	$('.filter-input-bar').hide();
	$('.search-input-bar').hide();
	
	// hide status column
	$('td:nth-child(3),th:nth-child(3)').hide();
	
	// preload filter select boxes
	reportMgr.loadFilterStatus();
	reportMgr.loadFilterThemes();
	
});

/*
 * Called when the listviewPage is shown
 */
$( document ).on("pageshow", '#listviewPage', function(event, ui){
	
	// Show search input field    
    $('.searchNav .ui-icon').click(function(){
    	if(SearchTriggerClick === 0){
    		SearchTriggerClick=1;
    		$('#listviewTable').animate({top: 130},1200);
    		$('.search-input-bar').show("slow");
    	}
    	else{
    		SearchTriggerClick=0;
    		$('#listviewTable').animate({top: 50},1500);
    		$('.search-input-bar').hide("slow");
    	}
    });
	
    // Handle Search
    $("#searchButton").on("click", function() {
    	
    	// Create the report Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// search Reports and open Listview
		userMgr.gotoListViewPage();
		reportMgr.searchReport();
    });
    
	// Show filter input field
    $('.filterNav .ui-icon').click(function(){
    	if(FilterTriggerClick === 0){
    		FilterTriggerClick = 1;
    		$('.filter-input-bar').show("slow");
        	$('#listviewTable').animate({top: 550},1500);
    	}
    	else{
    		FilterTriggerClick = 0;
    		$('.filter-input-bar').hide("slow");
        	$('#listviewTable').animate({top: 50},1500);
    	}
    });
    
    // if theme is chosen load categories
    $("#ThemeSelect").change(function() {
    	reportMgr.loadFilterCategories(userMgr.userNeighborhood)
    });
    
    // Handle Filter if clicked
    $("#filterButton").on("click", function() {
    	
    	// Create the report Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// search Reports and open Listview
		userMgr.gotoListViewPage();
		reportMgr.filterReports();
    });
    
    // Manage suggestion (autocomplete)
    $("#searchtxt").on("input", function() {
    	
    	//Create the report Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		//Make suggestions to user (autocomplete)
		reportMgr.makeSuggestions();
    });
    
 // Handle userprofile options
    // handle user activities
    $("#profile_myactivities").on("click", function() {
    	
    	//Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open Listview with users activities
		userMgr.gotoListViewPage();
    	reportMgr.showMyActivities(userMgr.userId);

    });
    
    // handle userprofile settings
    $("#profile_profile").on("click", function() {
    	
    	// Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open userProfile -> TODO
		userMgr.gotoProfilePage();

    });
    
    // handle user logout
    $("#profile_logout").on("click", function() {
    	
		// delete user password from local storage and 
    	// go to loginPage
		userMgr.logoutUser();
    });
    
    // getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	// Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		
		// Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    // if user clicks on report column in listview
    // load the detailpage -> observation or process
    $("#reportTableBody").on('click','tr',function(e){
        var id = $(this).attr('id');
        var statusid = $(this).find(".statusID").attr('id');
        
        //alert("ReportID = " + id + "     StatusID = " + statusid); //TESTONLY
        
        if(statusid == 1){
        	userMgr.gotoObservationDetailPage();
        	reportMgr.loadDetailObservation(id);
        }
        else if(statusid == 2){
        	userMgr.gotoProcessDetailPage();
        	reportMgr.loadDetailProzess(id);
        }
    }); 
    
    // If user clicks on "My Activities" in Filter
    $('#myAcitvitiesButton').on("click", function(e){
    	userMgr.gotoListViewPage();
    	reportMgr.showMyActivities(userMgr.userId);
    });
    
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ NewReport Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the listviewPage is shown
 */
$( document ).on("pagebeforeshow", '#newReportPage', function(event, ui){
		
	// hide profile options
	$('.userprofile-bar').hide();
	
	// search-input-bar
	$('.search-input-bar').hide();
	
});
/*
 * Called when the newReportPage gets shown
 */
$( document ).on("pageshow", '#newReportPage', function(event, ui){
	
	// load data for select inputs
	newReportMgr.loadNewReportThemes();
	newReportMgr.loadNewReportCountries();
	
	// if theme is chosen load categories
    $("#ThemeSelect").change(function() {
    	
    	newReportMgr.loadNewReportCategories(userMgr.userSubgeo);
    });
	
	// if countries are chosen load cities
    $("#CountriesSelect").change(function() {
    	
    	newReportMgr.loadNewReportCities();
    });
    
    // if cities are chosen load neigborhoods
    $("#CitiesSelect").change(function() {
    	newReportMgr.loadNewReportNeighborhood();
    });
    
    // show left signs under the textbox for the aim
    $("#newReportAim").keydown(function(e) {
        var tval = $("#newReportAim").val(),
            tlength = tval.length,
            set = 143,
            remain = parseInt(set - tlength);
        $("#textlimit").text(remain + '/144');
        if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
            $("#newReportAim").val((tval).substring(0, tlength - 1));
        }
    });
    
    // show left signs under the textbox for the description
    $('#newReportDescription').keypress(function(e) {
        var tval = $('#newReportDescription').val(),
            tlength = tval.length,
            set = 143,
            remain = parseInt(set - tlength);
        $('#textlimitDescription').text(remain + '/144');
        if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
            $('#newReportDescription').val((tval).substring(0, tlength - 1));
        }
    });
    
    // show left signs under the textbox for the title
    $('#newReportTitle').keypress(function(e) {
        var tval = $('#newReportTitle').val(),
            tlength = tval.length,
            set = 143,
            remain = parseInt(set - tlength);
        $('#textlimitTitle').text(remain + '/144');
        if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
            $('#newReportTitle').val((tval).substring(0, tlength - 1));
        }
    });
	
	// Show search input field
    $('.searchNav .ui-icon').click(function(){
    	if(SearchTriggerClick === 0){
    		SearchTriggerClick=1;
    		$('#listviewTable').animate({top: 130},1200);
    		$('.search-input-bar').show("slow");
    	}
    	else{
    		SearchTriggerClick = 0;
    		$('#listviewTable').animate({top: 50},1500);
    		$('.search-input-bar').hide("slow");
    	}
    });
    
    // Manage suggestion (autocomplete)
    $("#searchtxt").on("input", function() {
    	
    	// Create the search Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		// Make suggestions to user (autocomplete)
		reportMgr.makeSuggestions();
    });
    
 // Handle userprofile options
    // handle user activities
    $("#profile_myactivities").on("click", function() {
    	
    	//Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open Listview with users activities
		userMgr.gotoListViewPage();
    	reportMgr.showMyActivities(userMgr.userId);

    });
    
    // handle userprofile settings
    $("#profile_profile").on("click", function() {
    	
    	// Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open userProfile -> TODO
		userMgr.gotoProfilePage();

    });
    
    // handle user logout
    $("#profile_logout").on("click", function() {
    	
		// delete user password from local storage and 
    	// go to loginPage
		userMgr.logoutUser();
    });
    
    // getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	// Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		
		// Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    // if report is Done Button is clicked
    $('#doneReport_Button').on("click", function(){
    	
    	reportMgr.saveNewReport();
    });
        
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ ProcORobs Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the procORobsPage is shown
 */
$( document ).on("pagebeforeshow", '#procORobsPage', function(event, ui){
	
	if(SearchTriggerClick === 1){
		SearchTriggerClick = 0;
	}
	
	//hide profile options
	$('.userprofile-bar').hide();
	
	//search-input-bar
	$('.search-input-bar').hide();
	
});
/*
 * Called when the procORobsPage gets shown
 */
$( document ).on("pageshow", '#procORobsPage', function(event, ui){
	
	//Show search input field
    $('.searchNav .ui-icon').click(function(){
    	if(SearchTriggerClick === 0){
    		SearchTriggerClick=1;
    		$('#listviewTable').animate({top: 130},1200);
    		$('.search-input-bar').show("slow");
    	}
    	else{
    		SearchTriggerClick=0;
    		$('#listviewTable').animate({top: 50},1500);
    		$('.search-input-bar').hide("slow");
    	}
    });
    
    //getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	//Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		//Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    
    //goto Join or Start new Process Page
    $('#joinORstartProc_Button').on("click", function(){
    	
		//Save and create Observation
		reportMgr.createObservation(userMgr.userId, positionMgr.lat, positionMgr.lng);
		
		//go to joinORnewPage
		userMgr.gotoJoinORnewPage();		
    });
    
    //getBack to MapPage
    $('#justObs_Button').on("click", function(){
    			
    	//Save and create Observation
		reportMgr.createObservation(userMgr.userId, positionMgr.lat, positionMgr.lng);
		
		//go back to map Page
		userMgr.gotoMapPage();
    });
});


/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ JoinORnew Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the joinORnewPage is shown
 */
$( document ).on("pagebeforeshow", '#joinORnewPage', function(event, ui){
	
	if(SearchTriggerClick === 0){
		SearchTriggerClick = 1;
	}
	
	//hide profile options
	$('.userprofile-bar').hide();
	
	//hide filter-input-bar
	$('.filter-input-bar').hide();
	
	//hide status column
	$('td:nth-child(3),th:nth-child(3)').hide();
	
});
/*
 * Called when the joinORnewPage gets shown
 */
$( document ).on("pageshow", '#joinORnewPage', function(event, ui){
	
	//load all joinable processes in JoinORnewPage
	reportMgr.showJoinable();
	
	//load filter select boxes
	reportMgr.loadFilterStatus();
	reportMgr.loadFilterThemes();
	
	//Show search input field
	$('.searchNav .ui-icon').click(function(){
  	if(SearchTriggerClick === 0){
  		SearchTriggerClick=1;
  		$('#joinORnewTable').animate({top: 130},1200);
  		$('.search-input-bar').show("slow");
  	}
  	else{
  		SearchTriggerClick=0;
  		$('#joinORnewTable').animate({top: 50},1500);
  		$('.search-input-bar').hide("slow");
  	}
  });
	
  //Handle Search
  $("#searchButton").on("click", function() {
  	
	//search for Joinable reports
	reportMgr.searchJoinable();
	
  });
  
  // if theme is chosen load categories
  $("#ThemeSelect").change(function() {
  	reportMgr.loadFilterCategories(userMgr.userNeighborhood)
  });
  
  //Manage suggestion (autocomplete)
  $("#searchtxt").on("input", function() {
  	
  	//Create the search Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		//Make suggestions to user (autocomplete)
		reportMgr.makeSuggestions();
  });
  
  //getBack to MapPage
  $('.mapNav .ui-icon').click(function(){
  	
  	//Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		//Get User to MapPage
		userMgr.gotoMapPage();
  });
  
  //If user clicks on a Process or Observation he joins it
  $('.procORobs').on("click", function(e){
  	reportMgr.joinReport(e.target.Id);
  	userMgr.gotoMapPage();
  });
  
  //If user starts a new process
  $('#startNewProcess_Button').on("click", function(e){
  	userMgr.gotoinviteANDstartPage();
  });
  
  //If user clicks on "My Activities" in Filter
  $('#myAcitvitiesButton').on("click", function(e){
  	userMgr.gotoListViewPage();
  	reportMgr.showMyActivities(userMgr.userId);
  });
  
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ InviteANDstart Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the inviteANDstartPage is shown
 */
$( document ).on("pagebeforeshow", '#inviteANDstartPage', function(event, ui){
	
	if(SearchTriggerClick === 1){
		SearchTriggerClick = 0;
	}
	
	//hide profile options
	$('.userprofile-bar').hide();
	
	//hide search-input-bar
	$('.search-input-bar').hide();
	
});
/*
 * Called when the inviteANDstartPage gets shown
 */
$( document ).on("pageshow", '#inviteANDstartPage', function(event, ui){
	
	//Show search input field
    $('.searchNav .ui-icon').click(function(){
    	if(SearchTriggerClick === 0){
    		SearchTriggerClick=1;
    		$('#listviewTable').animate({top: 130},1200);
    		$('.search-input-bar').show("slow");
    	}
    	else{
    		SearchTriggerClick=0;
    		$('#listviewTable').animate({top: 50},1500);
    		$('.search-input-bar').hide("slow");
    	}
    });
    
    //Manage suggestion (autocomplete)
    $("#searchtxt").on("input", function() {
    	
    	//Create the search Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		//Make suggestions to user (autocomplete)
		reportMgr.makeSuggestions();
    });
    
    //getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	//Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		//Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    
    //start Page and invite Users
    $('#inviteANDstart_Button').on("click", function(){
    	
    	//invite all entered Users
    	reportMgr.inviteUsersOnStart();
    	//start the process
    	reportMgr.startProcess(userMgr.userId);
    	
		//Get User back to MapPage
		userMgr.gotoMapPage();
		pointMgr.allPoints(true);
    });
        
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ observationDetail Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the listviewPage is shown
 */
$( document ).on("pagebeforeshow", '#observationDetailPage', function(event, ui){
		
	// Start and invite Button
    $("#startAndinviteProcessBtn").on("click", function() {
    	
    	// Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open inviteANDstartPage
		userMgr.gotoinviteANDstartPage();
    });
	
});
/*
 * Called when the newReportPage gets shown
 */
$( document ).on("pageshow", '#observationDetailPage', function(event, ui){
	    
    // handle userprofile settings
    $("#startAndinviteProcessBtn").on("click", function() {
    	
    	// Create the report Manager object if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		
		// open userProfile -> TODO
		userMgr.gotoProfilePage();
    });
    
    // handle user logout
    $("#profile_logout").on("click", function() {
    	
		// delete user password from local storage and 
    	// go to loginPage
		userMgr.logoutUser();
    });
    
    // getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	// Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		
		// Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    // if report is Done Button is clicked
    $('#doneReport_Button').on("click", function(){
    	
    	reportMgr.saveNewReport();
    });
        
});

/**
 *+++++++++++++++++++++++++++++++++++++++++++++++ Discussion Page +++++++++++++++++++++++++++++++++++++++++
 */
/*
 * Called before the discussionPage is shown
 */
$( document ).on("pagebeforeshow", '#discussionPage', function(event, ui){
		
	//hide profile options
	$('.userprofile-bar').hide();
	
	//hide search-input-bar
	$('.search-input-bar').hide();
	
	//discussionMgr.getComments(reportMgr.ID, userMgr.userId);
});
/*
 * Called when the discussionPage gets shown
 */
$( document ).on("pageshow", '#discussionPage', function(event, ui){
		
	//Show search input field
    $('.searchNav .ui-icon').click(function(){
    	if(SearchTriggerClick === 0){
    		SearchTriggerClick=1;
    		$('#discussionTable').animate({top: 130},1200);
    		$('.search-input-bar').show("slow");
    	}
    	else{
    		SearchTriggerClick=0;
    		$('#discussionTable').animate({top: 50},1500);
    		$('.search-input-bar').hide("slow");
    	}
    });
	
    //Handle Search
    $("#searchButton").on("click", function() {
    	
    	//Create the report Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		//search Reports and open Listview
		userMgr.gotoListViewPage();
		reportMgr.searchReport();
    });
    
    //Manage suggestion (autocomplete)
    $("#searchtxt").on("input", function() {
    	
    	//Create the search Manager obj if null
		if (reportMgr === null) {
			reportMgr = new ReportMgr();
		}
		//Make suggestions to user (autocomplete)
		reportMgr.makeSuggestions();
    });
    
    //getBack to MapPage
    $('.mapNav .ui-icon').click(function(){
    	
    	//Create the user manager if null
		if (userMgr === null) {
			userMgr = new userMgr();
		}
		//Get User to MapPage
		userMgr.gotoMapPage();
    });
    
    //if user clicks on report column in listview
    $("#discussionTableBody").on('click','tr',function(e){
        var id = $(this).attr('id');
        var messageclass = $(this).attr('class');
        
        alert("DiscussionID = " + id + "     Type = " + messageclass);
        
        if(messageclass == 'comment'){
        	userMgr.gotoDiscussionPage();
        	reportMgr.loadReplys(id);
        }
        else if(messageclass == 'reply'){
        	// Nothing, because it is not possible to write replys to replys
        }
    });
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
 * Load the map from callback function
 */
function loadMap(){
	
	apiLoaded = true;
	
	//alert("Loading map");
	mapMgr = new MapMgr();
	mapMgr.showMap("map_canvas");	
		
	//Add listener when the map gets idle state
	google.maps.event.addListenerOnce(mapMgr.map, 'idle', function(){
	    
	    //this part runs when the mapobject shown for the first time
		//Get all points
		pointMgr.allPoints(true);
		
		if (positionMgr === null) {
			positionMgr = new PositionMgr();
		}
		
		//Get position
		positionMgr.findPosition();
		
		mapMgr.fixMapSize();
	    
	    getLayersList();
	});
}

//Handle the back button
function onBackKeyDown() {
	
	var active_page = $.mobile.activePage.attr("id");
	
	if (active_page != 'indexPage' && active_page != 'mapPage' && active_page != 'loginPage') {
		window.history.back();
		
	}else{
		notiExit();		
	}
}