/* Report obj */
function ReportMgr(){
	
	//To have access from methods
	var reportMgrObj = this;
	
	//Public properties
	this.searchResults = null;
	this.theme = null;
	this.category = null;
	this.title = null;
	this.description = null;
	this.date = null;
	this.country = null;
	this.city = null;
	this.neighborhood = null;
	this.aim = null;
	this.anonymous = null;
	this.ID = null;
	this.pictureID;

	//**************************************** Public Methods ****************************************************//		
	
	this.makeSuggestions = function() {
		
		var searchtxt = $('#searchtxt').val();
		var sugList = $("#suggestions");
		
		//if searchtext is smaller then 4 letters do nothing
		if (searchtxt.length < 4){
			succList.html("");
    		succList.listview("refresh");
		}
		//send search request to GeoSearch Servlet
		else
		{			
			$.post( url+'GeoSearch', 
					{ SearchText: searchtxt }
				)
				.done( function(json) {
			  	
					var succ = "";
					
					if(json.constructor === String){
						json = $.parseJSON(json);
				    }
					
					if (json.success) {
						
						//get suggestions and write them into suggestion listview
						$.each(json.array, function(i, object) {
							succ += "<li id=\"" + object.id + "\">" + object.Description+"</li>";
						});
														
						succList.html(succ);
		                succList.listview("refresh");
					
		            //If Json can not be read leave it empty
					} else {
						sugList.html("");
			    		sugList.listview("refresh");
					}
			    })
			    //If request fails leave it empty
			    .fail( function(xhr, textStatus, error) {
			    	
			    	console.log(xhr.statusText);
			        console.log(textStatus);
			        console.log(error);
			        sugList.html("");
		    		sugList.listview("refresh");
			    });
		}
	};
	
	/*
	 * Search Function
	 */
	this.searchReport = function() {
				
		var searchtxt = $('#searchtxt').val();
		
		//if searchtext is smaller then 4 letters do nothing
		if (searchtxt.length < 4){
			alert("Please enter a more specific search text");
		}
		
		//send search request to GeoSearch Servlet
		else
		{	
			$.post( url + 'GeoSearch', 
				{ SearchText: searchtxt }
			)	
			.done( function(json) {
		  	
				var tables = "";
				
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					var tableBody = $(".tableBody");
					
					//get searched Reports into tables listview
					$.each(json.array, function(i, object) {
						tables += 
			        		 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
			        		 	"<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
			        		 	"<td>" + object.Description + "</td>" +
			        		 	"<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
			        		 "</tr>";
					});
					
					tableBody.empty();
					tableBody.html(tables);
				
	            //If Json can not be read leave it empty
				} else {
					alert("Sorry something happened while getting the reports");
				}
		    })
		    //If request fails leave it empty
		    .fail( function(xhr, textStatus, error) {
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
		}
	};
	
	/*
	 * Filter function
	 */
	this.filterReports = function() {
		
		var searchtxt = null;
		var usernametxt = null;
		var selectedTheme = null;
		var selectedCategory = null;
		var selectedStatus = null;
		var barriotxt = null;
		var daytxt = null;
		var monthtxt = null;
		var yeartxt = null;
		
		searchtxt = $('#searchtxt').val();
		usernametxt = $('#usernameFiltertxt').val();
		selectedTheme = $( "#ThemeSelect option:selected" ).val();
		selectedCategory = $('#CategorySelect option:selected').val();
		selectedStatus = $('#StatusSelect option:selected').val();
		barriotxt = $('#barrioFiltertxt').val();
		daytxt = $('#dateDayFiltertxt').val();
		monthtxt = $('#dateMonthFiltertxt').val();
		yeartxt = $('#dateYearFiltertxt').val();
		
		// if searchtext is is entered and is smaller then 4 letters do nothing
		if (searchtxt.length !== 0 && searchtxt.length < 4){
			alert("Please enter a more specific search text");
		}
		// if username is entered and is smaller then 4 letters do nothing
		else if (usernametxt.length !== 0 && usernametxt.length < 4){
			alert("Please enter a specific username");
		}
		// send search request to GeoSearch Servlet
		else
		{
			$.post( url+'GeoSearch',
							{
								SearchText: searchtxt,
								filter: 1,
								neighborhood: barriotxt,
								user: usernametxt,
								topic: selectedTheme,
								category: selectedCategory,
								status: selectedStatus,
								day:  daytxt,
								month: monthtxt,
								year: yeartxt
							}
			
			).done( function(json) {
				
				var tables = "";
						
				if(json.constructor === String){
					json = $.parseJSON(json);
				}
				
				if (json.success) {
					
					var tableBody = $(".tableBody");
					
					// get Reports into tables listview
					$.each(json.array, function(i, object) {
						tables += 
								 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
			        		 	    "<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
			        		 	    "<td>" + object.Description + "</td>" +
			        		 	   "<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
			        		 	 "</tr>";
					});	
					
					tableBody.html(tables);
				
	            // If Json can not be read leave it empty
				} else {
					alert("Could not read Json for search");
				}
		    })
		    // If request fails leave it empty
		    .fail( function(xhr, textStatus, error) {
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
		}
	};
	
	/**
	 * Load necessary data for Filter -> Theme
	 */
	this.loadFilterThemes = function() {
				
		var themeSelect = $('#ThemeSelect');
		var loadedThemes = null;
				
		$.post( url+'GeoAdmin', 
				{option: "Themes"})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedThemes += "<option value=\"" + object.id + "\">" + object.name + "</option>";
					});
					
					themeSelect.empty().html("<option>" + "Select a Theme" + "</option>").selectmenu('refresh', true);
					themeSelect.append(loadedThemes);
					
				} else {
					themeSelect.empty();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        countriesSelect.empty();
		    });
	};
	
	
	/**
	 * Load necessary data for Filter -> Categories
	 */
	this.loadFilterCategories = function(userSubgeo) {
				
		var categorySelect = $('#CategorySelect');
		var loadedCategories = null;
		
		if(userSubgeo === null){
			alert("You have not entered your SubGeo in your Profil");
			return;
		}
		
		var selectedTheme = $( "#ThemeSelect option:selected" ).val();
		
		$.post( url+'GeoAdmin', 
				{option: "Categories",
				 subgeo: userSubgeo,
				 theme:	selectedTheme})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					
					$.each(json.array, function(i, object) {
						loadedCategories += "<option value=\"" + object.id + "\">" + object.Name + "</option>";
					});
					
					categorySelect.empty().html("<option>" + "Select a Category" + "</option>").selectmenu('refresh', true);
					categorySelect.html(loadedCategories);
					
				} else {
					categorySelect.empty();
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		        citiesSelect.empty();
		    });
	};
	
	/**
	 * Load necessary data for Filter -> Status
	 */
	this.loadFilterStatus = function() {
				
		var statusSelect = $('#StatusSelect');
		var loadedStatus = null;
		
		loadedStatus +=	"<option value=\" 1 \"> Observation </option>" +
						"<option value=\" 2 \"> Process </option>" +
						"<option value=\" 3 \"> Proposal </option>" +
						"<option value=\" 4 \"> Solution </option>";
		
		statusSelect.empty().append("<option>" + "Select a Status" + "</option>" + loadedStatus).selectmenu('refresh', true);
					
	};
	
	/*
	 * Show all Reports Function
	 */
	this.showAllReports = function(userId) {
		
		/* For TESTONlY
		alert("UserID: " + userId);
		
		var json = '{"success":true,"array":[{"DB_ID":379,"PictureID":"40101_2","geom":"0101000020E61000005C11A30CDFFECCBF000000DAE29853C0","Status":2,"Description":"Mejorar nuestra situación del barrio gestionado la reconstrucción de nuestra VIA PRINCIPAL! / CHIVIQUI / 6 Posts 2 Participants"},{"DB_ID":381,"PictureID":"20101_0","geom":"0101000020E6100000EB5182EE3A39CDBF000000077B9753C0","Status":0,"Description":"Elaborar propuesta de diseño definitivo segun el ancho y las caracteristicas de la via. / TOLA CHICA"},{"DB_ID":529,"PictureID":"20103_2","geom":"0101000020E61000005A05B11FD131C8BF000000B4209F53C0","Status":2,"Description":"Planificar participativamente la mejor integracion e interconexion de esta estacion principal del Metroferico / LA CAROLINA / 2 Posts 2 Participants"},{"DB_ID":286,"PictureID":"50101_2","geom":"0101000020E610000052CC19ABCC01D0BF000000E9C59753C0","Status":2,"Description":"mejorar el plan de fuegos! / ALCANTARILLA 1 / 0 Posts 0 Participants"},{"DB_ID":309,"PictureID":"50101_2","geom":"0101000020E61000006AF36BF685FACEBF040000DBE09953C0","Status":2,"Description":"Quiero concienciar a nuestra vecindad sobre la amenaza de posibles urbanizaciones en nuestro Ilalo. / RUMIHUAYCO / 2 Posts 2 Participants"},{"DB_ID":282,"PictureID":"70101_2","geom":"0101000020E6100000B7877001AB14CDBF0000001CCE9853C0","Status":2,"Description":" / CHIVIQUI / 14 Posts 5 Participants"},{"DB_ID":333,"PictureID":"40101_2","geom":"0101000020E6100000807547A2F9DCD3BF000000002CED53C0","Status":2,"Description":"The town`s sewage dumps into the ocean. This needs to be fixed. / PUERTO AYORA / 4 Posts 3 Participants"},{"DB_ID":352,"PictureID":"50101_2","geom":"0101000020E61000000B8E0F60C7F3CFBF040000BED29753C0","Status":2,"Description":"REGISTRAR LOS INCENDIOS FORESTALES QUE SE PRODUZCAN EN EL ILALO / OLALLA / 4 Posts 3 Participants"},{"DB_ID":353,"PictureID":"50101_0","geom":"0101000020E610000010C6C478F451D0BF005A00C3639853C0","Status":0,"Description":"Registrar Ojos de Agua para su futura recuperacion / OLALLA"},{"DB_ID":354,"PictureID":"50101_0","geom":"0101000020E6100000F5FADE5C707BD0BF000000526B9853C0","Status":0,"Description":"Registrar ojos de agua para futura recuperacion / CASHALOMA"},{"DB_ID":496,"PictureID":"50101_2","geom":"0101000020E61000000863421D0DA2EABF0000004323BF56C0","Status":2,"Description":"UNIR criterios y propuestas para manejar estas invasiones de especies / PUERTO VILLAMIL / 2 Posts 2 Participants"}]}';
		
		var tables = "";
		
		if(json.constructor === String){
			json = $.parseJSON(json);
	    }
		
		if (json.success) {
			
			$.mobile.changePage('listviewPage.html', { transition: "slide" });
			
			var tableBody = $(".tableBody");
			
			//get all Reports into tables listview
			$.each(json.array, function(i, object) {
				console.log("id= " + object.DB_ID + " PictureID= " + object.PictureID + " Description= " + object.Description + " Status= " + object.Status);
				tables += 
					"<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
	        		 	"<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png " + "\" alt=\"\" border=1></img></td>" +
	        		 	"<td>" + object.Description + "</td>" +
	        		 	"<td>" + object.Status + "</td>" +
	        		 "</tr>";
			});
			
			console.log("Over for each");
			console.log(tables);
			
			tableBody.html("");
			tableBody.empty();
			tableBody.html(tables);
		
        //If Json can not be read leave it empty
		} else {
			alert("Sorry something happened while getting the reports");
		}
		*/
				
		
		// GeoObservation option getall
		$.post( url+'GeoObservationMobile', 
			{	
				option: "getall",
				UserID: userId
			}
		).done( function(json) {
					
			var tableBody = $(".tableBody");
			var tables = "";
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				// get all Reports into tables listview
				$.each(json.array, function(i, object) {
					tables += 
							 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
		        		 	    "<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
		        		 	    "<td>" + object.Description + "</td>" +
		        		 	    "<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
		        		 	 "</tr>";
				});														
				
				// console.log(tables);
				tableBody.empty();
				tableBody.html(tables);
				
				// hide status column
				$('td:nth-child(3),th:nth-child(3)').hide();
			
            // If Json can not be read leave it empty
			} else {
				tableBody.empty();
				alert("Sorry something happened while getting the reports");
			}
	    })
	    
	    // If request fails leave it empty
	    .fail( function(xhr, textStatus, error) {
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    });
	};
	
	/*
	 * Show all Activities of the current user in listviewPage
	 */
	this.showMyActivities = function(userId) {
		
		// alert("UserID: " + userId); //TESTONLY
		
		// GeoObservation option getall
		$.post( url+'GeoSearch', 
				{	
					filter: 1,
					user: userId
				}
				
		).done( function(json) {
			  	
			var tables = "";
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			var tableBody = $(".tableBody");
			
			if (json.success) {
				
				//get all Reports into tables listview
				$.each(json.array, function(i, object) {
					tables += 
		        		 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
		        		 	"<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
		        		 	"<td>" + object.Description + "</td>" +
		        		 	"<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
		        		 "</tr>";
				});
												
				/*
				for (var key in json) {
			         if (json.hasOwnProperty(key)) 
			         {
			        	 tables += 
			        		 "<tr id=\"" + json[key].DB_ID + "\ " + "class=\"procORobs\">" +
			        		 	"<td><img src=\"../img/markerSymbols/" + json[key].PictureID + " alt=\"\" border=1></img></td>" +
			        		 	"<td>" + json[key].DB_ID + "</td>" +
			        		 "</tr>";
			         }
				}
				*/
				
				tableBody.empty();
				tableBody.html(tables);
			} 
			// if no reports could be found
			else {
				tableBody.empty();
		    	alert("You haven't created an activity until now");
			}
		})
		// If request fails leave it empty
		.fail( function(xhr, textStatus, error) {
			    	console.log(xhr.statusText);
			        console.log(textStatus);
			        console.log(error);
			    });
		
	};
	
	
	/*
	 * load Observation details in detailPage if User clicks it in
	 * listviewPage
	 */
	this.loadDetailObservation = function(observationID) {
		
		// GeoObservationMobile get Observation details
		$.post( url+'GeoObservationMobile', 
				{	option: "get",
					id: observationID				
				}
				
		).done( function(json) {
					
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				reportMgrObj.description = json.Description;
				reportMgrObj.ID = prozessID;
				// TODO title and aim must also come from Servlet
				// reportMgrObj.aim = json.Aim;
				reportMgrObj.pictureID = json.PictureID;
				
				var symbolDiv = $(".detailMarkerSymbol");
				var titleDiv = $(".detailTitleString");
				var descriptionDiv = $(".detailDescription");
				
				symbolDiv.html("<img src=\"../img/markerSymbols/" + json.PictureID + ".png\" alt=\"\" border=1></img>");
				descriptionDiv.html(json.Description);
									
            // If Json can not be read leave it empty
			} else {
				alert("Sorry something happened while getting the observation");
			}
	    })
	    //If request fails leave it empty
	    .fail( function(xhr, textStatus, error) {
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    });
		
	};
	
	
	/*
	 * load Prozess details in detailPage if User clicks it in
	 * listviewPage
	 */
	this.loadDetailProzess = function(prozessID) {
				
		// GeoObservationMobile get Observation details
		$.post( url+'GeoObservationMobile', 
				{	option: "get",
					id: prozessID				
				}
				
		).done( function(json) {
					
					if(json.constructor === String){
						json = $.parseJSON(json);
				    }
					
					if (json.success) {
						
						reportMgrObj.description = json.Description;
						reportMgrObj.ID = prozessID;
						reportMgrObj.aim = json.Aim;
						reportMgrObj.pictureID = json.PictureID;
						// TODO title must also come from Servlet
						
						var symbolDiv = $(".detailMarkerSymbol");
						var titleDiv = $(".detailTitleString");
						var descriptionDiv = $(".detailDescription");
						
						symbolDiv.html("<img src=\"../img/markerSymbols/" + json.PictureID + ".png\" alt=\"\" border=1></img>");
						titleDiv.html(json.Aim);
						descriptionDiv.html(json.Description);
						
						var tableBody = $(".tableBody");
						var tables = "";
						
						if(json.Observations != null){
							
							// get all connected Observations and Processes into tables listview
							$.each(json.Observations, function(i, object) {
								tables += 
										 "<tr id=\"" + object.ID + "\" class=\"procORobs\">" +
					        		 	    "<td>" + object.Title + "</td>" +
					        		 	 "</tr>";
							});														
							
							// console.log(tables);
							tableBody.empty();
							tableBody.html(tables);
						}
						else{
							tableBody.empty();
						}
						
		            //If Json can not be read leave it empty
					} else {
						alert("Sorry something happened while getting the prozess");
					}
			    })
			    //If request fails leave it empty
			    .fail( function(xhr, textStatus, error) {
			    	console.log(xhr.statusText);
			        console.log(textStatus);
			        console.log(error);
			    });
	};
	
	
	/*
	 * Save the new report data
	 * temporary
	 */
	this.saveNewReport = function() {
		
		reportMgrObj.theme = $('#ThemeSelect').val();
		reportMgrObj.category = $('#CategorySelect').val();
		reportMgrObj.title = $('#newReportTitle').val();
		reportMgrObj.description = $('#newReportDescription').val();
		reportMgrObj.date = $('#newReportDate').val();
		reportMgrObj.country = $('#CountriesSelect').val();
		reportMgrObj.city = $('#CitiesSelect').val();
		reportMgrObj.neighborhood = $('#NeighborhoodSelect').val();
		reportMgrObj.aim = $('#newReportAim').val();
		reportMgrObj.anonymous = $('#Anonymous').val();
		
		
		if (reportMgrObj.theme === -1)
		{
			alert("Please select a theme for your report");
			return false;
		}
		else if (reportMgrObj.category === -1)
		{
			alert("Please select a category for your report");
			return false;
		}
		else if (1 >= reportMgrObj.title.length)
		{
			alert("Please enter a title for your report");
			return false;
		}
		else if (reportMgrObj.country === -1)
		{
			alert("Please choose your country");
			return false;
		}
		else if (reportMgrObj.city === -1)
		{
			alert("Please choose your city");
			return false;
		}
		else
		{
			$.mobile.changePage('procORobsPage.html', { transition: "slide" });
		}
	};
	

	/*
	 * If user just wants to report his/her observation or wants
	 * to start a new process or join an existing one
	 */
	this.createObservation = function(UserID, _lat, _lng) {
		
		$.post( url+'GeoObservationMobile',
			{
				option: "write",
				ThemeID: reportMgrObj.theme,
				CategoryID: reportMgrObj.category,
				Title: reportMgrObj.title,
				Description: reportMgrObj.description,
				CountryID: reportMgrObj.country,
				CityID: reportMgrObj.city,
				neighborhoodID: reportMgrObj.neighborhood,
				anonym: reportMgrObj.anonymous,
				UserID: UserID,
				Lat: _lat,
				Long: _lng
			}
	   ).done( function(json) {
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
								
			if (json.success) {
				reportMgrObj.ID = json.DB_ID;
				
			} else {
				alert("Sorry, something went wrong!");
			}
	    })
	    .fail( function(xhr, textStatus, error) {
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    });
	};
	
	
	/*
	 * If user wants to join his report to an existing process,
	 * show them to him
	 */
	this.showJoinable = function() {
		
		$.post( url+'GeoSearch', 
				{
					filter: 1,
					topic: reportMgrObj.theme,
					category: reportMgrObj.category,
					status: 2
				}

		).done( function(json) {
	  	
			var tables = "";
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				var tableBody = $(".tableBody");
				
				tables = "<tr id=\"0\" class=\"info\"><td></td><td>Now you can Join a similar process, or Start a new process</td><td></td></tr>";
				
				//get all Reports into tables listview
				$.each(json.array, function(i, object) {
					tables +=
		        		 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
		        		 	"<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
		        		 	"<td>" + object.Description + "</td>" +
		        		 	"<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
		        		 "</tr>";
				});
				
				tableBody.empty();
				tableBody.html(tables);
			
            //If Json can not be read leave it empty
			} else {
				var tableBody = $(".tableBody");
		    	
		    	var tables = "<tr id=\"0\" class=\"info\"><td></td><td>No similar process could be found, please Start a new process</td><td></td></tr>";
		    	
				tableBody.empty();
				tableBody.html(tables);
			}
	    })
	    //If request fails leave it empty
	    .fail( function(xhr, textStatus, error) {
	    	
	    	var tableBody = $(".tableBody");
	    	
	    	var tables = "<tr id=\"0\" class=\"info\"><td></td><td>No similar process could be found, please Start a new process</td><td></td></tr>";
	    	
			tableBody.empty();
			tableBody.html(tables);
	    	
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    });
	};
	
	
	/*
	 * If user wants to join his report to an specific existing process,
	 * show them to him
	 */
	this.searchJoinable = function() {
		
		var searchtxt = $('#searchtxt').val();
		
		$.post( url+'GeoSearch', 
				{ 
					SearchText: searchtxt,
					filter: 1,
					topic: reportMgrObj.theme,
					category: reportMgrObj.category,
					status: 2
				}

		).done( function(json) {
	  	
			var tables = "";
			
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
				
				var tableBody = $(".tableBody");
				
				//get all Reports into tables listview
				$.each(json.array, function(i, object) {
					tables += 
		        		 "<tr id=\"" + object.DB_ID + "\" class=\"procORobs\">" +
		        		 	"<td><img src=\"../img/markerSymbols/" + object.PictureID + ".png\" alt=\"\" border=1></img></td>" +
		        		 	"<td>" + object.Description + "</td>" +
		        		 	"<td id=\"" + object.Status + "\" class=\"statusID\">" + object.Status_Text + "</td>" +
		        		 "</tr>";
				});
				
				tableBody.empty();
				tableBody.html(tables);
			
            //If Json can not be read leave it empty
			} else {
				alert("Could not read Json for search");
			}
	    })
	    //If request fails leave it empty
	    .fail( function(xhr, textStatus, error) {
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    });
	};
	
	
	/**
	 * If user wants to join an existing process
	 */
	this.joinReport = function(processID) {
				
		$.post( url+'GeoProcessMobile', 
				{	option: "JoinProcess",
					ObservationID: reportMgrObj.ID,
					ProcessObservationID: processID})
			.done( function(json) {
			  								
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					alert("You successfully joined the existing process");		
				} else {
					alert("Could not join the existing process");
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
	};
	
	/**
	 * If user invites other users when he starts a new process
	 */
	this.inviteUsersOnStart = function() {
		
		var EMails = $('#processInvite_Email').val();
		var Usernames = $('#processInvite_Geo').val();		
		
		$.post( url+'GeoProcessMobile', 
				{	option: "Invite",
					ObservationID: reportMgrObj.ID,
					Users: Usernames,
					Emails: EMails})
			.done( function(json) {
			  	
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					alert("You successfully invited users to your process");		
				} else {
					alert("Could not invite users to this process");
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
	};
	
	/**
	 * If user wants to start his observation to make it a process
	 */
	this.startProcess = function(UserId) {
		
		reportMgrObj.aim = $('#processAim').val();
		
		if(reportMgrObj.aim === null){
			alert("Please enter a aim for your process");
			return;
		}
		
		$.post( url+'GeoProcessMobile', 
				{	option: "StartProcess",
					ObservationID: reportMgrObj.ID,
					Aim: reportMgrObj.aim,
					UserID: UserId})
			.done( function(json) {
			  	
				if(json.constructor === String){
					json = $.parseJSON(json);
			    }
				
				if (json.success) {
					alert("You successfully started your process");		
				} else {
					alert("Could not start your process");
				}
		    })
		    .fail( function(xhr, textStatus, error) {
		    	
		    	console.log(xhr.statusText);
		        console.log(textStatus);
		        console.log(error);
		    });
	};
	
}