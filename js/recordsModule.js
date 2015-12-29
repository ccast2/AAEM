var requestTimeout;
var requestInterval;
function recordsModule () {
	
	this.currentRecord = false;
	this.error = 0;
	this.dataPost = {};
	this.spec = null;
	this.request = null;

	this.handleRequest = function (idRequest) {
		configuration.loadingOpenButton();
		$("#individualSpec").popup("close");
		this.request = idRequest;
		if (true) {requestInterval = setInterval(function(){ verifyRequest() }, 2000);};		
		requestTimeout = setTimeout(function(){ 
			activeRecord.cancelRequest();

		}, 300000);
	}

	this.getGaleryPhoto = function() {  

	  navigator.camera.getPicture(uploadPhoto,cancelPhoto,{
	      quality: 100,
	      destinationType: navigator.camera.DestinationType.FILE_URI,
	      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
	      targetWidth: 600,
	      targetHeight: 800,
	      correctOrientation: true
	    }
	  );  
	}
	this.getCameraPhoto = function () {
    
		  navigator.camera.getPicture(uploadPhoto,cancelPhoto,{
		    quality: 100,
		    destinationType: Camera.DestinationType.FILE_URI,
	        sourceType: Camera.PictureSourceType.CAMERA,
	        mediaType: Camera.MediaType.CAMERA,
	        encodingType: Camera.EncodingType.JPEG,
		    targetWidth: 600,
		    targetHeight: 800,
		    correctOrientation: true
		  });
	}
	cancelPhoto = function () {
		notifications.toast('Accion cancelada');
	}
	uploadPhoto = function (imageURI) {
		var options = new FileUploadOptions();
		options.fileKey="userfile";
		if(navigator.userAgent.match(/OS/i)){
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		}
		options.mimeType="image/jpg";
		var params = new Object();
		params.value1 = "test";
		params.value2 = "param";
		options.params = params;
		options.headers = {
			Connection: "close"
		}
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(configuration.server + "upload/do_upload"), win, fail, options);
		
	}
	win = function (r) {
		response = r.response;
		response = jQuery.parseJSON(response);
		
		$("#photos").append('<input type="hidden" name="recordImages[]" value="' + response.idImage + '" />');
		$("#savedImages").append('<a href="#popupPreview"  class="toPreview" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + 
			configuration.url + 
			'uploads/' +
			response.name +
			'" alt="Imagen diagnostica" ></a>');
		
	}
	fail = function (response) {
		console.log(response);	
	}

	this.cancelRequest = function (argument) {
		dataPost = {
			request:activeRecord.request
		}
		ajaxModule.ajaxCancelRequest(dataPost,7);
		deleteTimeOut();
		deleteInterval();
		this.request = null;
		configuration.loadingClose();
	}

	this.clearIntervals = function (argument) {
		deleteTimeOut();
		deleteInterval();
		configuration.loadingClose();
	}


	deleteTimeOut = function() {
  	  clearTimeout(requestTimeout);
	}
	deleteInterval = function() {
  	  clearInterval(requestInterval);
	}

	verifyRequest = function () {
		dataPost = {
			request:activeRecord.request
		}
		ajaxModule.ajaxSeeRequest(dataPost,6);
	}


	this.saveRecord = function () {

		var tmpDataPost = {
			idpacient : tmpPacient.id,
		};

		if (!validate()) {
	
		$("#consultForm").find("textarea,input").each(function(index, field) {

	        tmpDataPost[field.name.replace("consult","")] = field.value;
	    });
	    var recordImages = [];
		$("#consultForm").find("input[name='recordImages[]']").each(function(index, field) {
			recordImages.push(field.value);
	    });
	    if (recordImages.length > 0) {
	    	tmpDataPost['images'] = recordImages;
	    };


	    tmpDataPost.urgency = $("#consulturgency").is(':checked')?1:0;
	    this.dataPost = tmpDataPost;

	    ajaxModule.saveHistory(this.dataPost,3);

		}else{
			notifications.toast(configuration.errorCodes[5].message);
		}
	}
	this.specialityList = function () {


	}

	validate = function () {

		var error = false;
	    $(".AAEM_required").each(function(index,element){
	    	// $(element).val("Dato de prueba");
	        if ($(element).val()=="") {
	        	$(element).addClass("wrong");
	        	$(element).parents(".ui-field-contain")[0]
	        	var campo = $(element).parents(".ui-field-contain")[0];
	        	$(campo).find("h5").addClass("wrong");
	        	// $(element).parent().find("h5").addClass("wrong");
	        	error = true
	        };
	    });	
	    return error;
	}
}
var counter = 0;
var activeRecord = new recordsModule();