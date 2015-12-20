function session (argument) {

	this.idUser		= null;
	this.username 	= null;
	this.name 		= null;
	this.rol 		= null;
	this.specialty 		= null;
	this.ubication 		= null;
	this.number 		= null;
	this.loguedIn 	= false;
	this.sessionId 	= false;
	this.currentPage = null;
	this.token = null;
	this.customDevice = null;
	this.page = null;
	this.active = null;

	this.loguin = function (username,password){

		token = this.token;
		customDevice = this.customDevice;
		
		postServer = ajaxModule.ajaxSession(0,{username:username,pass:password},session.ajaxResponse);

	}

	this.createSession = function (idUser,name,username,sesId,loguedIn) {

		this.idUser = idUser;
		this.name = name;
		this.username = username;
		this.sesId = sesId;
		this.loguedIn = floguedIn ;
		
	}
	this.restoreSession = function (argument) {
		var mySession =  localStorage.getItem('session');
		var mySession = JSON.parse(mySession);
		for(attrib in mySession){
			session[attrib] = mySession[attrib];
		}
		$("#activeUser").val(session.active).change();
		var page 	 = (session.rol == 'ESP')?'#myRequest':'#search';
		session.page = page;
		var myChat =  localStorage.getItem('chat');
		var myChat = JSON.parse(myChat);
		if(localStorage.getItem('chat')){
			for(attrib in myChat){
				chat[attrib] = myChat[attrib];
			}
			if (!chat.blocked) {
				tmpPacient = new pacientModule(chat.idPacient);
				session.page = '#chat';
				chat.getNewMessages();

			};
		}

		ajaxModule.validateSession({},20);
	}
	this.saveSession = function (argument) {
		session.deleteSession();
		localStorage.setItem('session', JSON.stringify({idUser:this.idUser,
							username:this.username,
							name:this.name,
							rol:this.rol,
							specialty:this.specialty,
							ubication:this.ubication,
							number:this.number,
							loguedIn:this.loguedIn,
							active:this.active,
							sessionId:this.sessionId,
							currentPage:this.currentPage,
							token:this.token,
							customDevice:this.customDevice,
							page:this.page
							}));
		if ($.mobile.activePage.attr('id') == 'chat') {

			localStorage.setItem('chat',JSON.stringify({
				idRequest		: chat.idRequest,
				idRecord		: chat.idRecord,
				blocked			: chat.blocked,
				latency			: chat.latency,
				nameDoctor		: chat.nameDoctor,
				locationDoctor	: chat.locationDoctor,
				idPacient		: chat.idPacient
				}));
		};
	};

	this.deleteSession = function (argument) {
		localStorage.removeItem('session');
	}
	this.saveToken = function (token,customDevice) {
		this.token = token ;
		this.customDevice = customDevice ;		
		postServer = ajaxModule.ajaxSaveToken({token:token,device:customDevice},8);
	}

	this.generateSession = function(){
		dataSession = null;

		var idUser		= null;
		var name 		= null;
		var username 	= null;
		var sesId 		= null;
		var loguedIn 	= false;
		var state 		= null; 
	}

	this.ajaxResponse = function (type,data) {
		
		if (parseInt(data.error) == 0 && type == 0) {

			session.idUser 		= data.id;
			session.username 	= data.username;
			session.name 		= data.name;
			session.rol 		= data.rol;
			session.specialty 	= data.specialty;
			session.ubication 	= data.location;
			session.number 		= data.number;
			session.sessionId 	= data.sessionId;
			session.loguedIn	= true;
			session.active		= data.active;

			$("#activeUser").val(session.active).change();

			document.getElementById('loginForm').reset();

			if ( parseInt(data.reset_pass) == 1) {
				$("#popUpReset").popup('open');

			}else{
				var page = (session.rol == 'ESP')?'#myRequest':'#search';
				configuration.customChangePage(page);
			    enablePush();				
				session.saveSession();
			}

		}else{

			notifications.toast(configuration.errorCodes[data.error].message);

		}
	}
}
var session = new session();