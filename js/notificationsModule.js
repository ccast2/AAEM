function notificationsModule (){
	
	this.mobile = (navigator.userAgent.match(/OS/i) || navigator.userAgent.match(/Android/i))?true:false;
	this.typeDevice = null;
	this.alertTitle = 'Atención Medica Especializada';
	this.closeButton = 'Cerrar'; 
	this.negativeButton = 'No';
	this.positiveButton = 'Si';

	this.customAlert = function(message) {

		if (this.mobile) {navigator.notification.alert(message,alertDismissed,this.alertTitle,this.closeButton);}else{ alert(message);}

		function alertDismissed () {};
	}

	this.customConfirmation = function(message){

		if (false) {
			return navigator.notification.confirm(message,onConfirm,this.alertTitle,[this.positiveButton ,this.negativeButton]);
		}else{
			return confirm(message);
		}

		function onConfirm(button) {

			return (button==1)?true:false;
		}
	}
	this.toast = function (message) {
		if (this.mobile) {window.plugins.toast.show(message, 'long', 'center');}else{ alert(message);}
	}


	this.identifyDevice = function () {

		if (navigator.userAgent.match(/OS/i)) {
			this.typeDevice = 'IOS';
		}else if(navigator.userAgent.match(/Android/i)){
			this.typeDevice = 'Android';
		}else{
			this.typeDevice = 'Desktop';
		}
	}

	this.identifyDevice();
}
var notifications = new notificationsModule();