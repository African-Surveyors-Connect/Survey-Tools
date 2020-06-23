<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<div class="alert alert-warning" role="alert" style="text-align:center;">
	 <h4 class="alert-heading">Under Construction</h4> <i class="fas fa-toolbox"></i>
	 If you'd like to contribute kindly visit the <a href="https://github.com/African-Surveyors-Connect/Survey-Tools/">GitHub Repository</a> <i class="fas fa-grin-tongue-wink    "></i>
 </div>

 <h4>Station A</h4>
    <br>
    Y-coordinate
    <input class="InputBox" type="text" id="y_a" class="number-only" step="0.0000000001" required="true">
    X-coordinate
    <input class="InputBox" type="text" id="x_a" class="number-only" step="0.000000001" required="true">
    <br /><br>
    <h4>Station B</h4>
    <br>
    Y-coordinate
    <input class="InputBox" type="text" id="y_b" class="number-only" step="0.0000000001">
    X-coordinate
    <input class="InputBox" type="text" id="x_b" class="number-only" step="0.0000000001">
    <br />
    <br />
	<h4>Station C</h4>
    <br>
    Y-coordinate
    <input class="InputBox" type="text" id="y_c" class="number-only" step="0.0000000001">
    X-coordinate
    <input class="InputBox" type="text" id="x_c" class="number-only" step="0.0000000001">
    <br />
    <br />
	<h4>Angles</h4>
	<br>
	<p>
	&alpha; 
	<input class="smallbox" type="text" id="deg_alpha">&deg;
	<input class="smallbox" type="text" id="min_alpha">'
	<input class="smallbox" type="text" id="sec_alpha">''
	</p>
	<p>
	&beta;
	<input class="smallbox" type="text" id="deg_beta">&deg;
	<input class="smallbox" type="text" id="min_beta">'
	<input class="smallbox" type="text" id="sec_beta">''
	</p>
	&gamma;
	<input class="smallbox" type="text" id="deg_gamma">&deg;
	<input class="smallbox" type="text" id="min_gamma">'
	<input class="smallbox" type="text" id="sec_gamma">''
	</p>
    <div id="error" class="error"></div>
    <input type="submit" id="calculate" onclick="resection ()" class="btn" 
         value="Calculate">
    
    <br/><br>
    <br/><br>
    <h4>Set-up Station</h4>
	<br>
	Y-coordinate
    <input type="text" id="y"  readonly="true" class="InputBox" step="0.0000000001"/>
	X-coordinate
	<input type="text" id="x"  readonly="true" class="InputBox" step="0.0000000001"/>

  <script>

  function resection() {

      //getting coordinates from user based input
      var a_y = Number(document.getElementById('y_a').value);
      var a_x = Number(document.getElementById('x_a').value);

      var b_y = Number(document.getElementById('y_b').value);
      var b_x = Number(document.getElementById('x_b').value);

      var c_y = Number(document.getElementById('y_c').value);
      var c_x = Number(document.getElementById('x_c').value);  

      //getting the angles from user based input
      var deg_alpha = Number(document.getElementById('deg_alpha').value);
      var min_alpha = Number(document.getElementById('min_alpha').value);
      var sec_alpha = Number(document.getElementById('sec_alpha').value); 

      var deg_beta = Number(document.getElementById('deg_beta').value);
      var min_beta = Number(document.getElementById('min_beta').value);
      var sec_beta = Number(document.getElementById('sec_beta').value);  

      var deg_gamma = Number(document.getElementById('deg_gamma').value);
      var min_gamma = Number(document.getElementById('min_gamma').value);
      var sec_gamma = Number(document.getElementById('sec_gamma').value); 

      //defining the rad-constant 
      var rad_constant = 180/Math.PI;

      //converting DMS into Decimal degrees
      var alpha = deg_alpha + ((min_alpha * 60) + sec_alpha) / 3600;
      var beta = deg_beta + ((min_beta * 60) + sec_beta) / 3600;
      var gamma = deg_gamma + ((min_gamma * 60) + sec_gamma) / 3600;

      //converting into radians format 
      var rad_alpha = alpha * rad_constant;
      var rad_beta = beta * rad_constant;
      var rad_gamma = gamma * rad_constant;

      //to be continued....
  }
  </script>

 </div>
   

<?php require('includes/footer.php'); ?>
