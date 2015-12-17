$( document ).on( "pagecreate", "#login", function() {
  $("#loginForm").validationEngine('attach',
    {ajaxFormValidationMethod:"post",promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status) {
        var username = $(form).find('input[name="username"]').val();
        var password = $(form).find('input[name="pass"]').val();
        session.loguin(username,password);

      };
    }
  });
  $("#rememberForm").validationEngine('attach',
    {ajaxFormValidationMethod:"post",promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status) {
        var username = $(form).find('input[name="rememberUser"]').val();
             var dataPost = {username:username};
        ajaxModule.ajaxRememberPassword(dataPost,12);


      };
    }
  });
  $("#resetForm").validationEngine('attach',
		{ajaxFormValidationMethod:"post",promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
			if (status) {
				var newPass = $(form).find('input[name="passRemember"]').val();
        var dataPost = {pass:newPass};
        ajaxModule.ajaxResetPassword(dataPost,13);


      };
    }
  }); 
});

$( document ).on( "pagecreate", "#search", function() {
  $("#searchForm").validationEngine('attach',
    {promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status) {
        
        var id=$(form).find("input").val();
        ajaxModule.ajaxSearchPAcient(id,1);

      };
    }
  });
});
// Handle the pause event
    //
    function onPause() {
      console.log("pause");
      session.saveSession();
    }




$( document ).on( "pagecreate", "#history", function() {
  var activeRecord = new recordsModule();
});

$(document).on("click", ".historyPacient", function(event) {
  event.preventDefault();
     var pacientListed = event.target;
     var pacientId = $(pacientListed).parents('li').attr("idpacient");
     tmpPacient = new pacientModule(pacientId);
    configuration.customChangePage('#history');
 });

$(document).on("click", ".saveHistory", function(event) {
  event.preventDefault();
    activeRecord.saveRecord();
 });
$(document).on("click", ".specialityList", function(event) {
     event.preventDefault();
     var specListed = event.target;
     var spec=$(specListed).attr("espec");
     var dataPost = {spec:spec};
      ajaxModule.ajaxSearchSpec(dataPost,4);

 });
$(document).on("click", ".selectThisSpec", function(event) {
     var specListed = event.target;
     activeRecord.spec = $(specListed).parents('li').attr("iddoctor");
 });
$(document).on("click", ".cancelLoading", function(event) {
     activeRecord.cancelRequest();
     configuration.loadingClose();
 });

$(document).on("click", ".requestHelp", function(event) {
        var dataPost = {
          idspec:activeRecord.spec,
          idpacient:tmpPacient.id,
          idreport:activeRecord.currentRecord
        };
        ajaxModule.requestHelp(dataPost,5);
     
 });

$(document).on("pageshow", "#registerPacient", function(event) {
  if (tmpPacient)
    $("#registerid").val(tmpPacient.id).attr('readOnly','readOnly');
});

var requestInterval;
$(document).on("pageshow", "#myRequest", function(event) {

  ajaxModule.ajaxSearchRequest({},9);
  if (!notifications.mobile) {

    if (requestInterval) {
      clearInterval(requestInterval);
    };
    requestInterval = setInterval(function(){
      ajaxModule.ajaxSearchRequest({},9);
    }, 5000);
       
  };
});

$( document ).on( "pagecreate", "#registerPacient", function() {
  $("#registerForm").validationEngine('attach',
    {promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status && notifications.customConfirmation('Registrar Paciente?')) {
        dataPost = {};
        $(form).find("input,select").each(function(index, input) {
          dataPost[input.name.replace("register","")] = input.value;
        });
        ajaxModule.ajaxSavePacient(dataPost,2);

      };
    }
  });
});
$( document ).on( "pagebeforecreate", function(event) {


    var page = event.target;
      $.get("panels/right_panel.html", function(data){
      $(page).find('.ui-panel-inner').append(data);
  });
});

        
document.addEventListener("backbutton", function(e)
{
    event.preventDefault();
  if (notifications.customConfirmation('Desea Salir de la aplicación?')) {
    navigator.app.exitApp();
  };

}, false);

document.addEventListener("deviceready", onDevicePlatform, false);

