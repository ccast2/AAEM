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
                ' onclick="carryHistory(this)" idhistory="'+response[i].id+'" idresponse="'+i+'">'+response[i].saved_date+'</a></li>');
            
        };
        $("#contentHistory ul").listview();
        clinicHistory=response;

        }else{
            $("#contentHistory").html(response.message);
        }
        

    });

    
    });

});


$( document ).on( "pageshow", "#myRequest", function() {

    seeRequest();

  specRequest = setInterval(function(){seeRequest()}, 1000);




        

});