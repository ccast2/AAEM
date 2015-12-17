var pacient;
var clinicHistory;
var lastReport;
var controlTime;

//login













function login(){

loadingOpen("Cargando");
	var dataPost={};

    $("#loginForm input").each(function(index,element){

        dataPost[element.name]=$(element).val();
    });
    dataPost.pass=CryptoJS.SHA256(dataPost.pass).toString(CryptoJS.enc.Base64);
    $.post(server+"users/login", dataPost, function(response) {
        response = jQuery.parseJSON(response);

        if (!response.error) {

        	localStorage.setItem("id",response.id);
        	localStorage.setItem("name",response.name);
        	localStorage.setItem("username",response.username);
        	localStorage.setItem("session_id",response.sessionId);
        	localStorage.setItem("rol",response.rol);

            if (response.rol=="GEN") {
                //changeTheme("a","b")
                changePage("#search");


            }else{
                //changeTheme("b","a");
                changePage("#myRequest");
                clearInterval(controlTime);
                saveLastLoguin();
                controlTime = setInterval(function(){saveLastLoguin()}, 30000);

            }
            loadingClose();

            
            $("#loginForm input").each(function(index,element){

                $(element).val("");

            });
            
            

            







        }else{

         customAlert(response.message);
         loadingClose();

        }




    });

}




function    saveLastLoguin(){


        var dataPost={

            session_id:localStorage.getItem("session_id"),
            username:localStorage.getItem('username')

            };

            $.post(server+"pacients/saveStatus", dataPost, function(response) {
    
                    response = jQuery.parseJSON(response);
                    

            });




}


//search pacient \select pacient



$( document ).on( "pageinit", "#search", function() {
  $("#searchForm").validationEngine('attach',
    {promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status) {

        
        var id=$(form).find("input").val();
        searchId(id);

      };
    }
  });
});

$( document ).on( "pageshow", function(event,ui) {
    $( "[data-role=collapsible]" ).collapsible({ collapsed: true});
    $( "[data-role=collapsible]" ).collapsible({ iconpos: "right" });
    $(".wrong").removeClass("wrong");
            $("#newConsult textarea").each(function(index,element){$(element).val("")});
        $("#newConsult input").each(function(index,element){$(element).val("")});
        

          if ($(event.target).attr("id")=="historypopupSpecchat"||$(event.target).attr("id")=="chatspec") 
              {

              }else if($(event.target).attr("id")=="login"){

                  var windowHeight=$(window).height();
                  var containerHeight=$(event.target).find(".container").height();
                  var footerHeight=$(event.target).find('div[data-role="footer"]').height();
                  var headerHeight=$(event.target).find('div[data-role="header"]').height();
                  var padding=parseInt($("#login [data-role='content']").css("padding-top"));
                  $(event.target).find("[data-role='content']").height(windowHeight-footerHeight-headerHeight-padding-padding+'px');



              }else{

                $("#chatContainer table tbody").html("");

              }


});



function searchId(id){

    loadingOpen("Cargando");

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:id,

    };

    $.post(server+"pacients/getPacient", dataPost, function(response) {
    
        response = jQuery.parseJSON(response);
        

        if (!response.error) {

            response.birthdate=getAge(response.birthdate);

            $("#pacients").html('<ul data-role="listview" data-inset="true">'+
                '<li data-role="list-divider">'+
                //'<span class="ui-li-count">'+response.id+'</span>
                '</li>'+
                '<li><a idpacient="'+response.id+'" href="#history"><h2>'+
                response.name+
                '</h2>'+
                '<p><strong>'+
                response.typeid+': '+response.id+
                '</strong></p>'+
                '<p>'+
                'EPS: '+response.eps+
                '</p>'+
                '<p class="ui-li-aside"><strong>'+
                response.birthdate+' Años'+
                '</strong></p>'+
                '</a></li>');
            $("#pacients ul").listview();
            pacient=response;
        }else{

            $("#pacients").html('<h3>'+
                response.message+
                '</h3>'+

                '<a href="#registerPacient" class="formLeft ui-btn ui-mini " id="registerButton" onclick="carryDataRegister('+id+')">Registrar</a>');
        }
        loadingClose();
    });
}

