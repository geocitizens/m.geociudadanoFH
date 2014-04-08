function OnClickLoginTwitter()
{
	var cb = new Codebird;
	
	cb.setConsumerKey("VVsYExbNHDhmg8f4Ra5aUMBKB"/*Key*/, "MKQIvnnKNKKJKf6gjpPOWPkhNKxzIAfNfOroFpWNHQqYMUVDjB"/*Secret*/);
	
// authorize the user and ask her to get the pin.
	cb.__call
	(
		"oauth_requestToken",
			{oauth_callback: " http://geociudadano.org/"},
			function (reply)
			{
	   			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
	   			cb.__call
	   			(
	    			"oauth_authorize",	{},
	    			function (auth_url)
	    			{
	    				/*
	    				//var ref = window.open(auth_url, '_blank'); // call to InAppBrowser
	    				
	    				 var ref = window.open(auth_url, '_blank', 'location=no'); // redirection.
	    				// check if the location the phonegap changes to matches our callback url or not
	    				 ref.addEventListener('loadstart', function() { alert('start: ' + event.url); });
	    				 
	    				 //ref.addEventListener('loadstart', function(event)
	    				 //{
	    				     //if(event.url.match('geociudadano'))
	    				     //{
	    				    	 //ref.close();
	    				    	 //authorize();
	    				     //}
	    				 //});    		
	    				 */
	    				var ref = window.open(auth_url, '_blank', 'location=no'); // redirection.
        				// check if the location the phonegap changes to matches our callback url or not
        				ref.addEventListener("loadstart", function(iABObject) {				
        					if(iABObject.url.match('geociudadano')) {
        						ref.close();
        						authorize(iABObject);
        					}
        				});        						    				
	    				
	       			}
	   			);
			}
	);
	
	//Aufruf der Servlet Methode mit ID und info das Aufruf über twitter	
	/*$.post( url+'SocialMediaLogin', {ID : localStorage.ID, Type : "Twitter"})
		.done( function(json) {
		  								
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
															
				//Prüfen ob neuer Account dann Dialog zur vervollständigung anzeigen sonst startseite
				
			} else {

			}
	    });*/
}	

/*function authorize()
{
   	var pin = prompt("Enter pin");
   	if(pin!=null && pin!="")
   	{ 
 		cb.__call
 		(
   			"oauth_accessToken", {oauth_verifier: pin},
   			function(reply)
   			{
   				cb.setToken(reply.oauth_token, reply.oauth_token_secret);
   				localStorage.accessToken = reply.oauth_token;
   				localStorage.tokenSecret = reply.oauth_token_secret;
   				localStorage.ID = reply.user_id;
   			}
   		);
   	}
}*/

function authorize(o) {
	var currentUrl = o.url;
	var query = currentUrl.match(/oauth_verifier(.+)/);
	
   	for (var i = 0; i < query.length; i++) {
    	parameter = query[i].split("=");
    	if (parameter.length === 1) {
        	parameter[1] = "";
    	}
	}
   	
	cb.__call(
       	"oauth_accessToken", {oauth_verifier: parameter[1]},
       	function (reply)
       	{
    	   	cb.setToken(reply.oauth_token, reply.oauth_token_secret);
           	localStorage.accessToken = reply.oauth_token;
           	localStorage.tokenSecret = reply.oauth_token_secret;
           	localStorage.ID = reply.user_id;           	
        }
    );
}


