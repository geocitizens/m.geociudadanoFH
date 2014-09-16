/* Some Globals */

var cb = new Codebird; // we will require this everywhere

/**************************** Let the coding begin ****************************/

function onDeviceReady() {
	cb.setConsumerKey("THE KEY TO", "YOUR SECRET");
	var id;
 // authorize the user and ask her to get the pin.
		cb.__call(
			"oauth_requestToken",
    			{oauth_callback: "http://localhost/"},
    			function (reply) {
					// nailed it!
    	   			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
    	   			cb.__call(
        			"oauth_authorize",	{},
        			function (auth_url) {
        				var ref = window.open(auth_url, '_blank', 'location=no'); // redirection.
        				// check if the location the phonegap changes to matches our callback url or not
        				ref.addEventListener("loadstart", function(iABObject) {
        					if(iABObject.url.match(/localhost/)) {
        						ref.close();
        						authorize(iABObject);
        					}
        				});        					
	       			}
				);
       		}
		);
	}
}

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
       	function (reply) {
    	   	cb.setToken(reply.oauth_token, reply.oauth_token_secret);
           	localStorage.accessToken = reply.oauth_token;
           	localStorage.tokenSecret = reply.oauth_token_secret;       	
        }
    );
	
	//Login User or get him to the Register Page
}
      						