function carryDataRegister(id){

    $("#registerid").val(id);
}



$( document ).on( "pageinit", "#registerPacient", function() {
  $("#registerForm").validationEngine('attach',
    {promptPosition : "topRight:-100", scroll: false, onValidationComplete: function(form, status){
      if (status) {
        
        registerServer(form);

      };
    }
  });
});


function registerServer(form)

{  

    if (navigatorstatus()) {


        navigator.notification.confirm('Registrar Paciente?',

          onConfirm,
          'Confirmar Accion',
          'Aceptar,Cancelar'
          );

        function onConfirm(button) {
            if (button==1) {

                registerServerConfirmed(form);

            }
        }
    }else{

        if(confirm('Registrar Paciente?'))
        {
            registerServerConfirmed(form);

        }else{
            return(false);
        }
    }
}



function registerServerConfirmed(form){

    loadingOpen("Cargando");


    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
    };



    $(form).find("input,select").each(function(index, input) {

       dataPost[input.name.replace("register","")] = input.value;
     });

    $.post(server+"pacients/registerPacient", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        if (!response.error) {
        response.birthdate=getAge(response.birthdate);
        pacient=response;
        $("#registerForm input").each(function(index,element){$(element).val("")});
        changePage("#history");
    }else{
        customAlert(response.message);

    }
    loadingClose();

    }); 
}

$( document ).on( "pageinit", "#history", function() {

  $("#consultForm").validationEngine('attach',
    {ajaxFormValidationMethod:"post",promptPosition :"topRight:-100", scroll: false, onValidationComplete: function(form, status){
        if (status) {
            submitStatus(form);
        };
        }    
    });
});


$( document ).on( "pageshow", "#history", function() {
    if(!pacient){
        changePage("#search");
        return false;
    }

 $("#pacients").html("");
 $("#search [name='search_pacient']").val("")
  $("#infoPacient").html('<ul data-role="listview" data-inset="true">'+
    '<li data-role="list-divider">'+
    //'<span class="ui-li-count">'+response.id+'</span>
    '</li>'+
    '<li><div idpacient="'+pacient.id+'" href="#history"><h2>'+
    pacient.name+
    '</h2>'+
    '<p><strong>'+
    pacient.typeid+': '+pacient.id+
    '</strong></p>'+
    '<p>'+
    'EPS: '+pacient.eps+
    '</p>'+
    '<p class="ui-li-aside"><strong>'+
    pacient.birthdate+' Años'+
    '</strong></p>'+
    '</div></li>');
  $("#infoPacient ul").listview();



  $('#clinicHistory').on('collapsibleexpand', function (){

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:pacient.id
    };
    loadingOpen("Cargando");

    $.post(server+"pacients/getClinicHistory", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();
        if (!response.error) {
            $("#contentHistory").html('<ul data-role="listview" id="contentHistory"></ul>');

        for (var i = response.length - 1; i >= 0; i--) {


            $("#contentHistory ul").append('<li><a href="#historypopup"  style="font-size:0.9em"'+
                ' onclick="carryHistory(this)" idhistory="'+response[i].id+'" idresponse="'+i+'">'+response[i].date+'</a></li>');
            
        };
        $("#contentHistory ul").listview();
        clinicHistory=response;

        }else{
            $("#contentHistory").html(response.message);
        }
        

    });

    
    });

});

