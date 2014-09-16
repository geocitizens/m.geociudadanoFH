var imgBase64 = null;
// A button will call this function
// To capture photo
function capturePhoto() {
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(rememberImgBase64, onFail, { 
        quality: 40,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

// A button will call this function
// To select image from gallery
function getPhoto() {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(rememberImgBase64, onFail, { 
    	quality: 40,
    	destinationType: Camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}

//To save the image temporary in var
function rememberImgBase64(base64Img){
	
	imgBase64 = base64Img;
}

// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
}

/**
 * Show dialog to let the user choose if want to take a new one or one from gallery
 */
function notiSourceImg(){
	
	// process the confirmation dialog result
	function onConfirm(button) {
	    
		if (button === 1) {
			
			capturePhoto();
			
		} else if (button === 2) {
			getPhoto();
		}
	}

	// Show a custom confirmation dialog
    navigator.notification.confirm(
    	'Puedes tomar la foto o seleccionarla de la galeria',	// message
        onConfirm,              								// callback to invoke with index of button pressed
        'Foto',            										// title
        'Camara,Galeria'          								// buttonLabels
    );
}