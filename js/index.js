//var myPolygon;
function initialize() {
	// Map Center
	var myLatLng = new google.maps.LatLng(-17.365, 31.05337);
	// General Options
	var mapOptions = {
	  zoom: 8,
	  center: myLatLng,
	  mapTypeId: google.maps.MapTypeId.RoadMap
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
	// Polygon Coordinates
	var triangleCoords = [
	  new google.maps.LatLng(-18.17896, 30.24744),
	  new google.maps.LatLng(-17.91749, 31.57241),
	  new google.maps.LatLng(-17.100, 31.200)
	];
	// Styling & Controls
	myPolygon = new google.maps.Polygon({
	  paths: triangleCoords,
	  draggable: true, // turn off if it gets annoying
	  editable: true,
	  strokeColor: '#FF0000',
	  strokeOpacity: 0.8,
	  strokeWeight: 2,
	  fillColor: '#FF0000',
	  fillOpacity: 0.35
	});
  
	myPolygon.setMap(map);
	//google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
	google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
	//google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
	google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);
  }
  
  //Display Coordinates below map
  function getPolygonCoords() {
	var len = myPolygon.getPath().getLength();
	var htmlStr = "";
	for (var i = 0; i < len; i++) {
	  htmlStr += "new google.maps.LatLng(" + myPolygon.getPath().getAt(i).toUrlValue(5) + "), ";
	  //Use this one instead if you want to get rid of the wrap > new google.maps.LatLng(),
	  //htmlStr += "" + myPolygon.getPath().getAt(i).toUrlValue(5);
	}
	document.getElementById('info').innerHTML = htmlStr;
  }
  function copyToClipboard(text) {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }