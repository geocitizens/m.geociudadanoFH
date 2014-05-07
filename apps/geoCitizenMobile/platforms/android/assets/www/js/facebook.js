/**
 * 
 */

var friendIDs = [];
var fbdata;
var fbjson;

function fb_login() {
	FB.login(function(response) {
		fbdata = JSON.stringify(response);
		fbjson = JSON.parse(fbdata);
		console.log("UserInfo: "+fbdata);
		console.log("UserID: "+fbjson.id);
	},
	{ scope: "email" }
	);
}

function fb_promptLogin() {
	  FB.login(null, {scope: 'email'});
	}

function fb_getLoginStatus() {
    FB.getLoginStatus(function(response) {
                      if (response.status == 'connected') {
                      alert('logged in');
                      } else {
                      alert('not logged in');
                      }
                      });
}

function fb_me() {
	console.log("in function me ");
    FB.api('/me/friends', { fields: 'id, name, picture' },  function(response) {
           if (response.error) {
           alert(JSON.stringify(response.error));
           } else {
           var data = document.getElementById('data');
		   fdata=response.data;
		   console.log("fdata: "+fdata);
           response.data.forEach(function(item) {
                                 var d = document.createElement('div');
                                 d.innerHTML = "<img src="+item.picture+"/>"+item.name;
                                 data.appendChild(d);
                                 });
           }
		var friends = response.data;
		console.log(friends.length); 
		for (var k = 0; k < friends.length && k < 200; k++) {
	        var friend = friends[k];
	        var index = 1;

	        friendIDs[k] = friend.id;
	        //friendsInfo[k] = friend;
		}
		console.log("friendId's: "+friendIDs);
           });
}

function fb_logout() {
    FB.logout(function(response) {
              alert('logged out');
              });
}

function fb_facebookWallPost() {
    console.log('Debug 1');
	var params = {
	    method: 'feed',
	    name: 'Facebook Dialogs',
	    link: 'https://developers.facebook.com/docs/reference/dialogs/',
	    picture: 'http://fbrell.com/f8.jpg',
	    caption: 'Reference Documentation',
	    description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
	  };
	console.log(params);
    FB.ui(params, function(obj) { console.log(obj);});
}

function fb_publishStoryFriend() {
	randNum = Math.floor ( Math.random() * friendIDs.length ); 

	var friendID = friendIDs[randNum];
	if (friendID == undefined){
		alert('please click the me button to get a list of friends first');
	}else{
    	console.log("friend id: " + friendID );
        console.log('Opening a dialog for friendID: ', friendID);
        var params = {
        	method: 'feed',
            to: friendID.toString(),
            name: 'Facebook Dialogs',
            link: 'https://developers.facebook.com/docs/reference/dialogs/',
            picture: 'http://fbrell.com/f8.jpg',
            caption: 'Reference Documentation',
            description: 'Dialogs provide a simple, consistent interface for applications to interface with users.'
     	};
		FB.ui(params, function(obj) { console.log(obj);});
    }
}