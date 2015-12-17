var intervalChat;

function    beginchat(){


    changePage("#chat");

    intervalChat = setInterval(function(){seeDataChat(lastReport); },1000);




}


function    beginchatspec(element){

        var dataPost={
                idrequest:$(element).attr("idrequest"),
                idreport:$(element).attr("idreport")

            };
            $.post(server+"pacients/initchat", dataPost, function(response) {

            	response = jQuery.parseJSON(response);
            	$("#saveMessage").attr("idreport",response.idreport);
            	$("#saveMessage").attr("idrequest",response.idrequest);
            	lastReport=response.idreport;
            	seeDataChat(response.idreport);





            });








    changePage("#chatspec");
    intervalChat = setInterval(function(){seeDataChat(lastReport); },1000);


}
var sizeChat=[];
function seeDataChat(element){






	        var dataPost={
                session_id:localStorage.getItem("session_id"),
                username:localStorage.getItem('username'),
                idreport:element

            };
            $.post(server+"pacients/seeChat", dataPost, function(response) {

            	response = jQuery.parseJSON(response);
            	if (sizeChat.length != response.length){
            		
            		for (var i = sizeChat.length; i < response.length; i++) {

            			
            			if (response[i].iduser==localStorage.getItem("id")) { var chatclass="mychat"}else{var chatclass="yourchat"};
            			$("#chatContainer table tbody").append("<tr><td class='"+chatclass+" hide' >"+response[i].message+"<td><tr>").fadeIn();
            			$("#chatContainerGEN table tbody").append("<tr><td class='"+chatclass+" hide' >"+response[i].message+"<td><tr>").fadeIn();
            			
            		};
            		$(".hide").fadeIn();
            		$("#chatContainer").scrollTop($("#chatContainer")[0].scrollHeight);
            		$("#chatContainerGEN").scrollTop($("#chatContainerGEN")[0].scrollHeight);
            		sizeChat=response;
            	}




            });


}

function saveMesagge(element){

	if (localStorage.getItem("rol")=="GEN") {
		var message=$("#textchatGen").val();
        $("#textchatGen").val("");
	}else{

		var message=$("#textchat").val();
        $("#textchat").val("");

	}
			var dataPost={
                session_id:localStorage.getItem("session_id"),
                username:localStorage.getItem('username'),
                idrequest:$(element).attr("idrequest"),
                idreport:$(element).attr("idreport"),
                message:message

            };
            $.post(server+"pacients/saveChat", dataPost, function(response) {

            	response = jQuery.parseJSON(response);


            	seeDataChat(response.idreport);








            });


}



$( document ).on( "pageshow", function( event, ui) {

  if ($(event.target).attr("id")=="chat"||$(event.target).attr("id")=="chatspec") 
  {

  }
  else{
  	clearInterval(intervalChat);

  	$("#chatContainer table tbody").html("<tr><td><td><tr>")
  	$("#chatContainerGEN table tbody").html("<tr><td><td><tr>")
  }
});



function endchatspec(element){
                    var dataPost={
                session_id:localStorage.getItem("session_id"),
                username:localStorage.getItem('username'),
                idrequest:$(element).attr("idrequest"),
                idhelp:$(element).attr("idrequest"),
                idreport:$(element).attr("idreport"),


            };

            $.post(server+"pacients/declinechat", dataPost, function(response) {

                response = jQuery.parseJSON(response);
                cancelRequest(dataPost);

                changePage("#myRequest");



            });
}

function endChat(type){

    //spec
    //gen

    if (navigatorstatus()) {

        navigator.notification.confirm('Finalizar chat?',

          onConfirm,
          'Confirmar Accion',
          'Aceptar,Cancelar'
          );

        function onConfirm(button) {
            if (button==1) {

               changePage("#"+type);

            }
        }
    }else{

        if(confirm('Finalizar chat?'))
        {
            changePage("#"+type);

        }else{
            return(false);
        }
    }









}