function onDevicePlatform() {

  if (notifications.mobile) {
    session.customDevice = device.platform;
  };
}

$( document ).on( "pageshow", "#history,#detailsRequest,#chat", function() {

    ajaxModule.ajaxGetInfoPAcient(tmpPacient.id,1);

  $('.clinicHistory').on('collapsibleexpand', function (){

    data = {idpacient:tmpPacient.id};
    ajaxModule.ajaxGetStories(data,10);
  });
});

$( document ).on( "pageshow", "#chat", function() {

    data = {idRequest:chat.idRequest,rol:session.rol};
    ajaxModule.ajaxGetInfoUser(data,18);
    chat.setMessagesInterval();
    if (session.rol == 'ESP') {
      $("#backButtonChat").attr("href",'#myRequest');
    }else{
      $("#backButtonChat").attr("href",'#search');
    }

});


$(document).on('click','.carryHistory',function(event){

    var history = event.target;
    var idHistory=parseInt($(history).attr("idhistory"));
    var dataPost={
        idhistory:idHistory
    };
    ajaxModule.ajaxLoadHistory(dataPost,11);
});

$(document).on('click','#sendChatMessage',function(event){

  event.preventDefault();
  chat.writeMessage();
});

function chatEnterScript(e) {
    if (e.keyCode == 13) {
        chat.writeMessage();
        return false;
    }
}

$(document).on('click','.seeDetailRequest',function(event){

  event.preventDefault();
  var element = event.target;
  element = $(element).parents('li');
  chat.idRequest = $(element).data('request');
  tmpPacient = new pacientModule($(element).data('pacient'));
  configuration.customChangePage("#detailsRequest");  

});
$(document).on('click','#initChat',function(event){

  var dataPost = {
    idrequest: chat.idRequest
  };
  
    ajaxModule.ajaxInitChat(dataPost,17);

});
$(document).on('click','.endChat',function(event){

  chat.endChat();

});
$(document).on('click','#declineChat',function(event){

  chat.declineChat();

});




function    beginchat(){


    configuration.customChangePage("#chat");

}



function endchatspec(element){
  var dataPost={
    idrequest:$(element).attr("idrequest"),
    idhelp:$(element).attr("idrequest"),
    idreport:$(element).attr("idreport"),
  };
        dataPost.session_id = session.sessionId;
        dataPost.idUser  = session.idUser;

            $.post(configuration.server+"Pacients/declinechat", dataPost, function(response) {

                response = jQuery.parseJSON(response);
                cancelRequest(dataPost);

                configuration.customChangePage("#myRequest");



            });
}


$(document).on('change','#activeUser',function(){

  var dataPost={
    active:$("#activeUser").val(),
  };
        dataPost.session_id = session.sessionId;
        dataPost.idUser  = session.idUser;

            $.post(configuration.server+"Pacients/updateActiveStatus", dataPost, function(response) {

                response = jQuery.parseJSON(response);
                session.active = $("#activeUser").val();
                session.saveSession();
            });
  
});

