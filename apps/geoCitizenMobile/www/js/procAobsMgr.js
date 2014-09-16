/* 
 * Process and Observation Manager obj 
 * Functionality to load Detail Page
 * and load details of the process or observation
 */
function ProcAobsMgr(){
	
	//To have access from methods
	var procAobsObj = this;
	
	//Public properties
	this.procAobsId = null;
	this.isProcess = null;
	
	this.selectedprocAobs = null;
	

	//**************************************** Public Methods ****************************************************//		
	
	/**
	* Let User skip from SubGeoPage to loginPage
	*/
	this.showDetailPage = function() {
		$.mobile.changePage('detailPage.html', { transition: "slide" });
	};
	
	
	/**
	* Load detailPage when User clicks on process or report
	*/
	this.loadDetails = function(selectedprocAobsID) {
		
		procAobsObj.procAobsId = selectedprocAobsID;
		alert("I am in load details");
		//Parse received JSON Object and set it into DetailPage
		var procAobsJSONObject;
		
		$.post( url+'GeoObservationMobile', {option: "get", id: selectedprocAobsID})
			
			.done( function(json) {
				alert("Done sending request");		
				if(json.constructor === String){
					procAobsJSONObject = $.parseJSON(json);
			    }
				
				if (json.success) {
					alert("Json success");
					
					//Open DetailPage
					procAobsObj.showDetailPage();
					
					//load Content into DetailPage
					
					
					
					
				} else {
					alert("Json failed");	
					SubGeos.innerHTML = "";
					subGeoObj.skipSubGeo();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	alert("Request failed");
		    	SubGeos.innerHTML = "";
		    	subGeoObj.skipSubGeo();
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
	};
}