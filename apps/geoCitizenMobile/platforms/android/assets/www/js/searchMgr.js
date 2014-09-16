/* Search obj */
function SearchMgr(){
	
	var searchObj = this;
	
	//Public properties
	this.searchResults = null;
		

	//**************************************** Public Methods ****************************************************//		
	
	/**
	* Let User get to the searchReultsPage
	*/
	this.skipToSearchResults = function() {
		$.mobile.changePage('listviewPage.html', { transition: "slide" });
	};
	
	this.makeSuggestions = function() {
		
		var searchtxt = $('#searchtxt').val();
		var sugList = $("#suggestions");
		
		//if searchtext is smaller then 4 letters do nothing
		if (searchtxt.length < 4){
			sugList.html("");
    		sugList.listview("refresh");
		}
		//send search request to GeoSearch Servlet
		else
		{			
			$.post( url+'GeoSearch', 
					{ SearchText: searchtxt })
					.done( function(json) {
				  	
						var str = "";
						
						if(json.constructor === String){
							json = $.parseJSON(json);
					    }
						
						if (json.success) {
															
							//get suggestions and write them into suggestion listview
							for (var key in json) {
						         if (json.hasOwnProperty(key)) 
						         {
						        	 str += "<li>"+json[key].Description+"</li>";
						         }
							}
							sugList.html(str);
			                sugList.listview("refresh");
						
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
	
	this.searchReport = function() {
				
		var searchtxt = $('#searchtxt').val();
		
		//if searchtext is smaller then 4 letters do nothing
		if (searchtxt.length < 4){
			alert("Please enter a more specific search text");
		}
		//send search request to GeoSearch Servlet
		else
		{	
			$.post( url+'GeoSearch', 
					{ SearchText: searchtxt })
					.done( function(json) {
				  	
						var tables = "";
						
						if(json.constructor === String){
							json = $.parseJSON(json);
					    }
						
						if (json.success) {
							
							$.mobile.changePage('listviewPage.html', { transition: "slide" });
							
							var tableBody = $(".tableBody");
															
							//get suggestions and write them into suggestion listview
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
		}
	};
	
	this.filterReports = function() {
		
		var searchtxt = $('#searchtxt').val();
		
		
		//if searchtext is smaller then 4 letters do nothing
		if (searchtxt.length < 4){
			alert("Please enter a more specific search text");
		}
		//send search request to GeoSearch Servlet
		else
		{	
			$.post( url+'GeoSearch', 
							{ 
								SearchText: searchtxt,
								filter:1
							}
			
			).done( function(json) {
				  	
						var tables = "";
						
						if(json.constructor === String){
							json = $.parseJSON(json);
					    }
						
						if (json.success) {
							
							$.mobile.changePage('listviewPage.html', { transition: "slide" });
							
							var tableBody = $(".tableBody");
															
							//get suggestions and write them into suggestion listview
							for (var key in json) {
						         if (json.hasOwnProperty(key)) 
						         {
						        	 tables += 
						        		 "<tr id=\"" + json[key].DB_ID + "\">" +
						        		 	"<td><img src=\"../img/markerSymbols/" + json[key].PictureID + " alt=\"\" border=1></img></td>" +
						        		 	"<td>" + json[key].DB_ID + "</td>" +
						        		 "</tr>";
						         }
							}
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
		}
	};
	
	this.showAllReports = function(UserObj) {
		
		alert(UserObj.userFirstName);
		
		$.post( url+'GeoSearch', 
				{ filter: 0 })
				.done( function(json) {
			  	
					var tables = "";
					
					if(json.constructor === String){
						json = $.parseJSON(json);
				    }
					
					if (json.success) {
						
						$.mobile.changePage('listviewPage.html', { transition: "slide" });
						
						var tableBody = $(".tableBody");
														
						//get suggestions and write them into suggestion listview
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
}