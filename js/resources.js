
//var home="http://192.168.0.112/atencion_medica/server";
//var home="http://192.185.108.138/~elecorec/server";
var home="http://appsalud.atlantico.gov.co:9090/server";
//var home="http://localhost/atencion_medica/server";
var server=home+"/index.php/";
$.mobile.defaultPageTransition = "slidefade"; 




document.addEventListener("backbutton", function(e){

  e.preventDefault();

            function onConfirm(button) {
              if (button==1) {

                 navigator.app.exitApp();

              };
          }

          // muestra un cuadro de confirmación mas personalizado
          //

              navigator.notification.confirm(
              'Desea Salir de la aplicacion?',     // mensaje (message)
              onConfirm,      // función 'callback' a llamar con el índice del botón pulsado (confirmCallback)
              'Alerta',            // titulo (title)
                  'Si,No'       // botones (buttonLabels)
              );

    
    
       
    
}, false);





function loadingOpen(legend){

  $.mobile.loading( 'show', {
    text: legend,
    textVisible: true,
    theme: 'a',
    html: ""
  });
}

function loadingClose(){

  $.mobile.loading( 'hide' );

}



function changePage(page){

$.mobile.changePage(page);
}

function customAlert(message)
{

  
  if(navigator.userAgent.match(/OS/i) || navigator.userAgent.match(/Android/i)){
      navigator.notification.beep(1);
      navigator.notification.vibrate(1000);

    function alertDismissed() {
    }

    navigator.notification.alert(message,
      alertDismissed,
      'Atencion Medica Especializada',
      'Cerrar'
      );

  }else{

    alert(message);
  }
}


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function changeTheme(theme,notheme){

    $("[data-role='page']").each(function(index,element){

      $(element).attr("data-theme",theme);
      $(element).removeClass("ui-page-theme-"+notheme).addClass("ui-page-theme-"+theme);
      

    });





}


function notificationAAEM(){


    if(navigator.userAgent.match(/OS/i) || navigator.userAgent.match(/Android/i)){
      
          navigator.notification.beep(1);
          window.plugin.notification.local.add({ message: 'Nueva solicitud' });



  }else{

    alert("Notificacion");
  }



}

function  navigatorstatus(){

  if(navigator.userAgent.match(/OS/i) || navigator.userAgent.match(/Android/i)){

    return true;

  }else{

    return false;
  }




}


