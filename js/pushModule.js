var pushNotification;


function enablePush() {

	try
	{
		pushNotification = window.plugins.pushNotification;

		if (session.customDevice == 'android' || session.customDevice == 'Android') {
			pushNotification.register(successHandler, errorHandler, {"senderID":"452986203062","ecb":"onNotification"});
		} else {
			pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
		}
	}
	catch(err) 
	{ 
		txt="Error desconocido.\n\n"; 
		txt+="Descripción: " + err.message + "\n\n"; 
		console.log(txt); 
	} 
}

function onNotificationAPN(e) {

    if (e.type == 'request') {
        ajaxModule.ajaxSearchRequest({},9);
    };
    if (e.type == 'diagnostic') {
        
        seeDiagnostic();
    };
    if (e.type == 'chat') {
        chat.getNewMessages();
    };

    if (e.foreground == '1') {
        navigator.notification.beep(1);
    };

    if (e.alert) {
        // playing a sound also requires the org.apache.cordova.media plugin
         navigator.notification.alert(e.alert);
    }        
    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}
            
            // handle GCM notifications for Android
function onNotification(e) {

    console.log(e);
    
    switch( e.event )
    {
        case 'registered':
		if ( e.regid.length > 0 )
		{
			console.log("regID = " + e.regid);
            session.saveToken(e.regid,session.customDevice);
        }
        break;
        
        case 'message':
            if (e.payload.type == 'request') {
                ajaxModule.ajaxSearchRequest({},9);
            };

                if (e.payload.type == 'diagnostic') {
                    
                    seeDiagnostic();
                };
            if (e.payload.type == 'chat') {
                chat.getNewMessages();
            };


            if (e.foreground)
            {
                // $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                  
                console.log(e);       
            }
            else
            {   // otherwise we were launched because the user touched a notification in the notification tray.
                navigator.notification.beep(1);
                navigator.notification.vibrate(1000);
                if (e.coldstart)
                    console.log(e);       
                else
                    console.log(e);       
            }
                
            //amazon-fireos only
        break;
        
        case 'error':
            console.log(e.msg);
        break;
        
        default:
            txt="Error desconocido.\n\n"; 
            console.log(txt);
        break;
    }
}
            
function tokenHandler (result) {
            console.log("Guardando");
            session.saveToken(result,session.customDevice);
}

function successHandler (result) {
    console.log(result);
}

function errorHandler (error) {
    console.log(error);
}

// document.addEventListener('deviceready', onDeviceReady, true);
