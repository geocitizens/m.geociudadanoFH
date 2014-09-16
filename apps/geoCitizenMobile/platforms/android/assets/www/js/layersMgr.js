var map, ov, iw, svc, marker;
var layerSet = false;

function loadMapService(urlService) {
	
	//alert(urlService);
	/*var el = document.getElementById('svc');
	var s = el.options[el.selectedIndex].text;*/
	//var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' + s;
	if (ov != null) {
		if (ov instanceof gmaps.ags.MapOverlay) {
			ov.setMap(null);
		} else if (ov instanceof gmaps.ags.MapType) {
			map.overlayMapTypes.removeAt(0);
		}
		ov = null;
	}
	svc = new gmaps.ags.MapService(urlService);
	google.maps.event.addListener(svc, 'load', function() {
		
		$('#layersBtn').show();
		
		if (svc.singleFusedMapCache) {
			ov = new gmaps.ags.MapType(svc, {
				opacity: 0.5
			});
			//mapMgr.map.overlayMapTypes.insertAt(0, ov);
		} else {
			ov = new gmaps.ags.MapOverlay(svc, {
				opacity: 0.5
			});
			//ov.setMap(mapMgr.map);
		}
		
		//ov.refresh();
		
	});
}
/**
 * Check the visibility of layers and refresh map
 */
function setLayerVisibility() {
		
	if (!layerSet) {
				
		if (svc.singleFusedMapCache) {
			mapMgr.map.overlayMapTypes.insertAt(0, ov);
		} else {
			ov.setMap(mapMgr.map);
		}
		
		layerSet = true;
	}
		
	var layers = svc.layers;
	/*
	for (var i = 0; i < layers.length; i++) {
		var el = document.getElementById('layer' + layers[i].id);
		if (el) {
			layers[i].visible = (el.checked === true);
		}
		
		alert('LayerId: '+i);
	}*/
	
	var oneChecked = false;
	
	$(".layer_id").each(function(i, el) {
		
		//alert(el.checked+' / i: '+i+' value: '+el.value);
		if (el.checked === true) {
			oneChecked = true;
		}
		layers[el.value].visible = (el.checked === true);
	});
	
	if (oneChecked) {
		ov.refresh();
	}else{
		if (ov instanceof gmaps.ags.MapOverlay) {
			ov.setMap(null);
		} else if (ov instanceof gmaps.ags.MapType) {
			map.overlayMapTypes.removeAt(0);
		}
		
		layerSet = false;
	}
}

function setOVOpacity(op){
	if (ov) {
		ov.setOpacity(op);
	}
}

function getLayersList(){
	
	$.post(url+"GeoPlace", {option: "getSubGeoLayers", extent: 'lushoto'}, function(data) {
		
		var json = $.parseJSON(data);
		
		var html = "";
		var urlService = null;
		
		$(json).each(function(i,val){
			
			//html += '<p>'+val.layer_description+' / '+val.type+' / '+val.layer_id+' </p>';			       
		   
			html += '<div style="border-bottom: 1px solid #E6E6E6;"><input type = "checkbox" class="layer_id" value = "'+val.layer_id+'" onclick="setLayerVisibility()" /><span style="padding-bottom: 3px;">'+val.layer_description+'</span><br>'+
					'<div style="font-size: 10px; text-align: right; padding-right: 3px; padding-bottom: 1px;"><a href="#" onclick="navigator.app.loadUrl(\''+val.layer_legend+'\', {openExternal: true}); return false" >Legend</a></div></div>';
			
			urlService = val.service;
		});
		
		if (html != "") {
			
			$('#layersList').html(html);
		
			if (urlService != null) {
				loadMapService(urlService);
			}		
		}
	});
}
