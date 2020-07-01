<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800">Get Coordinates From the Polygon Corners</h1>
 
<div class="alert alert-warning" role="alert" style="text-align:center;">
	 If you'd like to contribute kindly visit the <a href="https://github.com/African-Surveyors-Connect/Survey-Tools/">GitHub Repository</a> <i class="fab fa-github"></i>
 </div>

 <body onload="initialize()">
  <h3>Drag or re-shape for coordinates to display below</h3>
  <div id="map-canvas"></div>
  <div class="lngLat"><span class="one">Lat</span><span class="two">,Lng</span></div>
  <button id="clipboard-btn" onclick="copyToClipboard(document.getElementById('info').innerHTML)">Copy to Clipboard</button>
  <textarea id="info"></textarea>

  <script src='https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false'></script>
  <script src="js/index.js"></script>

</body>

 </div>
   

<?php require('includes/footer.php'); ?>
