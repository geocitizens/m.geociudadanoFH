var Codebird = require("codebird");
//or with leading "./", if the codebird.js file is in your main folder:

var cb = new Codebird;


function OnClickLoginTwitter()
{
	cb.setConsumerKey("YOUR CONSUMER KEY", "YOUR CONSUMER SECRET");
	
// authorize the user and ask her to get the pin.
	cb.__call
	(
		"oauth_requestToken",
			{oauth_callback: "oob"},
			function (reply)
			{
	   			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
	   			cb.__call
	   			(
	    			"oauth_authorize",	{},
	    			function (auth_url)
	    			{
	    				var ref = window.open(auth_url, '_blank'); // call to InAppBrowser
	    				ref.addEventListener('exit', authorize);
	       			}
	   			);
			}
	);
	
	//Aufruf der Servlet Methode mit ID und info das Aufruf über twitter	
	$.post( url+'SocialMediaLogin', {ID = localStorage.ID, Type = "Twitter"})
		.done( function(json) {
		  								
			if(json.constructor === String){
				json = $.parseJSON(json);
		    }
			
			if (json.success) {
															
				//Prüfen ob neuer Account dann Dialog zur vervollständigung anzeigen sonst startseite
				
			} else {

			}
	    })
	    .fail( function(xhr, textStatus, error) {
	    	
	    	console.log(xhr.statusText);
	        console.log(textStatus);
	        console.log(error);
	    	//notification('Opps, hubo un problema en la conexiÃ³n. Intenta de nuevo.', 'Aviso', 'Aceptar');
	    });
}	
	
}

function authorize()
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
}    