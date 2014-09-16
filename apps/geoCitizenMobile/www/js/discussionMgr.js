/* Discussion obj 
 * Functionality to load comments of a report
 * also to write delete and edit a comment
 */
function DiscussionMgr() {

	// To have access from methods
	var discussionMgrObj = this;

	// Public properties
	this.reportID = null;
	this.userID = null;
	this.commentID = null;
	this.discussion = null;
	this.replys = {
			commentID: []
	};
	
	this.firstcomment = true;
	this.firstreply = true;

	// ********************************* Public Methods ************************************//

	this.getComments = function(_reportID, _userID) {

		discussionMgrObj.reportID = _reportID;
		
		discussionMgrObj.discussion = { "comments":[
		                      {
		                          "commentID":"",
		                          "commenttxt":"",
		                          "joined": {
		                              "month":"January",
		                              "day":12,
		                              "year":2012
		                          }
		                      },
		                      {
		                          "firstName":"John",
		                          "lastName":"Jones",
		                          "joined": {
		                              "month":"April",
		                              "day":28,
		                              "year":2010
		                          }
		                      }
		              ]}

		// send request for all Comments to GeoProcessMobile Servlet
		$.post(url + 'GeoProcessMobile', {
			option : "Read",
			ObservationID : _reportID,
			UserID : _userID
		}).done(
				function(json) {

					var tables = "";

					if (json.constructor === String) {
						json = $.parseJSON(json);
					}
					
					var tableBody = $(".tableBody");
					
					if (json.success) {

						// get comments and write them into discussionPage
						$.each(json.array, function(i, object) {

							var deletable;

							if (object.Erasable === true) {
								deletable = "deletable";
							} else {
								deletable = "not_deletable";
							}

							if (object.Reply === false) {
								
								tables += "<tr id=\"" + object.ID
										+ "\" class=\"comment\">" + "<td><p>"
										+ object.User + "<br>"
										+ object.Description + "</p></td>"
										+ "<td class=\"" + deletable
										+ "\"></td>" + "</tr>";
							} else {
								tables += "<tr id=\"" + object.ID
										+ "\" class=\"reply\">" + "<td><p><em>"
										+ object.User + "<br>"
										+ object.Description + "</em></p></td>"
										+ "<td class=\"" + deletable
										+ "\"></td>" + "</tr>";
							}

						});
						tableBody.html("");
						tableBody.empty();
						tableBody.html(tables);

						
						// If Json can not be read leave it empty
					} else {
						tableBody.html("");
						tableBody.empty();
					}
				})
		// If request fails leave it empty
		.fail(function(xhr, textStatus, error) {
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		});
	}
	
	this.sendComment = function(_reportID, _userID) {

		discussionMgrObj.reportID = _reportID;
		
		var _comment = $('#Commentinput').val();
		
		if(_comment.legth)
		{
			alert("Please enter your comment");
			return false;
		}

		// send request for all Comments to GeoProcessMobile Servlet
		$.post(url + 'GeoProcessMobile', {
			option : "WriteComment",
			ObservationID : _reportID,
			UserID : _userID,
			Comment : _comment
		}).done(
				function(json) {

					if (json.success) {
						
						this.getComments(_reportID, _userID);
						
					// If Json response is error
					} else {
						alert("Something went wrong while writing your comment");
					}
				})
		// If request fails leave it empty
		.fail(function(xhr, textStatus, error) {
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
		});
	}
	
	this.getReplys(_commentID){
		
		// TODO get replys for a special comment and load them into a new 
		// discussionPage
		
	}
};