function  carryHistory(element){



    var idHistory=parseInt($(element).attr("idhistory"));

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idhistory:idHistory
    };

    loadingOpen("Cargando");

    $.post(server+"pacients/loadHistory", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();
        if (!response.error) {


                $('#historypopup ul li:nth-child(2)').html(response.subject);
                $('#historypopup ul li:nth-child(4)').html(response.actualdisease);
                $('#historypopup ul li:nth-child(6)').html(response.personalrecord);                
                $('#historypopup ul li:nth-child(9)').html(response.fum);
                $('#historypopup ul li:nth-child(11)').html(response.g);
                $('#historypopup ul li:nth-child(13)').html(response.p);                                
                $('#historypopup ul li:nth-child(15)').html(response.a);
                $('#historypopup ul li:nth-child(17)').html(response.c);                                
                $('#historypopup ul li:nth-child(19)').html(response.v);                                
                $('#historypopup ul li:nth-child(21)').html(response.gestage);  
                $('#historypopup ul li:nth-child(24)').html(response.ta);
                $('#historypopup ul li:nth-child(26)').html(response.size);
                $('#historypopup ul li:nth-child(28)').html(response.fc);
                $('#historypopup ul li:nth-child(30)').html(response.fr);
                $('#historypopup ul li:nth-child(32)').html(response.weight);   
                $('#historypopup ul li:nth-child(34)').html(response.imc);
                $('#historypopup ul li:nth-child(36)').html(response.awareness);
                $('#historypopup ul li:nth-child(38)').html(response.head);
                $('#historypopup ul li:nth-child(40)').html(response.cardio);
                $('#historypopup ul li:nth-child(42)').html(response.abdomen);                              
                $('#historypopup ul li:nth-child(44)').html(response.height);                               
                $('#historypopup ul li:nth-child(46)').html(response.frecuency);                                
                $('#historypopup ul li:nth-child(48)').html(response.activity);
                $('#historypopup ul li:nth-child(50)').html(response.tone);                             
                $('#historypopup ul li:nth-child(52)').html(response.presentation);                             
                $('#historypopup ul li:nth-child(54)').html(response.genit);
                $('#historypopup ul li:nth-child(56)').html(response.dilatation);                               
                $('#historypopup ul li:nth-child(58)').html(response.effacement);                               
                $('#historypopup ul li:nth-child(60)').html(response.estation);
                $('#historypopup ul li:nth-child(62)').html(response.membranes);
                $('#historypopup ul li:nth-child(64)').html(response.liquid);
                $('#historypopup ul li:nth-child(66)').html(response.blood);
                $('#historypopup ul li:nth-child(68)').html(response.arms);
                $('#historypopup ul li:nth-child(70)').html(response.nervous);
                $('#historypopup ul li:nth-child(72)').html(response.diagnostic);
                $('#historypopup ul li:nth-child(74)').html(response.plan);
                $('#historypopup ul li:nth-child(76)').html(response.paraclinics);
                $('#historypopup ul li:nth-child(80)').html(response.intersubject);
                $('#historypopup ul li:nth-child(82)').html(response.response);
                $('#historypopup ul li:nth-child(84)').html(response.evolution);

                 for (var i = response.images.length - 1; i >= 0; i--) {
                    

                    $('#historypopup ul li:nth-child(78)').append('<a href="#popUpPhoto" data-rel="popup" data-position-to="window"><img onclick="carryPopPup(this)" class="imageHistory" src="'+home+"/uploads/"+response.images[i].name+'" alt=""></a>');
                    
                };



        }else{
            $("#contentHistory").html(response.message);
        }
        

    });


}

function carryPopPup(element){

    var idPhoto=$(element).parent().attr("href");
    var imgPop=$(element).attr("src");

    $(idPhoto).find("img").attr("src",imgPop);



}

function submitStatus()

{  

    if (navigatorstatus()) {


    



        navigator.notification.confirm('Guardar Historia?',

          onConfirm,
          'Confirmar Accion',
          'Aceptar,Cancelar'
          );

        function onConfirm(button) {
            if (button==1) {

                submitStatusConfirmed();

            }
        }
    }else{

        if(confirm('Guardar Historia?'))
        {
            submitStatusConfirmed();

        }else{
            return(false);
        }
    }
}


