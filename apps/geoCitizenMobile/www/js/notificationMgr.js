/**
 * When the user want to exit the app
 */
function notiExit(){
	
	// process the confirmation dialog result
	function onConfirm(button) {
	    
		if (button == 1) {
			try {
				
				if (positionMgr != null) {
					positionMgr.stopWatchingPosition();
				}
				
				if (device.platform == 'Android' || device.platform == 'android') {
					navigator.app.exitApp();
				} else {
					$.mobile.changePage('../index.html');
				}
				
			} catch (e) {
				// TODO: handle exception
			}
		}
	}

	// Show a custom confirmation dialog
	//
    navigator.notification.confirm(
        'Deseas salir de GeoApp?', // message
        onConfirm,                // callback to invoke with index of button pressed
        'Aviso!',                 // title
        'Si,No'          		  // buttonLabels
    );
}

/**
 * Default notification
 * @param msg 
 * @param title
 * @param button
 */
function defaultNoti(msg, title, button){
	
	// process the confirmation dialog result
	function onConfirm(button) {
	    
	}

	// Show a custom confirmation dialog
	//
    navigator.notification.confirm(
        msg, 					  // message
        onConfirm,                // callback to invoke with index of button pressed
        title,                    // title
        button          		  // buttonLabels
    );
}
