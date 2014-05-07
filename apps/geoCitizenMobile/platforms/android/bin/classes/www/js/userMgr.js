/* User obj */
function UserMgr(){
	
	//To have access from methods
	var userObj = this;
	
	//Public properties
	this.userId = null;
	this.username = null;
	this.email = null;
	this.lat = null;
	this.lng = null;
	this.reportCity = null;
	this.neighborhood = null;
			
	//**************************************** Public Methods ****************************************************//
	/**
	 * Login user
	 */
	this.createLoginUser = function() {
		
		$("#lgMessage").html('<img src="img/ajax-loader.gif" class="center">');
		
		var email = $('#logintxtEmail').val();
		var pass = $('#logintxtPass').val();
		
		$.post( url+'GeoAccount', 
				{option: "loginMobile", 
					  email: email,
					  pass: md5(pass)})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
																
					//Write to file important information
					window.localStorage.setItem("email", email);
					userObj.userId = json.userId;
					
					$.mobile.changePage('pages/mapPage.html', { transition: "slide" });
					
				} else {
					$("#lgMessage").empty();
					$("#lgMessage").html('<span class="text-red">'+json.msg+'</span>');
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    	//notification('Opps, hubo un problema en la conexión. Intenta de nuevo.', 'Aviso', 'Aceptar');
		    });
	}
}