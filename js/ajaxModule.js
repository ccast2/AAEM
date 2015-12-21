function ajaxModule () {

	var data 	= {};
	var idUser 	= session.idUser;
	var sesId 	= session.sesId;
	var server 	= configuration.server;

	this.ajaxSession = function (type,data,successCallback) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				if (session){
					successCallback(type,response);
				}
			},
			"json");
	}
	this.ajaxSearchPAcient = function (idPacient,type) {

		data = {idpacient:idPacient};
		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}else if (error == 3){

						tmpPacient = new pacientModule(idPacient);
						printModule.printRegisterButton(error);
					}
				}else{
					printModule.printSearchPacient(response.pacients);
				}
			},
			"json");		
	}
	this.ajaxGetInfoPAcient = function (idPacient,type) {

		data = {idpacient:idPacient};
		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}else if (error == 3){

						tmpPacient = new pacientModule(idPacient);
						printModule.printRegisterButton(error);
					}
				}else{
					printModule.printInfoPacient(response.pacients);
				}
			},
			"json");		
	}
	this.ajaxSavePacient = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					configuration.customChangePage('#history');
				}
			},
			"json");		
	}
	this.ajaxRememberPassword = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);

				}else{
					$("#popUpRemember").popup('close');
					notifications.toast('Se ha enviado un correo con la contraseña a la direccion del usuario');
					document.getElementById('rememberForm').reset();

				}
			},
			"json");		
	}
	this.ajaxResetPassword = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					var session = new session();

				}else{
					notifications.toast('Contraseña actualizada correctamente');
					$("#popUpReset").popup('close');

				}
			},
			"json");		
	}
	this.ajaxSaveToken = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
			},
			"json");		
	}
	this.ajaxSearchRequest = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					$("#requestMedics").html('<h3></h3><ul data-role="listview" data-inset="true">Sin solicitudes</ul>');
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					printModule.printRequest(response.data);
				}
			},
			"json");
	}
	this.saveHistory = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					configuration.customChangePage('#searchspec');
					activeRecord.currentRecord = response.recordId;
				}
			},
			"json");		
	}
	this.validateSession = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					
					configuration.customChangePage(session.page);
					enablePush();
				}
			},
			"json");		
	}
	this.ajaxInitChat = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					$('#chatMessages tbody').html('');
					chat.messages = [];
					configuration.customChangePage("#chat");
				}
			},
			"json");		
	}
	this.ajaxGetInfoUser = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					if (error == 1) {
						notifications.toast(configuration.errorCodes[error].message);
						configuration.customChangePage('#login');
					}
				}else{

					var user = response.users[0];
					$('.nameDoctor').html(user.name + ' -- ' + user.location);
					chat.nameDoctor = user.name;
					chat.locationDoctor = user.location;


				}
			},
			"json");		
	}
	this.ajaxSearchSpec = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					// configuration.customChangePage('#searchspec');
					printModule.printSpecs(response.specs,data.spec);

				}
			},
			"json");		
	}
	this.requestHelp = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					// configuration.customChangePage('#searchspec');
					// printModule.printSpecs(response.specs,data.spec);
					activeRecord.handleRequest(response.idRequest);
						

				}
			},
			"json");		
	}
	this.writeChatMessage = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					chat.updateChatWindow(response.data,response.size);
				}
			},
			"json");		
	}
	this.getNewMessages = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					chat.updateChatWindow(response.data,response.size);
				}
			},
			"json");		
	}
	this.saveDiagnosticChat = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					configuration.customChangePage("#myRequest");
				}
			},
			"json");		
	}
	this.ajaxSeeRequest = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
	                if ( response.status == "accepted" ) {
	                	
	                	activeRecord.clearIntervals();
	                	chat.idRequest = activeRecord.request;
	                	chat.reboot();
	                    configuration.customChangePage("#chat");

	                }else if( response.status == "declined" ) {

	                    activeRecord.clearIntervals();
	                    notifications.toast('El medico rechazo la interconsulta');
	                }
				}
			},
			"json");		
	}
	this.ajaxGetStories = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{

					printModule.printStories(response.data);


				}
			},
			"json");		
	}
	this.declineChat = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{

					configuration.customChangePage("#myRequest");


				}
			},
			"json");		
	}
	this.ajaxLoadHistory = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					printModule.updateHistory(response.data);
				}
			},
			"json");		
	}
	this.ajaxCancelRequest = function (data,type) {

		data = updateData(data);

		$.post( server + configuration.requestTypes[type].serverFunction,
			data,
			function( response ) {
				var error = parseInt(response.error);
				if (error>0) {
					notifications.toast(configuration.errorCodes[error].message);
					if (error == 1) {
						configuration.customChangePage('#login');
					}
				}else{
					// configuration.customChangePage('#searchspec');


				}
			},
			"json");		
	}

	updateData = function (data) {
		data.session_id = session.sessionId;
		data.idUser	 = session.idUser;
		return data;
	}
}
var ajaxModule = new ajaxModule();