function submitStatusConfirmed(){


    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:pacient.id
    };
    loadingOpen("Cargando");
    var alerta="Debes llenar los campos en rojo";
    var error=0;
    $(".wrong").removeClass("wrong");

    $(".AAEM_required").each(function(index,element){


        if ($(element).val()=="") {
            error=1;

            $(element).addClass("wrong");

            $(element).parent().parent().find("h5").addClass("wrong");


        };


    });

    if ($(".fisics .AAEM_required").hasClass("wrong")) {


        var fisics=$(".fisics h5")[0];
        $(fisics).addClass("wrong");


    };

    if (error) {
        loadingClose();
        customAlert(alerta);
        return false;
    }else{
        $(".wrong").removeClass("wrong");



    };


    $("#consultForm").find("textarea").each(function(index, textarea) {

        dataPost[textarea.name.replace("consult","")] = textarea.value;

    });

    $("#consultForm").find("input").each(function(index, input) {

        dataPost[input.name.replace("consult","")] = input.value;

    });


    if (error) {loadingClose();customAlert(alerta);return false;};


    


    $.post(server+"pacients/submitStatus", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();
        if (!response.error) {
        
        lastReport=response;
        $("#newConsult").collapsible({ collapsed: true });
        customAlert("Consulta enviada correctamente");
        $("#newConsult textarea").each(function(index,element){$(element).val(" ")});
        $("#newConsult input").each(function(index,element){$(element).val(" ")})

        changePage("#searchspec");
    }else{

        customAlert(response.message);

    }



    });


}


function selectspecialty(element){

    var spec=$(element).attr("espec");

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        spec:spec
    };
    loadingOpen("Cargando");

    $("#specs").html('<h3>'+spec+'</h3><ul data-role="listview" data-inset="true"></ul>');

    $.post(server+"pacients/getSpec", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();

        if (!response.error) {
            for (var i = response.length - 1; i >= 0; i--) {

                $("#specs ul").append('<li data-role="list-divider" style="height:18px">'+
                    '<img class="imgspec" src="img/'+response[i].status+'.png" alt="">'+
                    '</li>'+
                    '<li><a spec="'+spec+'" href="#individualSpec" onclick="carrydataspec(this)" data-rel="popup" data-position-to="window" iddoctor="'+
                    response[i].id+
                    '" ><h2>'+
                    response[i].name+
                    '</h2><p>'+
                    response[i].location+
                    '</p>'+
                    '<p>'+
                    response[i].number+
                    '</p>'+
                    '</a>'+
                    '</li>');

            };
             $("#specs ul").listview();
        }else{

            $("#specs").html(response.message);


        }
    });
}

function carrydataspec(element){

    $("#individualSpec h3").html($(element).find("h2").html());
    $("#individualSpec h4").html($(element).attr("spec"));
    $("#individualSpec p").first().html($(element).find("p").first().html());
    $("#individualSpec p").last().html($(element).find("p").last().html());
    $("#individualSpec button").attr("idspec",$(element).attr("iddoctor"));


}

function requestHelp(element){

        var dataPost={
            session_id:localStorage.getItem("session_id"),
            username:localStorage.getItem('username'),
            idspec:$(element).attr("idspec"),
            idpacient:pacient.id,
            idreport:lastReport
        };
        loadingOpen("Cargando");

        $.post(server+"pacients/requestHelp", dataPost, function(response) {



            response = jQuery.parseJSON(response);
            loadingClose();

            if (!response.error) {

            waitResponse(response);
            }else{

                customAlert(response.message);
            }



        });



}

function    waitResponse(id){

    loadingOpen("Esperando respuesta");

    var dataPost={
            session_id:localStorage.getItem("session_id"),
            username:localStorage.getItem('username'),
            idhelp:id,
        };
    var counter=0;
    var wait = setInterval(function(){



        $.post(server+"pacients/verifyHelp", dataPost, function(response) {



            response = jQuery.parseJSON(response);

            if (!response.error) {

                clearInterval(wait);
                customAlert(response.message);
                if (response.status=="accepted") {
                $("#saveMessageGen").attr("idreport",lastReport);
                $("#saveMessageGen").attr("idrequest",id);
                seeDataChat(lastReport);

                    beginchat();


                }else{

                    $("#individualSpec").popup("close");




                }
                loadingClose();


            }else{



            counter=counter+1;
            if(counter==1800){
                clearInterval(wait);
                customAlert("El Especialista no ha respondido, puedes intentar más tarde o elegir otro especialista disponible");
                loadingClose();
                cancelRequest(dataPost);
            }



            }



        });

    },1000);


    


}