$( document ).on( "pageinit", "#chat", function() {
    $( "#principalDiagnostic" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
        if ( value && value.length > 2 ) {
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
          data = {
                    query: $input.val(),
                    idUser: session.idUser,
                    session_id: session.sessionId
                }
          $.post( configuration.server + configuration.requestTypes[14].serverFunction,
            data,
            function( response ) {
                $.each( response, function ( i, val ) {
                    html += "<li class='selecDiacnostic' data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            },
            "json");
        }
    });
    $( "#secondaryDiagnostic" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
        if ( value && value.length > 2 ) {
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
          data = {
                    query: $input.val(),
                    idUser: session.idUser,
                    session_id: session.sessionId
                }
          $.post( configuration.server + configuration.requestTypes[14].serverFunction,
            data,
            function( response ) {
                $.each( response, function ( i, val ) {
                    html += "<li class='selecDiacnostic' data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            },
            "json");
        }
    });
    $( "#addtitionalDiagnostic" ).on( "filterablebeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
        if ( value && value.length > 2 ) {
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
          data = {
                    query: $input.val(),
                    idUser: session.idUser,
                    session_id: session.sessionId
                }
          $.post( configuration.server + configuration.requestTypes[14].serverFunction,
            data,
            function( response ) {
                $.each( response, function ( i, val ) {
                    html += "<li class='selecDiacnostic' data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
            },
            "json");
        }
    });
});

$(document).on("click", "#closeSession", function(event) {
    session.deleteSession();
 });

$(document).on("click", ".selecDiacnostic", function(event) {
    var idLi = $(this).data("id");
    $(this).parent().find('li').each(function(index,element){
      if ($(element).data("id") != idLi) {
        $(element).remove();
      }else{
        $(element).addClass("ui-first-child");
      }
    });
 });

$(document).on("click", "#openCamera", function(event) {
  activeRecord.getCameraPhoto();
  
 });
$(document).on("click", "#openGalery", function(event) {
  activeRecord.getGaleryPhoto();
 });

$(document).on("click", "#openChatCamera", function(event) {
  chat.getCameraPhoto();
  
 });
$(document).on("click", "#openChatGalery", function(event) {
  chat.getGaleryPhoto();
 });
$(document).on("click", "#saveDiagnostic", function(event) {
  chat.saveDiagnosticChat();
 });


function saveDiagnostic () {
  var data = {idUser: session.idUser,
              session_id: session.sessionId};
    var record = $("#saveMessage").attr("idreport");
    var request = $("#saveMessage").attr("idrequest");
    data['record'] = record;
    data['request'] = request;
  $("#diagnosticoSpec li").each(function(index,element){
    if (!$(element).hasClass('ui-first-child')) {
      notifications.toast('Debe seleccionar un diagnostico a la vez');
      return false;
    };

    data['diagnostic_'+index] = $(element).data("id");



  });
  $.post( configuration.server + configuration.requestTypes[15].serverFunction,
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

function seeDiagnostic () {
  var record = activeRecord.idHistory;
  var data = {idUser: session.idUser,
              session_id: session.sessionId,
              idhistory:record};
    $.post( configuration.server + configuration.requestTypes[11].serverFunction,
    data,
    function( response ) {
        var error = parseInt(response.error);
        if (error>0) {
          notifications.toast(configuration.errorCodes[error].message);
          if (error == 1) {
            configuration.customChangePage('#login');
          }
        }else{
           var diagnostic = response.data.customDiagnostic;
           for (var i =  0; i < diagnostic.length; i++) {
            var val = diagnostic[i];
             if (val.diagnostic == '0') {
              $("#principalDiagnosticGen").html("<li data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>");
             };
             if (val.diagnostic == '1') {
              $("#secondaryDiagnosticGen").html("<li data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>");
             };
             if (val.diagnostic == '2') {
              $("#addtitionalDiagnosticGen").html("<li data-id='"+val.id+"''>" + val.code + ": "+ val.description+"</li>");
             };
           };
           $("#diagnosticoGen").popup("open");

        }
    },
    "json");
}




$( document ).on( "pageshow", function(event) {
  session.page = event.target.id;
});

$( window ).load(function() {

  document.addEventListener("pause", onPause, false);
  session.restoreSession();
});

$(document).on("pagecreate", "#history", function () {
    $("#popupPreview").popup({
        beforeposition: function () {
            $(this).css({
                width: window.innerWidth - 40
            });
        },
        x: 0,
        y: 0
    });
});
$(document).on("pagecreate", "#historyList", function () {
    $("#popupPreviewList").popup({
        beforeposition: function () {
            $(this).css({
                width: window.innerWidth - 40
            });
        },
        x: 0,
        y: 0
    });
});
$(document).on("pagecreate", "#chat", function () {
    $("#popupPreviewChat").popup({
        beforeposition: function () {
            $(this).css({
                width: window.innerWidth - 40
            });
        },
        x: 0,
        y: 0
    });
});
$(document).on("click", ".toPreview", function(event) {
    event.preventDefault();
    var imgSource = event.target;
    var source = $(imgSource).attr('src');
    var currentPopUp = $(imgSource).parents('[data-role="page"]').find('.popupPreview');

    $(currentPopUp).find("img").remove();
    $(currentPopUp).append('<img style="margin-top: -20px;" src="'+ source +'" alt="Imagen diagnostica">');
    $(currentPopUp).popup("open");


  
 });