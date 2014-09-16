function ProcessMgr(){
		
	//To have access from private methods
	var processObj = this;
	
	this.placeFilter = null;
	this.themeCatFilter = null;
	this.poiId = null;
	this.reportedPoiId = null; //To know the id when the user report a point and want to start a process
	this.isAnonymous = null;
	this.processId = null;
	this.procAim = null;
	this.procTheme = null;
	this.procCategory = null;
	this.procNeighborhood = null;
	this.procParticipants = null;
	this.procStart = null;
	this.procStatus = null;
	this.moderator = null;
	this.steward = null;
	this.evaluator = null;
	this.html = null;
	this.forumId = null; //To know the id of the reported comment, proposal, or bestpractice
	this.usersEmails = null; //To save the email of the users to invite
	this.usersIds = null; //To know the selected users to invite to the process
	this.editComment = false;
	this.commentId = null;
	this.commentDesc = null;
	
	/**
	 * Method to filter the list before the user start a new process (beforeStartPop.html).... to see if there is already one similar
	 */
	this.beforeStartList = function(popup){
		
		if (popup == 'beforeStartPop') {
			getProcessList('GeoProcess', {option: 'filteredList', poiId: processMgr.reportedPoiId}, processMgr.reportedPoiId, popup);
			
		}else if (popup == 'JoinProcessPop') {
			getProcessList('GeoProcess', {option: 'filteredList', poiId: poiInfo[0].poiId}, poiInfo[0].poiId, popup);
		}
	};
	/**
	 * When the user wants to start a process, if the observation is anonymous he/she has to change that or just report without creating any process
	 */
	this.startProcess = function(){
		
		if (this.isAnonymous == 'true') {
			
			var content = '<p>No es permitido iniciar un proceso nuevo o unirse a un proceso existente como usuario anónimo</p>'+
						  //'<div class="right-pos">'+
						  	'<div class="ui-grid-a">'+
								'<div class="ui-block-a"><a href="#" onclick="processMgr.processAim(); return false" rel="external" data-role="button" data-mini="true" class="orange-btn tall-btn">Aceptar</a></div>'+
								'<div class="ui-block-b"><a href="#" onclick="showPoiInformation(processMgr.poiId); return false" rel="external" data-role="button" data-mini="true" class="orange-btn">No, gracias. Quiero <br>permanecer anónimo</a></div>'+
							'</div><!-- /grid-a -->';
						  //'</div>';
			
			showDialogMsg(null,'<div class="right-pos" style="padding-right: 20px; padding-top: 5px;"><span class="text-orange large-text">Ojo</span></div>', content);
		}else{
			this.processAim();
		}
	};
	/**
	 * To define the aim of the user with this new process
	 */
	this.processAim = function(){
		
		var content = '<div class="text-right medium-text">'+
		  				'<span>Ahora es importante definir una meta para su proceso!<br>Que quieres lograr?</span>'+
		  			  '</div><br>'+
		  			  '<textarea name="aimText" id="aimText" maxLength="150"></textarea>'+
					  '<div id="processAimMsg"></div>'+
					  '<div class="right-pos">'+
					  	'<a href="#" onclick="processMgr.createProcess(); return false" rel="external" data-role="button" data-inline="true" data-mini="true" class="orange-btn tall-btn">Aceptar</a>'+
					  '</div>';

		showDialogMsg(null,'<div class="text-right" style="padding-right: 20px; padding-top: 5px;"><span class="text-orange">Acabas de iniciar un nuevo proceso en el punto seleccionado!</span></div>', content);
	};
	/**
	 * Create a new process
	 */
	this.createProcess = function(){
		
		var aim = $("#aimText").val();
				
		$("#processAimMsg").html("<img src=\"../../Resources/images/ajax-loader.gif\">");
		
		if (aim !== "") {
			
			$.post(url+"GeoProcess", {option: "createProcess", aim: aim, poiId: this.reportedPoiId}, function(data) {
				
				$("#processAimMsg").empty();
				
				var json = $.parseJSON(data);
				
				if (json.success) {
					
					var markerOptions = {
							position: new google.maps.LatLng(poiLat, poiLng)
					    };
					
					var marker = new google.maps.Marker(markerOptions);
					
					showWheel(processObj.reportedPoiId, marker, '2');
					
					processObj.processId = json.process;
					processObj.poiId = processObj.reportedPoiId;
					
					//processObj.addComment(true, aim);
					/*
					var processFooter = '<div data-role="navbar" data-iconpos="top">'+
								            '<ul>'+
								                '<li>'+
								                    '<a href="#" data-transition="slide" data-icon="">Proceso Blog</a>'+
								                '</li>'+
								                '<li>'+
								                    '<a href="#" data-transition="slide" data-icon="">Compartir</a>'+
								                '</li>'+
								                '<li>'+
								                    '<a href="#" data-transition="slide" data-icon="">Guiame</a>'+
								                '</li>'+
								                '<li>'+
								                    '<a href="#" data-transition="slide" data-icon="">Foro de discusión</a>'+
								                '</li>'+
								            '</ul>'+
								        '</div>';
					
					$('#homeFooter').html(processFooter).trigger('create');
					*/
					/*					
					$('#homeMsgId').html('<p>Iniciaste un proceso exitosamente, felicitaciones!<br>Nos gustaria saber que opinas sobre el GeoCiudadano! Por favor, ayudanos a mejorar realizando una breve encuesta.</p>'+
										 '<div class="ui-grid-a">'+
											'<div class="ui-block-a">'+
												'<a href="https://es.surveymonkey.com/s/geociudadano" target="_blank" data-role="button" data-mini="true" class="blue-btn">Aceptar</a>'+
											'</div>'+
											'<div class="ui-block-b">'+
												'<a href="#" onclick="processMgr.showProcessInfo('+processObj.processId+', null); return false" rel="external" data-role="button" data-mini="true" class="orange-btn">Cancelar</a>'+
										 	'</div>'+
										 '</div><!-- /grid-a -->');		
					
					//To show the popup that belongs to the homePage when it shows up
					showHomePop = true;*/
					
					var content = '<div class="text-right large-text">'+
					  				'<span class="text-orange">Acabas de iniciar un nuevo proceso en el punto seleccionado!<br> Ahora invita a otros GeoCiudadanos para participar en tu proceso!</span>'+
					  			  '</div><br>'+
					  			  '<div class="ui-grid-a">'+
									'<div class="ui-block-a">'+
										'<a href="'+url+'Popups/process/inviteProcessPop.html" data-role="button" data-mini="true" class="orange-btn">Invitar</a>'+
									'</div>'+
									'<div class="ui-block-b">'+
										'<a href="#" onclick="processMgr.centerProcess(); return false" rel="external" data-role="button" data-mini="true" class="blue-btn">No, gracias</a>'+
								 	'</div>'+
								  '</div><!-- /grid-a -->';

					showDialogMsg(null,'', content);
					
					//Get all the points
					allPoints(true);
				}
			});
			
		}else{
			$("#processAimMsg").html("<span class=\"text-red\">Debes definir una meta!</span>");
		}
	};
	/**
	 * Center the process on map
	 */
	this.centerProcess = function()
	{/*
		mapMgr.clearMapBounds();
		mapMgr.clearOverlays();
		*/
		$.post(url+"GeoPoi", {option: "getPoint", value: processObj.reportedPoiId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				/*
				var marker = mapMgr.addCustomMarker(json.X, json.Y, json.symbol);//simbolo de color, nombre simbolo-status_id
				
				google.maps.event.addListener(marker, 'click', function() {
					showPoiInformation(processObj.reportedPoiId);
				});
				
				marker.setMap(mapMgr.map);*/
				allPoints(true);
				mapMgr.map.setCenter(new google.maps.LatLng(json.X, json.Y));
				mapMgr.map.setZoom(17);
				
				mapMgr.createCircle(new google.maps.LatLng(json.X, json.Y), true);
				showCircle = true;
				
				isAllPoints = false;
				
				$.mobile.changePage(url+"Pages/homePage.html");
				
			}
		});
		
	};
	/**
	 * Get the information of the process
	 */
	this.showProcessInfo = function(procId, goTo){
		
		$.post(url+"GeoProcess", {option: "getProcessInfo", process: procId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				processObj.processId = procId;
				processObj.poiId = json.poiId;
				processObj.procAim = json.aim;
				processObj.procTheme = json.theme;
				processObj.procCategory = json.category;
				processObj.procNeighborhood = json.neighborhood;
				processObj.procParticipants = json.participants;
				processObj.moderator = json.moderator;
				processObj.steward = json.steward;
				processObj.evaluator = json.evaluator;
				processObj.procStart = json.date;
				processObj.procStatus = json.status;
				processObj.forumBtns = json.buttons;
				
				if (goTo == null || goTo == 'empty') {
					
					processObj.html = '';
					
					//Aim
					processObj.html += '<span style="font-weight: bold;">Meta: </span>'+
							'<span>'+json.aim+'</span><br>';
					//theme
					processObj.html += '<span style="font-weight: bold;">Tema: </span>'+
							'<span>'+json.theme+'</span><br>';
					//category
					processObj.html += '<span style="font-weight: bold;">Categoria: </span>'+
							'<span>'+json.category+'</span><br>';
					//neighborhood
					processObj.html += '<span style="font-weight: bold;">Barrio: </span>'+
							'<span>'+json.neighborhood+'</span><br>';
					//status
					processObj.html += '<span style="font-weight: bold;">Estado: </span>'+
							'<span>'+json.status_desc+'</span><br>';
					//Reported by
					/*processObj.html += '<span style="font-weight: bold;">Reportado por: </span>'+
							'<span>'+json.reportedBy+'</span><br>';*/
					//moderated by
					processObj.html += '<span style="font-weight: bold;">Moderado por: </span>'+
							'<span>'+json.moderator+'</span><br>';
					//Steward by
					processObj.html += '<span style="font-weight: bold;">Facilitado por: </span>'+
							'<span>'+json.steward+'</span><br>';
					//evaluated by
					processObj.html += '<span style="font-weight: bold;">Evaluado por: </span>'+
							'<span>'+json.evaluator+'</span><br>';
					//participants
					processObj.html += '<span style="font-weight: bold;">Participantes: </span>'+
						'<a href="#" onclick="processMgr.getParticipants(null); return false" rel="external">'+processObj.procParticipants+'</a><br>';
					//process startdate
					processObj.html += '<span style="font-weight: bold;">Inicio del proceso: </span>'+
							'<span>'+json.date+'</span><br>';
					
					processObj.html += '<div style="width: 35%; position: absolute; top: 0px; right: 0px;">'+
										 '<img src="'+json.imgName+'" class="center" height="85%" width="85%"></div>';
					
					if (goTo == null) {
						$.mobile.changePage(url+"Popups/process/processInfoPop.html");
					}
										
				}else{
					$.mobile.changePage(url+goTo);
				}
			}
		});
	};
	/**
	 * Show the info on the wheel
	 */
	this.showWheelInfo = function(poiId, marker, poiType)
	{
		mapMgr.map.setCenter(marker.getPosition());
		mapMgr.map.setZoom(17);
						
		var height = $(window).height();
		var width = $(window).width();
		
		$.mobile.loading("show", {
			text: 'Cargando...',
			textVisible: false,
			theme: 'a'
		});
		
		$.post(url+"GeoProcess", {option: "getWheelInfo", poiId: poiId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				processObj.processId = json.process;
								
				processObj.showProcessInfo(json.process, 'empty');
				
				var div = '<div id="geocircle">'+
					'<div id="quarterCircleTopLeft"><div class="title"><span>SOLUCIÓN</span></div><div id="wheelSolution"></div></div>'+
					'<div id="quarterCircleTopRight"><div class="title"><span>PROCESO</span></div><div id="wheelProcess" class="info"></div></div>'+ //'+'<img class="morePoiInfo" src="'+url+'Resources/images/info.png" onclick="event.stopPropagation(); showPoiInformation('+poiId+');"/>'+'
					'<div id="quarterCircleBottomLeft"><div class="title"><span>DISCUSIÓN</span></div><div id="wheelForum" class="info"></div></div>'+
					'<div id="quarterCircleBottomRight"><div class="title"><span>PROPUESTA</span></div><div id="wheelProposal"></div></div>'+
					'<div class="wheelCenterClick" onclick="event.stopPropagation(); showPoiInformation('+poiId+');"></div></div>';

				$('#wheelContainer').html(div).css("position", "absolute").css("top", ((height/2)-185)+'px').css("left", ((width/2)-150)+"px");
				
				$('#wheelProcess').html('<span>hace <br>'+json.since+'<br>'+'por '+json.geouser+'</span>');
				
				var commentsInfo = json.comments+' publicacion'; 
				if (json.comments > 1) {
					commentsInfo += 'es';
				}
				commentsInfo += '<br>'+json.participants+' participante';
				if (json.participants > 1) {
					commentsInfo += 's';
				}
				$('#wheelForum').html('<span>'+commentsInfo+'</span>');
				
				$( "#quarterCircleTopRight" ).click(function() {
					
					//processObj.showProcessInfo(json.process, null);
					$.mobile.changePage(url+"Popups/process/processInfoPop.html");
				});
				
				$( "#quarterCircleBottomLeft" ).click(function() {
					
					//processObj.showProcessInfo(json.process, url+'Pages/forumPage.html');
					$.mobile.changePage(url+'Pages/forumPage.html');
				});
				
				google.maps.event.addListener(mapMgr.map, 'idle', function(event) {
					
					mapMgr.map.setCenter(marker.getPosition());
				});
				
				google.maps.event.addListener(mapMgr.map, 'dragstart', function(event) {
					
					hideWheel();
				});
				
				google.maps.event.addListener(mapMgr.map, 'click', function(event) {
					
					hideWheel();
				});
				//if the process has proposal
				if (poiType >= 3) {
					$('#quarterCircleBottomRight').css({"background": "yellow", "cursor": "pointer"});
					
					$( "#quarterCircleBottomRight" ).click(function() {
						
						processObj.getDetails(json.process, poiType);
					});
					
					//if the process has solution
					if (poiType == 4) {
						$('#quarterCircleTopLeft').css({"background": "#9FF781", "cursor": "pointer"});
						
						$( "#quarterCircleTopLeft" ).click(function() {
							
							processObj.getDetails(json.process, poiType);
						});
					}
				}
								
				$.mobile.loading('hide');
				
				//Call to draw all lines of the connected points
				processObj.getConnectedPoints(marker.getPosition());
			}
		});
		
	};
	/**
	 * Get the connected points
	 */
	this.getConnectedPoints = function(startPoint){
		
		mapMgr.clearOverlaysOnly();
		
		$.post(url+"GeoProcess", {option: "processPoints", process: processObj.processId}, function(data) {
			
			var json = $.parseJSON(data);
			
			var endPoint = null;
			
			var color = "#0040FF";
			
			switch(processObj.procStatus)
			{
				case 'process':
					color = "red";
					break;
				case 'proposal':
					color = "yellow";
					break;
				case 'solved':
					color = "green";
					break;					
			}
			
			$(json).each(function(i,val){
				
				endPoint = new google.maps.LatLng(val.X, val.Y);
				
				mapMgr.createLine(startPoint, endPoint, color);
			});
		});
	};
	/**
	 * Get the numbers of the media related to the process
	 */
	this.showProcessMedia = function(){
		
		$.post(url+"GeoProcess", {option: "getProcessMedia", process: processObj.processId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				$('#procComments').html(json.comments);
				$('#procPictures').html(json.pictures);
				$('#procLinks').html(json.links);
				$('#procDocs').html(json.docs);
			}
		});
	};
	/**
	 * When a user want to join an existing process
	 */
	this.joinProcess = function(processId, poiId, showMsg){
		
		if (checkCookie('geocitizen') && checkCookie('geouser')) {
			
				if (this.isAnonymous == 'true' && showMsg) {
					
					var content = '<p>No es permitido iniciar un proceso nuevo o unirse a un proceso existente como usuario anónimo</p>'+
								  //'<div class="right-pos">'+
								  	'<div class="ui-grid-a">'+
										'<div class="ui-block-a"><a href="#" onclick="processMgr.joinProcess('+processId+','+ poiId+', false); return false" rel="external" data-role="button" data-mini="true" class="orange-btn tall-btn">Aceptar</a></div>'+
										'<div class="ui-block-b"><a href="#" onclick="showPoiInformation('+poiId+'); return false" rel="external" data-role="button" data-mini="true" class="orange-btn">No, gracias. Quiero <br>permanecer anónimo</a></div>'+
									'</div><!-- /grid-a -->'+
									'<div id="joinedPoiProcMsg" data-role="popup" data-overlay-theme="a" class="geoPopup"></div>';
								  //'</div>';
					
					showDialogMsg(null,'<div class="right-pos" style="padding-right: 20px; padding-top: 5px;"><span class="text-orange large-text">Ojo</span></div>', content);
				}else{
					
					$.post(url+"GeoProcess", {option: "joinProcess", process: processId, poiId: poiId}, function(data) {
						
						var json = $.parseJSON(data);
						
						if (json.success) {
							
							var markerOptions = {
									position: new google.maps.LatLng(poiLat, poiLng)
							    };
							
							var marker = new google.maps.Marker(markerOptions);
							
							showWheel(processObj.reportedPoiId, marker, '2');
							
							$('#joinedPoiProcMsg').html('<p>'+json.msg+'</p>'+
														'<a href="'+url+'Pages/homePage.html" data-role="button" data-mini="true" class="blue-btn">Aceptar</a>');
							
						}else{
							$('#joinedPoiProcMsg').html('<p>Lo sentimos, intenta mas tarde.</p>'+
									'<a href="'+url+'Pages/homePage.html" data-role="button" data-mini="true" class="blue-btn">Aceptar</a>');
						}
						
						$('#joinedPoiProcMsg').popup('open').trigger("create");
						//$('#joinedPoiProcMsg a[data-role="button"]').button();
											
						//if (poiClickLat != null) {
							
							getPoints('GeoProcess', {option: 'processPoints', process: processId}, null);
							//allPoints(true);
							//centerPoi(null, poiClickLat, poiClickLng, null, 17, false);
							
							poiClickLat = null;
						//}
						
					});
				}
		}else{
			$.mobile.changePage(url+'Popups/LogInPop.html');
		}
	};
	/**
	 * To activate the buttons (procNotice, procBestPractice, procProposal)
	 */
	this.procInfoBtns = function(){
		
		$.post(url+"GeoProcess", {option: "procInfoBtns", process: processObj.processId}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				if (json.notice) {
					$('#procNotice').removeClass('ui-disabled');
				}
				
				if (json.bestpractice) {
					$('#procBestPractice').removeClass('ui-disabled');
				}
				
				if (json.proposal) {
					$('#procProposal').removeClass('ui-disabled');
				}
			}
		});
	};
	/**
	 * Get all the notices for the process
	 */
	this.getProcessNotices = function() {
		
		getAllEvaluator("GeoProcess", {option: "processNotices", process: processObj.processId}, 'Avisos');
	};
	/**
	 * Get all the bestpractice of the evaluator for the process
	 */
	this.getBestPractice = function() {
		
		getAllEvaluator("GeoProcess", {option: "bestPractice", poiId: processObj.poiId}, 'Casos ejemplares');
	};
	/**
	 * Get all the bestpractice of the evaluator for the process
	 */
	this.getProposals = function() {
		
		getAllEvaluator("GeoProcess", {option: "getProposals", process: processObj.processId}, 'Propuestas');
	};
	/**
	 * Show all the participants of the process
	 */	
	this.getParticipants = function(processId) {
		
		if (processId == null) {
			getParticipants("GeoProcess", {option: "participantsList", process: processObj.processId}, 'Pongase en contacto con los demás participantes en este proceso!');
		} else {
			getParticipants("GeoProcess", {option: "participantsList", process: processId}, 'Pongase en contacto con los demás participantes en este proceso!');
		}
		
	};
	/**
	 * Show all the users that like this entry
	 */	
	this.getLikeUsers = function(id, type, likeDiv) {
		
		if (parseInt($("#"+likeDiv).text()) > 0) {
			getParticipants("GeoProcess", {option: "likesList", id: id, type: type}, 'Los siguientes usuarios han hecho like!');
		}
	};
	/**
	 * To contact a user 
	 */
	this.contactUser = function(username, sendInfo) {
		
		if (!sendInfo) {
			var html =  '<label for="userContactText">Puede enviar un mensaje al participante en el proceso por mail:</label>'+
			'<textarea name="userContactText" id="userContactText"></textarea>'+
			'<div style="width:100%;">'+
				'<div class="ui-grid-a">'+
					'<div class="ui-block-a"><div class="left-pos" id="contactUserMsg"></div></div>'+
					'<div class="ui-block-b" class="right-pos">'+
						'<a id="contactUserBtn" href="#" onclick="processMgr.contactUser(\''+username+'\',true); return false" rel="external" data-role="button" data-inline="true" data-mini="true" class="orange-btn right-pos">Enviar</a>'+
						'<a href="#" data-role="button" data-inline="true" data-mini="true" data-rel="back" class="blue-btn right-pos">Cerrar</a>'+
					'</div>'+
				'</div><!-- /grid-a -->'+
			'</div>';

			showDialogMsg(null,'<div class="right-pos text-right" style="padding-right: 20px; padding-top: 5px;"><span class="text-orange">Contactar</span></div>', html);
		} else {
			
			var msg = $('#userContactText').val();
			if (msg != '') {
				
				$("#contactUserMsg").html('<img src="'+url+'Resources/images/ajax-loader.gif">');
				
				$.post(url+"GeoProcess", {option: "contactUser", user: username, msg: msg}, function(data) {
					
					try {
						var json = $.parseJSON(data);
						
						if (json.success) {
							/*$('#contactUserBtn').hide();
							
							$("#contactUserMsg").html('Mensaje enviado con exito!');
							*/
							$('#genericPop').dialog('close');
							
						}else{
							$("#contactUserMsg").html('<span class="text-red">'+json.msg+'</span>');
						}	
					} catch (e) {
						$("#contactUserMsg").html('<span class="text-red">Lo sentimos, intenta mas tarde.</span>');
					}			
				});
			}
		}
		
	};
	/**
	 * Get the media related to the process
	 */
	this.getMedia = function(type){
		
		var getInfo = false;
		var title = null;
		//To know if we have to go to database
		if (type == 'img' && $('#procPictures').text() != '0') {
			getInfo = true;
			title = 'Fotos';
		} else if (type == 'url' && $('#procLinks').text() != '0') {
			getInfo = true;
			title = 'Enlaces';
		} else if (type == 'doc' && $('#procDocs').text() != '0') {
			getInfo = true;
			title = 'Documentos';
		}
		
		if(getInfo){
			//Get all the selected media
			getMediaList(type, title, null);
		}
	};
	/**
	 * Get the details for the Notices, Proposals or Bestpractice
	 */
	this.getDetails = function(id, type){
		
		$.post(url+"GeoProcess", {option: "getDetails", id: id, type: type}, function(data) {
			
			var json = $.parseJSON(data);
			
			var title = null;
			//To know if we have to go to database
			if (type == 'notice') {
				title = 'Detalles - Aviso';
			} else if (type == '3') {
				title = 'Detalles - Propuesta';
			} else if (type == '4') {
				title = 'Detalles - Solucion';
			} 
			
			showDetails(json, title, type);
			
		});
	};
	/**
	 * To like a comment, proposal or bestpractice
	 */
	this.like = function(id, type, rowId){
		
		$.post(url+"GeoProcess", {option: "like", id: id, type: type}, function(data) {
			
			var json = $.parseJSON(data);
			
			if (json.success) {
				
				var likes = parseInt($("#"+rowId).text());
				
				$("#"+rowId).html(likes+1);
			}
		});
	};
	
	/**
	 * To add a comment on the process
	 */
	this.addComment = function(show, commentTxt){
			
		if (checkCookie('geocitizen') && checkCookie('geouser')) {
			
			$.post(url+"GeoSession", {option: "isAuth"}, function(data) {
				
				var json = $.parseJSON(data);
				
				if (json.value) {

					if (!show) {
						
						$.mobile.changePage(url+'Popups/process/commentPop.html');
						
					} else {
						
						var comment = commentTxt;
						
						if (commentTxt == null) {
							comment = $('#textComment').val();
						}
									
						if (comment !== '') {
							
							var commentUrl = null;
							if (commentTxt == null) {
								
								commentUrl = $('#txtUrl').val();
								if (commentUrl === '') {
									commentUrl = null;
								}
							}
							
							$('#commentMsg').html('<img src="../../Resources/images/ajax-loader.gif" class="center">');
											
							$.post(url+"GeoProcess", {option: "addComment", 
													  process: processObj.processId, 
													  poiId: processObj.poiId,
													  comment: comment,
													  edit: processMgr.editComment,
													  commentId: processMgr.commentId,
													  url: commentUrl}, function(data) {
								
								var json = $.parseJSON(data);
								
								if (json.success) {
									
									processObj.forumId = json.commentId;
									
									if(savePhoto){
										$('#submitPhoto').click();
									}else if (saveDoc) {
										$('#submitDoc').click();
									}else if (commentTxt == null) {
										
										processMgr.editComment = false;
										processMgr.commentId = null;
										$.mobile.changePage(url+'Pages/forumPage.html');
									}
								}
							});
						} else {
							$('#commentMsg').html('<span class="red-text">El comentario es obligatorio</span>');
						}
					}
					
				} else{
					$.mobile.changePage(url+json.url);
				}
			});
		}else{
			$.mobile.changePage(url+'Popups/LogInPop.html');
		}
	};
	
	/**
	 * 
	 */
	this.replyComment = function(commentId, send){
		
		processObj.commentId = commentId;
		
		if (checkCookie('geocitizen') && checkCookie('geouser') && !send) {
					
			$.post(url+"GeoSession", {option: "isAuth"}, function(data) {
				
				var json = $.parseJSON(data);
				
				if (json.value) {
				
					$('#addReplyComment').popup('open');
					
				}else{
					$.mobile.changePage(url+'Popups/LogInPop.html');
				}
			});
		}else{
			
			if (send) {
				
				var reply = $('#textReply').val();
				
				if (reply != '') {
					
					$("#replyMsg").html('<img src="'+url+'Resources/images/ajax-loader.gif">');
					
					$.post(url+"GeoProcess", {option: "replyComment", commentId: processMgr.commentId, reply: reply}, function(data) {
						
						var json = $.parseJSON(data);
						
						if (json.success) {
						
							getForumList('GeoProcess', {option: 'forumList', process: processMgr.processId});
							
							$('#textReply').val('');
							$('#replyMsg').empty();
							
							$('#addReplyComment').popup('close');
							
						}else{
							$('#replyMsg').html('<span class="red-text">'+json.msg+'</span>');
						}
					});
				}else{
					$('#replyMsg').html('<span class="red-text">Escribe una respuesta!</span>');
				}
			} else {
				$.mobile.changePage(url+'Popups/LogInPop.html');
			}
		}
				
	};
	
	/**
	 * 
	 */
	this.editForumComment = function(commentId, description){
		
		processObj.editComment = true;
		processObj.commentId = commentId;
		processObj.commentDesc = description;
		
		$.mobile.changePage(url+'Popups/process/commentPop.html');
	};
	
	/**
	 * Erase a comment or reply
	 */
	this.eraseForumItem = function(option, itemId){
		
		$.post(url+"GeoProcess", {option: option, itemId: itemId}, function(data) {
		
			var json = $.parseJSON(data);
			
			if (json.success) {
			
				getForumList('GeoProcess', {option: 'forumList', process: processMgr.processId});
			}
		});
	};
			
	/**
	 * To make a proposal
	 */
	this.makeProposal = function(show){
			
		if (!show) {
			
			$.mobile.changePage(url+'Popups/process/proposalPop.html');
			
		} else {
			
			var proposal = $('#textProposal').val();
			
			if (proposal !== '') {
				
				var proposalUrl = $('#txtUrl').val();
				if (proposalUrl === '') {
					proposalUrl = null;
				}
				
				$.post(url+"GeoProcess", {option: "makeProposal", 
										  process: processObj.processId, 
										  poiId: processObj.poiId,
										  proposal: proposal,
										  url: proposalUrl}, function(data) {
					
					var json = $.parseJSON(data);
					
					if (json.success) {
						
						processObj.forumId = json.proposalId;
						
						if(savePhoto){
							$('#submitPhoto').click();
						}else if (saveDoc) {
							$('#submitDoc').click();
						}
						
						var markerPos = mapMgr.map.getCenter();
						
						var markerOptions = {
								position: markerPos
						};
							
						marker = mapMgr.addMarker(markerPos.lat(), markerPos.lng(), markerOptions);
						
						//$("#forumBtns .ui-block-c").html('<a href="#" data-role="button" data-mini="true" onclick="processMgr.getDetails("'+processMgr.processId+'", 3); return false" rel="external" class="orange-btn">Ver <br>propuesta</a>');
						
						processObj.showProcessInfo(processObj.processId, 'Pages/forumPage.html');
						
						showWheel(processObj.poiId, marker, '3');
						
						allPoints(true);
						
					}
				});
			} else {
				$('#proposalMsg').html('<span class="red-text">La propuesta es obligatoria</span>');
			}
		}
	};
	
	/**
	 * To know if i can show the invitePop
	 */
	this.voteProposal = function(voting_id){
				
		if (checkCookie('geocitizen') && checkCookie('geouser')) {
			
			$.mobile.loading("show", {
				text: 'Enviando voto...',
				textVisible: true,
				theme: 'a'
			});
			
			$.post(url+"GeoProcess", {option: "voteProposal", process: processObj.processId, voting: voting_id, vote: $('input[name=radio-vote-choice]:checked').val()}, function(data) {
				
				//var json = $.parseJSON(data);

				$.mobile.loading("hide");
			});
		}
	};
	
	/**
	 * To know if i can show the invitePop
	 */
	this.invitePop = function(){
		
		if (checkCookie('geocitizen') && checkCookie('geouser')) {
			
			$.post(url+"GeoSession", {option: "isAuth"}, function(data) {
				
				var json = $.parseJSON(data);
				
				if (json.value) {

					$.mobile.changePage(url+'Popups/process/inviteProcessPop.html');
						
				} else{
					$.mobile.changePage(url+json.url);
				}
			});
		}else{
			$.mobile.changePage(url+'Popups/LogInPop.html');
		}
	};
	
	/**
	 * To invite others to the process
	 */
	this.inviteOthers = function(value, action){
			
		if (action == 'email') {
			
			$('#inviteSelection').append($('#txtEmail').val()+', ');
			
			if (processObj.usersEmails == null) {
				
				processObj.usersEmails = $('#txtEmail').val();
				
			}else{
				processObj.usersEmails += '!invite!' + $('#txtEmail').val();
			} 
			
			$('#txtEmail').val('');
			
		}else if (action == 'id') {
			
			$('#inviteSelection').append($('#user_'+value).html()+', ');
			
			if (processObj.usersIds == null) {
				
				processObj.usersIds = ''+value;
				
			} else {
				processObj.usersIds += '!invite!'+value;
			}
		}else{
			
			$.mobile.loading("show", {
				text: 'Enviando invitaciones',
				textVisible: true,
				theme: 'a'
			});
			
			$.post(url+"GeoProcess", {option: "inviteOthers", 
							  emails: processObj.usersEmails, 
							  users: processObj.usersIds,
							  url: shareUrl+'?point='+processObj.poiId}, function(data) {
			
				var json = $.parseJSON(data);
				
				$.mobile.loading("hide");
				
				if (json.success) {
					
					//processMgr.centerProcess();
					
					$.mobile.changePage(url+'Pages/homePage.html');
				}
			});
		}
	};
	
	
}