function cancelRequest(dataPost){


                loadingOpen("Cargando");

                $.post(server+"pacients/deleteHelp", dataPost, function(response) {



                    response = jQuery.parseJSON(response);
                    loadingClose();

                    if (!response.error) {

                    


                    }else{

                        customAlert(response.message);
                    }



                });





}


function clearSession(){
    clearInterval(controlTime);
    clearInterval(specRequest);
    localStorage.clear();
    pacient="";
    clinicHistory="";
    lastReport="";


}



function get_galery_photo() {
  

  navigator.camera.getPicture(uploadPhoto,function(message){customAlert('Se ha cancelado la subida')},{
      quality: 100,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 1200,
      targetHeight: 1600,
      correctOrientation: true
    }
  );
  
}


function get_camera_photo(){
    
  navigator.camera.getPicture(uploadPhoto,function(message){customAlert('Se ha cancelado la subida')},{
    quality: 100,
    destinationType: Camera.DestinationType.FILE_URI,
    targetWidth: 1200,
    targetHeight: 1600,
    correctOrientation: true
  });

}


function uploadPhoto(imageURI) {
  loadingOpen("Subiendo Imagen")
  
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

  ft.upload(imageURI, encodeURI(server+"upload/do_upload"), win, fail, options);
  
}

var sendedImages;

function win(r) {
  
  
  
  response=r.response;
  response = jQuery.parseJSON(response);
  
  localStorage.setItem('id_image',response.id_image);
  loadingClose();
  customAlert("Se ha cargado la imagen");
  if ($("#sended_photos").val()=="") {$("#sended_photos").val(0)};
  $("#sended_photos").val(parseInt($("#sended_photos").val())+1);
  $("#photos").append('<input type="hidden" name="photo_'+$("#sended_photos").val()+'" value="'+response.id_image+'">')
}

function fail(error) {
  customAlert("Ha ocurrido un error: Code = " + error.code);
  loadingClose();
}

var specRequest;

$( document ).on( "pageshow", "#myRequest", function() {

    seeRequest();

  specRequest = setInterval(function(){seeRequest()}, 1000);




        

});

var myspecResponse=[];

function seeRequest(){

    var dataPost={
                session_id:localStorage.getItem("session_id"),
                username:localStorage.getItem('username'),

            };
            
            $.post(server+"pacients/seeRequest", dataPost, function(responses) {


                if (responses!=myspecResponse) {
                    $("#requestMedics").html('<h3></h3><ul data-role="listview" data-inset="true"></ul>');
                    
                    response = jQuery.parseJSON(responses);


                    if (!response.error) {

                        notificationAAEM();

                        for (var i = response.length - 1; i >= 0; i--) {

                            $("#requestMedics ul").append('<li data-role="list-divider" >'+
                                '</li>'+
                                '<li><a  href="#historyspec" idrequest="'+
                                response[i].id+
                                '" idreport="'+
                                response[i].idreport+
                                '" idpacient="'+
                                response[i].idpacient+
                                '" onclick="carrydatareport(this)" data-rel="popup" data-position-to="window" ><h3>Medico:</h3><h2>'+
                                response[i].nameMedic+
                                '</h2>'+
                                '</a>'+
                                '</li>');

                    };
             $("#requestMedics ul").listview();
        }else{
            
            $("#requestMedics").html(response.message);


        }

                    myspecResponse=responses;
                    };

        });

}



