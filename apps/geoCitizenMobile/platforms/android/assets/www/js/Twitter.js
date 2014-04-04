function parseText(text) {
    var link = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	var user = /@(\w+)/ig;
	var hashTags = /#(\w+)/ig;
	var desc = "";
	if(link) {
		desc = text.replace(link,'<a href="$1" target="_blank">$1</a>');
	} if(user) {
		desc = desc.replace(user,'<a href="https://twitter.com/$1" target="_blank">@$1</a>');
	} if(hashTags) {
		desc = desc.replace(hashTags,'<a href="https://twitter.com/search?q=%23$1" target="_blank">#$1</a>');
	}
	return desc;
}

var cb = new Codebird;

function OnClickLoginTwitter() {
	cb.setConsumerKey("YOUR CONSUMER KEY", "YOUR CONSUMER SECRET");
	// check if we already have access tokens
	if(localStorage.accessToken && localStorage.tokenSecret) {
		// then directly setToken() and read the timeline
		cb.setToken(localStorage.accessToken, localStorage.tokenSecret);
		cb.__call(
			"statuses_homeTimeline", {},
			function (reply) {
				for(var key in reply){
					if(reply[key].text)
						$('#timeline').append('<li><p>' + reply[key].user["screen_name"] +': ' + parseText(reply[key].text) +'</p></li>');
				}
			}						
		);
		fetchTweets(); //periodically fetch tweets. Make sure that it is not too frequent as you may get rate limited.
	} else { // authorize the user and ask her to get the pin.
		cb.__call(
			"oauth_requestToken",
    			{oauth_callback: "oob"},
    			function (reply) {
					// nailed it!
    	   			cb.setToken(reply.oauth_token, reply.oauth_token_secret);
    	   			cb.__call(
        			"oauth_authorize",	{},
        			function (auth_url) {
        				var ref = window.open(auth_url, '_blank'); // call to InAppBrowser
        				ref.addEventListener('exit', authorize);
	       			}
				);
       		}
		);
	}
}

function authorize() {
   	var pin = prompt("Enter pin");
   	if(pin!=null && pin!=""){ 
 		cb.__call(
   			"oauth_accessToken", {oauth_verifier: pin},
   			function(reply) {
   				cb.setToken(reply.oauth_token, reply.oauth_token_secret);
   				localStorage.accessToken = reply.oauth_token;
   				localStorage.tokenSecret = reply.oauth_token_secret; // twitter does not expire tokens, so no refresh token is required. Bingo!
				cb.__call(
					"statuses_homeTimeline", {},
					function (reply) {
						for (var key in reply) {
							$('#timeline').append('<li><p>' + reply[key].user["screen_name"] +': ' + parseText(reply[key].text) +'</p></li>');
						}
					}						
				);
			}
		);
		fetchTweets();	
	}
}    