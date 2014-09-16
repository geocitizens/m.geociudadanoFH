/* User obj */
function UserMgr(){
	
	var userObj = this;
	
	//Public properties
	this.userId = null;
	this.userFirstName = null;
	this.userLastName = null;
	this.userEmail = null;
	this.userBirthyear = null;
	this.userGender = null;
	this.userlat = null;
	this.userlong = null;
	this.userCountry = null;
	this.userCity = null;
	this.userNeighborhood = null;
	this.userSubgeo = null;
	this.socialMediaID = null;
	this.socialMediaType = null;
	this.userPass = null;
	
	this.langTest = "thisisfuckin Englisch";

	//**************************************** Public Methods ****************************************************//		
	
	/**
	* Let User skip SubGeocitizen Site to Registrar Site
	*/
	this.skipSubGeo = function() {
		$.mobile.changePage('pages/loginPage.html', { transition: "none", reverse: false, changeHash: false});
	};
	
	/**
	* get User to Registrar Site
	*/
	this.gotoRegister = function() {
		$.mobile.changePage('registerPage.html', { transition: "slide" });
	};
	
	/**
	* get Social Media User to Registar or Map Site
	* @param SocialMediaId, SocialMediaType
	*/
	this.gotoRegisterSocial = function(SocialMediaId, SocialMediaType) {
		
		userObj.socialMediaID = SocialMediaId;
		userObj.socialMediaType = SocialMediaType;
		
		// Look up in DB if Social Media ID is already registered
		$.post( url+'GeoAccountMobile', 
				{
					option: "login_socialmedia",
					ID: SocialMediaId,
					Type: SocialMediaType
				}
		
	   ).done( function(json) {
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				userObj.userId = json.id;
				$.mobile.changePage('mapPage.html');
				
			} else {
				$.mobile.changePage('registerPage.html');
				alert("Please register as a GeoCitizen user to complete");
			}
	    })
	    .fail( function(xhr, textStatus, error) {
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	        alert("Please evaluate your data and login again");
	    });
	};
	
	/**
	* get User to Map Site
	*/
	this.gotoMapPage = function() {
		$.mobile.changePage('mapPage.html', { transition: "none"});
	};
	
	/**
	* Let User get to the listViewPage
	*/
	this.gotoListViewPage = function() {
		$.mobile.changePage('listviewPage.html', { transition: "slide" });
	};
	
	/**
	* Let User get to the observationDetailPage
	*/
	this.gotoObservationDetailPage = function() {
		$.mobile.changePage('observationDetailPage.html', { transition: "slide" });
	};
	
	/**
	* Let User get to the processDetailPage
	*/
	this.gotoProcessDetailPage = function() {
		$.mobile.changePage('processDetailPage.html', { transition: "slide" });
	};
	
	/**
	* get User to joinORnew Site
	*/
	this.gotoJoinORnewPage = function() {
		$.mobile.changePage('joinORnewPage.html', { transition: "slide" });
	};
	
	/**
	* get User to inviteANDstart Site
	*/
	this.gotoinviteANDstartPage = function() {
		$.mobile.changePage('inviteANDstartPage.html', { transition: "slide" });
	};
	
	/**
	* get User to procORobs Site
	*/
	this.gotoprocORobsPage = function() {
		$.mobile.changePage('procORobsPage.html', { transition: "slide" });
	};
	
	
	/**
	* get User to newReport Site
	*/
	this.gotoNewReportPage = function() {
		$.mobile.changePage('newReportPage.html', { transition: "none" });
	};
	
	/**
	* get chosen SubGeo from index Page or
	* sets the subgeo which was already choosen and saved
	* in the local storage
	*/
	this.setSubGeo = function() {
		if(window.localStorage.getItem("subgeo") !== null){
			userObj.userSubgeo = window.localStorage.getItem("subgeo");
			$.mobile.changePage('pages/loginPage.html', { transition: "none", reverse: false, changeHash: false});
		}
		else{
			userObj.userSubgeo = $('input:radio[name=SubGeos]:checked').val();
			//Write choosen subgeo to local app storage to remember for next start
			window.localStorage.setItem("subgeo", userObj.userSubgeo);
		}
		//alert("Chosen subgeo: " + userObj.userSubgeo);
	};
	
	
	/**
	* Register user coming from registerPage
	*/
	this.registerUser = function() {
	
		/*
		var firstname = document.getElementById('FirstName')[0].value;
		var lastname = document.getElementById('LastName')[0].value;
		var email = document.getElementById('EMail')[0].value;
		var year = document.getElementById('Birthdate')[0].value;
		var gender = document.getElementById('Gender')[0].value;
		var country = document.getElementById('Country')[0].value;
		var city = document.getElementById('City')[0].value;
		var neighborhood = document.getElementById('Neighborhood')[0].value;
		var password = document.getElementById('Password')[0].value;
		var passwordconf = document.getElementById('Passwordconf')[0].value;
		*/
		
		userObj.userFirstName = $('#FirstName').val();
		userObj.userLastName = $('#LastName').val();
		userObj.userEmail = $('#EMail').val();
		userObj.userBirthyear = $('#Birthdate').val();
		userObj.userGender = $('#Gender').val();
		userObj.userCountry = $('#CountriesSelect').val();
		userObj.userCity = $('#CitiesSelect').val();
		userObj.userNeighborhood = $('#NeighborhoodSelect').val();
		userObj.userPass = $('#Password').val();
		var passwordconf = $('#Passwordconf').val();
		
		if (1 >= userObj.userFirstName.length || 1 >= userObj.userLastName.length)
		{
		  alert("Please enter your first name and last name");
		  return false;
		}
		
		if (userObj.userPass != passwordconf)
		{
		  alert("Please enter your password again");
		  var passwordInput = document.getElementById('Password');
		  var passwordconfInput = document.getElementById('Passwordconf');
		  
		  passwordInput.value = '';
		  passwordconfInput.value = '';
		  
		  return false;
		}
		else if (userObj.userPass.length < 4)
		{
		  alert("Please enter a longer password");
		  return false;
		}
		
		var posofat = userObj.userEmail.indexOf("@");
		var posofdot = userObj.userEmail.lastIndexOf(".");
		if (posofat < 1 || posofdot < posofat+2 || posofdot+2 >= userObj.userEmail.length)
		{
		  alert("Please enter a valid e-mail address. Example: Yourname@domain.com");
		  return false;
		}
		
		
		$.post( url+'GeoAccountMobile', 
						{
							option: "register",
							Firstname: userObj.userFirstName,
							Lastname: userObj.userLastName,
							Email: userObj.userEmail,
							Password: md5(userObj.userPass),
							YearofBirth: userObj.userBirthyear,
							Country: userObj.userCountry,
							City: userObj.userCity,
							Neighborhood: userObj.userNeighborhood   
						}
			   ).done( function(json) {
					
					if(json.constructor === String){
						json = $.parseJSON(json);
				    }
					
					if (json.success) {
						userObj.userId = json.id;
						
						$.mobile.changePage('mapPage.html', { transition: "slide" });
						
					} else {
						alert("Please evaluate your data and register again");
					}
			    })
			    .fail( function(xhr, textStatus, error) {
			    	console.log(xhr.statusText);
			        console.log(textStatus);
			        console.log(error);
			        alert("Please evaluate your data and register again");
			    });
	};
	
	/**
	* Register a user who logged in with social media
	*/
	this.registerSocialUser = function() {
		
				
		userObj.userFirstName = $('#FirstName').val();
		userObj.userLastName = $('#LastName').val();
		userObj.userEmail = $('#EMail').val();
		userObj.userBirthyear = $('#Birthdate').val();
		userObj.userGender = $('#Gender').val();
		userObj.userCountry = $('#CountriesSelect').val();
		userObj.userCity = $('#CitiesSelect').val();
		userObj.userNeighborhood = $('#NeighborhoodSelect').val();
		
		if (1 >= userObj.userFirstName.length || 1 >= userObj.userLastName.length)
		{
		  alert("Please enter your first name and last name");
		  return false;
		}
		
		var posofat = userObj.userEmail.indexOf("@");
		var posofdot = userObj.userEmail.lastIndexOf(".");
		if (posofat < 1 || posofdot < posofat+2 || posofdot+2 >= this.userEmail.length)
		{
		  alert("Please enter a valid e-mail address. Example: Yourname@domain.com");
		  return false;
		}
		
		
		$.post( url+'GeoAccountMobile', 
						{
							option: "register_socialmedia",
							ID: userObj.socialMediaID,
							Type: userObj.socialMediaType,
							Firstname: userObj.userFirstName,
							Lastname: userObj.userLastName,
							Email: userObj.userEmail,
							YearofBirth: userObj.userBirthyear,
							Country: userObj.userCountry,
							City: userObj.userCity,
							Neighborhood: userObj.userNeighborhood
						}
			   ).done( function(json) {
						
					if(json.constructor === String){
						json = $.parseJSON(json);
				    }
					
					if (json.success) {
						userObj.userId = json.id;
						
						$.mobile.changePage('mapPage.html', { transition: "slide" });
						
					} else {
						alert("Please evaluate your data and register again");
					}
			    })
			    .fail( function(xhr, textStatus, error) {
			    	console.log(xhr.statusText);
			        console.log(textStatus);
			        console.log(error);
			        alert("Please evaluate your data and register again");
			    });
	};
	
	
	/**
	 * Login user
	 */
	this.loginUser = function() {
		
		var email = $('#logintxtEmail').val();
		var pass = $('#logintxtPass').val();
		
		var posofat=email.indexOf("@");
		var posofdot=email.lastIndexOf(".");
		if (posofat < 1 || posofdot < posofat+2 || posofdot+2 >= email.length)
		{
		  alert("Please enter a valid e-mail address. Example: Yourname@domain.com");
		  return false;
		}
		
		if (pass.length < 3)
		{
		  alert("Please enter your password.");
		  return false;
		}
		
		$.post( url+'GeoAccountMobile', 
				{option: "login", 
					Email: email,
					Password: md5(pass)})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					if($('#keepLoginCheck').is(':checked')){
						// alert('Keep login is checked - Date will be saved for next start');  //TESTONLY
						
						// Write information to local app storage to keep user logged in
						window.localStorage.setItem("keepLoggedIn", "true");
						window.localStorage.setItem("userId", json.id);
						window.localStorage.setItem("email", email);
						window.localStorage.setItem("userPass", md5(pass));
					}
					else{
						// alert('Keep login is not checked - Date will not be saved'); //TESTONLY
						
						// Write information to local app storage to keep user logged in
						window.localStorage.setItem("keepLoggedIn", "false");
						window.localStorage.setItem("userId", json.id);
						window.localStorage.setItem("email", email);
						window.localStorage.setItem("userPass", md5(pass));
					}
					
					userObj.userId = json.id;
					userObj.userEmail = email;
					
					$.mobile.changePage('mapPage.html', { transition: "slide" });
					
				} else {
					alert("Please login again");
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	console.log(xhr.statusText + textStatus + error);
		    	notification('Opps, hubo un problema en la conexión. Intenta de nuevo.', 'Aviso', 'Aceptar');
		    });
	};
	
	
	/**
	 * Login user who choose to keep him loged in
	 */
	this.automaticUserLogin = function() {
		
		var email = window.localStorage.getItem("email");
		var pass = window.localStorage.getItem("userPass");
		
		$.post( url+'GeoAccountMobile', 
				{option: "login", 
					Email: email,
					Password: pass})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
															
					userObj.userId = json.id;
					userObj.userEmail = email;
					alert("your userID: " + json.id + "your email: " + email);
					
					$.mobile.changePage('mapPage.html', { transition: "none", reverse: false, changeHash: false});
					
				} else {
					alert("Please login again because not saved right");
				}
		    })
		    
		    .fail( function(xhr, textStatus, error) {
		    	alert("Please login again because request failed");
		    });
	};
	
	/**
	 * checks if login data, which is saved in the local
	 * storage is correct
	 */
	this.checkLogin = function() {
		
		var email = window.localStorage.getItem("email");
		var pass = window.localStorage.getItem("userPass");
		
		$.post( url+'GeoAccountMobile', 
				{option: "login", 
					Email: email,
					Password: pass})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
															
					userObj.userId = json.id;
					userObj.userEmail = email;
					
					return true;
					
				} else {
					alert("Please login again");
					return false;
				}
		    })
		    
		    .fail( function(xhr, textStatus, error) {
		    	alert("Please login again");
		    	return false;
		    });
	};
	
	
	/**
	 * Logout user and go to loginPage
	 */
	this.logoutUser = function() {
		
				
		//Write important information to local app storage
		window.localStorage.removeItem("userId");
		window.localStorage.removeItem("email");
		window.localStorage.removeItem("userPass");
						
		$.mobile.changePage('loginPage.html', { transition: "slide" });
		
	};
	
}