function configurationModule (argument){
		
		// this.server 			= 'http://aaem.mision1a.com/index.php/';
		this.url 				= 'https://aaem.monkeyrates.com/';
		// this.url 			= 'http://appsalud.atlantico.gov.co:9090/aaem/';
		this.server 			= this.url + 'index.php/';
		this.errorCodes 		= [
									{message: 'No error'}, //1
									{message: 'Usuario deslogueado'},
									{message: 'usuario o contraseña Incorrecta'},
									{message: 'Usuario no encontrado en la base de datos'},
									{message: 'Documento de identidad ya registrado.'},
									{message: 'Debe llenar los campos en rojo.'},
									{message: 'No hay especialistas disponibles en esta especialidad.'},
									{message: 'El Especialista no ha respondido, puedes intentar más tarde o elegir otro especialista disponible.'},
									{message: 'No existen solicitudes.'},
									{message: 'No existen historias.'},
									{message: 'No existen el usuario.'},
									{message: 'Error desconocido.'}, //12
								  ];
		this.requestTypes 		= [
									{serverFunction: 'Users/login'},				//0
									{serverFunction: 'Pacients/getPacient'},		//1
									{serverFunction: 'Pacients/registerPacient'},	//2
									{serverFunction: 'Pacients/saveHistory'},		//3
									{serverFunction: 'Pacients/getSpec'},			//4
									{serverFunction: 'Pacients/requestHelp'},		//5
									{serverFunction: 'Pacients/verifyRequest'},		//6
									{serverFunction: 'Pacients/cancelRequest'},		//7
									{serverFunction: 'Pacients/saveToken'},			//8
									{serverFunction: 'Pacients/seeRequest'},		//9
									{serverFunction: 'Pacients/getClinicHistory'},	//10
									{serverFunction: 'Pacients/loadHistory'},		//11
									{serverFunction: 'Users/rememberPass'},		//12
									{serverFunction: 'Pacients/resetPass'},		//13
									{serverFunction: 'Pacients/getCodes'},		//14
									{serverFunction: 'Pacients/saveDiagnostic'},		//15
									{serverFunction: 'Pacients/writeChatMessage'},		//16
									{serverFunction: 'Pacients/initchat'},				//17
									{serverFunction: 'Pacients/getInfoUser'},			//18
									{serverFunction: 'Pacients/getNewMessages'},			//19
									{serverFunction: 'Pacients/validateSession'},			//20
									{serverFunction: 'Pacients/declinechat'},			//21
									{serverFunction: 'test.php'},
								  ];
		//pushAndroid
		this.googleConsoleProject = '835125275088';

		this.getAge = function (dateString) {
		    var today = new Date();
		    var birthDate = new Date(dateString);
		    var age = today.getFullYear() - birthDate.getFullYear();
		    var m = today.getMonth() - birthDate.getMonth();
		    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		        age--;
		    }
		    return age;
		}

		this.loadingOpen = function (legend){$.mobile.loading( 'show', {text: legend,textVisible: true,theme: 'a',html: ""});}

		this.loadingOpenButton = function (legend){
			$.mobile.loading( 'show',
				{
					text:legend,
					textVisible: true,
					theme: 'a',
					html: '<span class="ui-icon-loading"></span><h1>Esperando respuesta</h1><button class="cancelLoading ui-btn ui-mini" >Cancelar</button>'
				});
		}

		this.loadingClose = function (){$.mobile.loading( 'hide' );};

		this.customChangePage = function (page) {

			$.mobile.changePage(page);
		}




}
var configuration = new configurationModule();