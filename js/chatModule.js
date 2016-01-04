var chatInterval;
function chat(idRequest,idRecord)
{
	this.idRequest 		= idRequest;
	this.idRecord 		= idRecord;
	this.blocked 		= false;
	this.messages 		= [];
	this.latency		= 3;
	this.nameDoctor 	= '';
	this.locationDoctor 	= '';
	this.idPacient		= null;

	this.cleanChat = function (argument) {

	this.idRequest 		= null;
	this.idRecord 		= null;
	this.blocked 		= false;
	this.messages 		= [];
	this.latency		= 3;
	this.nameDoctor 	= '';
	this.locationDoctor 	= '';
	this.idPacient		= null;
		
	}

	this.reboot = function () {
		$("#chatMessages tbody").html("");
		this.latency = 3;
		this.messages = [];
	}
	this.getGaleryPhoto = function() {  

	  navigator.camera.getPicture(uploadChatPhoto,cancelChatPhoto,{
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
    
		  navigator.camera.getPicture(uploadChatPhoto,cancelChatPhoto,{
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
		params.idRequest = chat.idRequest;
		params.session_id = session.sessionId;
		params.idUser	 = session.idUser;
		options.params = params;
		options.headers = {
			Connection: "close"
		}
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(configuration.server + "upload/do_upload_chat"), win, fail, options);
		
	}
	win = function (r) {
		chat.getNewMessages();
		response = r.response;
		response = jQuery.parseJSON(response);
	
		console.log(response);	
	}
	fail = function (response) {
		console.log(response);	
	}

	this.writeMessage = function(message){
		if (!message) {
			var message = $('#textchat').val();
		};
		if (message != '') {
			var sizeMessages = this.messages.length;
			var dataPost = {idRequest:this.idRequest,idRecord:this.idRecord,message:message,sizeChat:sizeMessages};
			ajaxModule.writeChatMessage(dataPost,16);
			$('#textchat').val('');
		}else{
			$('#textchat').focus();
		}
	};
	this.updateChatWindow = function(data,size){

		if (parseInt(size) != this.messages.length) {
			
			printModule.printChatMessages(data);
			for (var i = 0; i < data.length; i++) {
				var chatObject = data[i];
				this.messages.push(chatObject);
			};
			this.updateLatency();
		};
	};
	this.setMessagesInterval = function () {

		if (!notifications.mobile) {
			deleteInterval();
			chatInterval = setInterval(function(){
		      chat.getNewMessages();
		    }, this.latency * 1000);
		
		};
	}
	deleteInterval = function() {
  	  if (chatInterval) {clearInterval(chatInterval);};
	}
	this.getNewMessages = function () {

		var sizeMessages = this.messages.length;
		var dataPost = {
			idRequest:this.idRequest,
			idRecord:this.idRecord,
			sizeChat:sizeMessages
		};
		ajaxModule.getNewMessages(dataPost,19);
		
	}
	this.declineChat = function () {

		var dataPost = {
			idRequest:this.idRequest,
			idRecord:this.idRecord,
		};
		ajaxModule.declineChat(dataPost,21);
		
	}
	this.saveDiagnosticChat = function (argument) {
		  var dataPost = {idRequest: this.idRequest};
		  $("#diagnosticoSpec li").each(function(index,element){
		  	if (!$(element).hasClass('ui-first-child')) {
		  		notifications.toast('Debe seleccionar un diagnostico a la vez');
		  		return false;
		  	};
		  	dataPost['diagnostic_'+index] = $(element).data("id");
		  });
		ajaxModule.saveDiagnosticChat(dataPost,15);
	}


	this.addImage = function(imagen){

	};
	this.endChat = function(){
    if (notifications.customConfirmation('Desea finalizar el chat?')) {
      if (session.rol == 'ESP') {
          $("#diagnosticoSpec").popup({
            dismissible: false
          });
          $("#diagnosticoSpec").popup('open');

      }else{
        configuration.customChangePage("#search");
        chat.blocked = true;
        chat.writeMessage('Chat finalizado');
      }
    };

	};
	this.updateLatency = function(){

		if (this.messages.length > 2) {

			var currentIndex = this.messages.length - 1 ;
			var tiempoA = this.messages[currentIndex].timestamp;
			var tiempoB = this.messages[currentIndex - 1].timestamp;
			var tiempoC = this.messages[currentIndex - 2].timestamp;

			this.latency = calculeTime(tiempoA,tiempoB,tiempoC);

		}
	};

	calculeTime  = function(tiempoA,tiempoB,tiempoC){

		tiempoA = parseInt(tiempoA);
		tiempoB = parseInt(tiempoB);
		tiempoC = parseInt(tiempoC);
		tiempoA = tiempoA - tiempoB;
		tiempoB = tiempoB - tiempoC;

		var timeLapsed = (tiempoA<tiempoB)?tiempoA:tiempoB;

		return (timeLapsed > 1)?timeLapsed:1;


	}
}
chat = new chat();

	function cancelChatPhoto() {
		notifications.toast('Accion cancelada');
	}
	function uploadChatPhoto (imageURI) {
		var options = new FileUploadOptions();
		options.fileKey="userfile";
		if(navigator.userAgent.match(/OS/i)){
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		}
		options.mimeType="image/jpg";
		var params = new Object();
		params.value1 = "test";
		params.value2 = "param";
		params.idRequest = chat.idRequest;
		params.session_id = session.sessionId;
		params.idUser	 = session.idUser;
		options.params = params;
		options.headers = {
			Connection: "close"
		}
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(configuration.server + "upload/do_upload_chat"), winChat, failChat, options);
	};

	winChat = function (r) {
		chat.getNewMessages();
		response = r.response;
		response = jQuery.parseJSON(response);
	
		console.log(response);	
	}
	failChat = function (response) {
		console.log(response);	
	}