function printModule () {

	this.printSearchPacient = function (data) {

		var pacients = '';

		for (var i = data.length - 1; i >= 0; i--) {

			data[i].birthdate = configuration.getAge(data[i].birthdate);
		   	pacients +='<li data-role="list-divider"></li><li idpacient="'+ data[i].id +'"><a idpacient="' + 
		   				data[i].id +
		   				'" href="#" class="historyPacient"><h2>'	+
	                	data[i].name	+
	                	'</h2><p><strong>'	+
	                	data[i].typeid + 
	                	': ' + 
	                	data[i].id+
	                	'</strong></p><p>EPS: ' +
	                	data[i].eps +
	                	'</p><p class="ui-li-aside"><strong>'+
	                	data[i].birthdate +
	                	' Años</strong></p></a></li>';
	    };
	    
	    $("#pacients").html('<ul data-role="listview" data-inset="true">' + pacients + '</ul>');
	    $("#pacients ul").listview();
	}
	this.printInfoPacient = function (pacients) {

		var sex = {muj:'Mujer',hom:'Hombre'};
		var html = '';
		
		for (var i = pacients.length - 1; i >= 0; i--) {
			var pacient = pacients[i];

			html +=  '<label >' + pacient.name + '</label>' +
						'<label >' + pacient.typeid + ':  ' + pacient.id + '</label>' +
						'<label >' +configuration.getAge( pacient.birthdate )+ ' Años (' + pacient.birthdate + ')</label>' +
						'<label >' + sex[pacient.sex] + '</label>' +
						'<label >EPS: ' + pacient.eps + '</label>' +
						'<label >Dir: ' + pacient.address + '</label>' +
						'<label >Tel: ' + pacient.phone + '</label>';
		};
		$('.infoPacient').html(html);

	}
	this.printSpecs = function (data,spec) {

		$("#specs").html('<h3>'+spec+'</h3><ul data-role="listview" data-inset="true"></ul>');
		$("#specFilter li").addClass('ui-screen-hidden');

		for (var i = data.length - 1; i >= 0; i--) {

                $("#specs ul").append('<li data-role="list-divider" style="height:18px">' +
                    '<img class="imgspec" src="img/animations/' +
                    data[i].status +
                    '.gif" alt=""></li><li class="selectThisSpec" iddoctor="'+data[i].id +'" ><a spec="' +
                    spec +
                    '" href="#individualSpec" data-rel="popup" data-position-to="window" iddoctor="' +
                    data[i].id +
                    '" ><h2>' +
                    data[i].name +
                    '</h2><p>' +
                    data[i].location +
                    '</p><p>' +
                    data[i].number +
                    '</p></a></li>');

            };
             $("#specs ul").listview();
	}
	this.printRegisterButton = function (error) {

		$("#pacients").html('<h3>'	+
			configuration.errorCodes[error].message +
			'</h3>'	+
			'<a href="#registerPacient" class="formLeft ui-btn ui-mini " id="registerButton">Registrar</a>');
	}
	this.printStories = function (data) {
		$(".contentHistory").html('<ul data-role="listview" id="contentHistory"></ul>');
		for (var i = 0; i < data.length; i++) {
			var record = data[i];
			 $(".contentHistory ul").append('<li><a class="carryHistory" href="#historyList"  style="font-size:0.9em"'+
            ' idhistory="'+record.id+'" idresponse="'+i+'">'+record.saved_date+'</a></li>');
		};
		$(".contentHistory ul").listview();


	}
	this.updateHistory = function (data) {
		$("#historyList [data-id]").html("");
		$("#responseContainer table tbody").html("");
		$("#historyList [data-id='diagnostic']").append('<br/><h3>Diagnostico Medico General</h3>')
		for(var key in data) {
		    var value = data[key];
            $("#historyList [data-id='"+ key +"']").append(data[key]);
		}
		if (data.customDiagnostic.length > 0) {$("#historyList [data-id='diagnostic']").append('<br/><h3>Diagnostico Especialista</h3>')};
		for (var i = 0; i < data.customDiagnostic.length; i++) {
			var diagnostic = data.customDiagnostic[i];
			$("#historyList [data-id='diagnostic']").append('<br/>' + diagnostic.code + ': ' + diagnostic.description);
		};
		for (var i = 0; i < data.chat.length; i++) {
			var message = data.chat[i];

		};
		for (var i = 0; i < data.chat.length; i++) {
			var currentData = data.chat[i];
			if (parseInt(currentData.image) == 1) {
				currentData.message = '<a style="margin: 0 auto;width: 30%;display: block;" href="#popupPreviewList" class="toPreview" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + 
			configuration.url + 
			'uploads/' +
			currentData.message +
			'" alt="Imagen diagnostica" ></a>';

			};
			if (session.idUser == currentData.iduser) {
				$("#responseContainer table tbody").append("<tr><td></td><td class='mychat' >" + currentData.name+ ": " + currentData.message+ " <div class='dateMessage'>" + currentData.date + "</div></td><td class='rightChat'></td></tr>");
			}else{
				$("#responseContainer table tbody").append("<tr><td class='leftChat'></td><td class='yourchat' >" + currentData.name+ ": " + currentData.message+ " <div class='dateMessage'>" + currentData.date + "</div></td><td></td></tr>");
			}
		};
		var images = data['images'];
		$("#historyList [data-id='images-dg']").html("");
		for (var i = images.length - 1; i >= 0; i--) {
			var image = images[i];
			$("#historyList [data-id='images-dg']").append('<a href="#popupPreviewList" class="toPreview" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + 
			configuration.url + 
			'uploads/' +
			image.name +
			'" alt="Imagen diagnostica" ></a>');
			
		};

	}
	this.printChatMessages = function (data) {

		for (var i = 0; i < data.length; i++) {
			var currentData = data[i];
			if (parseInt(currentData.image) == 1) {
				currentData.message = '<a style="margin: 0 auto;width: 30%;display: block;" href="#popupPreviewChat" class="toPreview" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="' + 
			configuration.url + 
			'uploads/' +
			currentData.message +
			'" alt="Imagen diagnostica" ></a>';

			}else if (parseInt(currentData.image) == 2 || currentData.message == 'Chat finalizado') {

				chat.blocked = true;

			};
			if (session.idUser == currentData.iduser) {
				$("#chatContainer table tbody").append("<tr class='hide'><td></td><td class='mychat' >" + currentData.message+ " <div class='dateMessage'>" + currentData.date + "</div></td><td class='rightChat'></td></tr>");
			}else{
				$("#chatContainer table tbody").append("<tr class='hide'><td class='leftChat'></td><td class='yourchat' >" + currentData.message+ " <div class='dateMessage'>" + currentData.date + "</div></td><td></td></tr>");
			}
		};
		$('.hide').fadeIn();
		$("#chatContainer").scrollTop($("#chatContainer")[0].scrollHeight);

		
	}
	this.printRequest = function (requests) {
		$("#requestMedics").html('<h3></h3><ul data-role="listview" data-inset="true"></ul>');
		for (var i = requests.length - 1; i >= 0; i--) {

			var urgency = parseInt(requests[i].urgency);
			var urgencyText = urgency?'style="background:red"':'';

		$("#requestMedics ul").append('<li data-role="list-divider" ' + urgencyText + '>' +
			'</li>'+
			'<li data-request="'+ requests[i].idRequest + '" data-pacient="'+ requests[i].idPacient + 
			'" ><a  class="seeDetailRequest" href="#historyspec" ><h3>Medico:</h3><h2>'+
			requests[i].nameMedic+
			'</h2>'+
			'<h3>Paciente:</h3><h2>'+
			requests[i].namePacient+
			'</h2>'+
			'</a>'+
			'</li>');
		};
		$("#requestMedics ul").listview();
		
	}
}
var printModule = new printModule();