function carrydatareport(element){
    clearInterval(specRequest);








        var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:$(element).attr("idpacient"),

    };

    $("#nameGeneralDoctor").html($(element).find("h2").html());
    $("#initchat").attr("idrequest",$(element).attr("idrequest"));
     $("#initchat").attr("idreport",$(element).attr("idreport"));
    $("#nochat").attr("idrequest",$(element).attr("idrequest"));




    $.post(server+"pacients/getPacient", dataPost, function(response) {
    
        response = jQuery.parseJSON(response);
        

        if (!response.error) {

            response.birthdate=getAge(response.birthdate);

              $("#infoPacientspec").html('<ul data-role="listview" data-inset="true">'+
                '<li data-role="list-divider">'+
                //'<span class="ui-li-count">'+response.id+'</span>
                '</li>'+
                '<li><div idpacient="'+response.id+'" href="#history"><h2>'+
                response.name+
                '</h2>'+
                '<p><strong>'+
                response.typeid+': '+response.id+
                '</strong></p>'+
                '<p>'+
                'EPS: '+response.eps+
                '</p>'+
                '<p class="ui-li-aside"><strong>'+
                response.birthdate+' Años'+
                '</strong></p>'+
                '</div></li>');

              $("#infoPacientspec ul").listview();


            $("#infoPacientspecchat").html('<ul data-role="listview" data-inset="true">'+
                '<li data-role="list-divider">'+
                //'<span class="ui-li-count">'+response.id+'</span>
                '</li>'+
                '<li><div idpacient="'+response.id+'" href="#history"><h2>'+
                response.name+
                '</h2>'+
                '<p><strong>'+
                response.typeid+': '+response.id+
                '</strong></p>'+
                '<p>'+
                'EPS: '+response.eps+
                '</p>'+
                '<p class="ui-li-aside"><strong>'+
                response.birthdate+' Años'+
                '</strong></p>'+
                '</div></li>');

            $("#infoPacientspecchat ul").listview();

              changePage("#historyspec");
        }
        $("#infoPacientspec ul").listview();

    });

  $('#clinicHistorySpec').on('collapsibleexpand', function (){

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:$("#infoPacientspec ul li div").attr("idpacient")
    };
    loadingOpen("Cargando");

    $.post(server+"pacients/getClinicHistory", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();
        if (!response.error) {
            $("#contentHistorySpec").html('<ul data-role="listview" id="contentHistorySpec" data-inset="true"> </ul>');

        for (var i = response.length - 1; i >= 0; i--) {


            $("#contentHistorySpec ul").append('<li><a href="#historypopup" style="font-size:0.9em"'+
                ' onclick="carryHistory(this)" idhistory="'+response[i].id+'" idresponse="'+i+'">'+response[i].date+'</a></li>');
            
        };
        $("#contentHistorySpec ul").listview();
        clinicHistory=response;

        }else{
            $("#contentHistorySpec").html(response.message);
        }
        

    });

    
    });


  $('#clinicHistorySpecchat').on('collapsibleexpand', function (){

    var dataPost={
        session_id:localStorage.getItem("session_id"),
        username:localStorage.getItem('username'),
        idpacient:$("#infoPacientspec ul li div").attr("idpacient")
    };
    loadingOpen("Cargando");

    $.post(server+"pacients/getClinicHistory", dataPost, function(response) {

        response = jQuery.parseJSON(response);
        loadingClose();
        if (!response.error) {
            $("#contentHistorySpecchat").html('<ul data-role="listview" id="contentHistorySpecchat" data-inset="true"> </ul>');

        for (var i = response.length - 1; i >= 0; i--) {


            $("#contentHistorySpecchat ul").append('<li><a href="#historypopup" style="font-size:0.9em"'+
                ' onclick="carryHistory(this)" idhistory="'+response[i].id+'" idresponse="'+i+'">'+response[i].date+'</a></li>');
            
        };
        $("#contentHistorySpecchat ul").listview();
        clinicHistory=response;

        }else{
            $("#contentHistorySpecchat").html(response.message);
        }
        

    });

    
    });




}


