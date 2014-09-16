function FacebookMgr(){

	var FacebookObj = this;

	this.friendIDs = [];
	this.fbdata = null;
	this.fbjson = null;
	this.fbId = null;

	this.fb_login = function() {
		FB.login(function(response) {
			console.log("first" + response.id);
			FacebookObj.fbdata = JSON.stringify(response);
			FacebookObj.fbjson = JSON.parse(FacebookObj.fbdata);
			console.log("second" + FacebookObj.fbjson.id);
			FacebookObj.fbId = response.id;
			console.log("savedVAR: " + FacebookObj.fbId);
		}, {
			scope : "email"
		});
	};

	this.fb_promptLogin = function() {
		FB.login(null, {
			scope : 'email'
		});
	};

	this.fb_getLoginStatus = function() {
		FB.getLoginStatus(function(response) {
			if (response.status == 'connected') {
				alert('logged in');
			} else {
				alert('not logged in');
			}
		});
	};

	this.fb_me = function() {
		console.log("in function me ");
		FB.api('/me/friends', {
			fields : 'id, name, picture'
		}, function(response) {
			if (response.error) {
				alert(JSON.stringify(response.error));
			} else {
				var data = document.getElementById('data');
				fdata = response.data;
				console.log("fdata: " + fdata);
				response.data
						.forEach(function(item) {
							var d = document.createElement('div');
							d.innerHTML = "<img src=" + item.picture + "/>" + item.name;
							data.appendChild(d);
						});
			}
			var friends = response.data;
			console.log(friends.length);
			for (var k = 0; k < friends.length && k < 200; k++) {
				var friend = friends[k];
				var index = 1;

				friendIDs[k] = friend.id;
				// friendsInfo[k] = friend;
			}
			console.log("friendId's: " + friendIDs);
		});
	};

	this.fb_logout = function() {
		FB.logout(function(response) {
			alert('logged out');
		});
	};

	this.fb_facebookWallPost = function() {
		console.log('Debug 1');
		var params = {
			method : 'feed',
			name : 'Facebook Dialogs',
			link : 'https://developers.facebook.com/docs/reference/dialogs/',
			picture : 'http://fbrell.com/f8.jpg',
			caption : 'Reference Documentation',
			description : 'Dialogs provide a simple, consistent interface for applications to interface with users.'
		};
		console.log(params);
		FB.ui(params, function(obj) {
			console.log(obj);
		});
	};

	this.fb_publishStoryFriend = function() {
		randNum = Math.floor(Math.random() * friendIDs.length);

		var friendID = friendIDs[randNum];
		if (friendID === undefined) {
			alert('please click the me button to get a list of friends first');
		} else {
			console.log("friend id: " + friendID);
			console.log('Opening a dialog for friendID: ', friendID);
			var params = {
				method : 'feed',
				to : friendID.toString(),
				name : 'Facebook Dialogs',
				link : 'https://developers.facebook.com/docs/reference/dialogs/',
				picture : 'http://fbrell.com/f8.jpg',
				caption : 'Reference Documentation',
				description : 'Dialogs provide a simple, consistent interface for applications to interface with users.'
			};
			FB.ui(params, function(obj) {
				console.log(obj);
			});
		}
	};
}