/* 
 * SubGeoMgr obj 
 * function to load all subgeos from the server
 * or skip the subgeo site if there is an error while loading
 */
function SubGeoMgr(){
	
	var subGeoObj = this;
	
	//Public properties
	this.subGeoId = null;
	this.subGeoName = null;
	
	this.selectedSubGeo = null;
	
	/**
	* Let User skip SubGeocitizen Site to Login side
	*/
	this.skipSubGeo = function() {
		$.mobile.changePage('pages/loginPage.html', { transition: "slide" });
	};
	

	//**************************************** Public Methods ****************************************************//
	
	this.loadSubGeos = function() {
		
		var SubGeos = $('#SubGeos');
		var loadedSubGeos = "";
		
		$.post( url+'GeoSubGeoCitizen', {option: "getSubGeos"})
			
			.done( function(json) {
				
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
			
					$.each(json.array, function(i, object) {
						loadedSubGeos += "<input id= \"" + object.id + "\" name= \"SubGeos\" value= \""+ object.id + "\" type=\"radio\">" + object.SubGeocitizen + "<br>";
					});
					
					SubGeos.html(loadedSubGeos);
					
				} else {	
					SubGeos.innerHTML = "";
					$.mobile.changePage('pages/loginPage.html', { transition: "slide" });
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	SubGeos.innerHTML = "";
		    	subGeoObj.skipSubGeo();
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
		    
	};
}