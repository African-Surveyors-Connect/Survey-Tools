<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<h4>Degrees Minutes Seconds</h4>
    <input class="smallbox" type="text" id="degrees" required="true">&deg;
	<input class="smallbox" type="text" id="minutes" required="true">`
	<input class="smallbox" type="text" id="seconds" required="true">``
	<p>   
		<br>
		<!-- error message display start -->
		<div class=" alert-danger" role="alert">
			<strong id="display"></strong>
		</div>
		<!-- error message display end -->
		<br>
    <input type="submit" id="convert_to_decimal" onclick="degreetomin ()" class="btn" 
		 value=" Convert " title="Click here to convert to Decimal Format">
</p>
    <br /><br>
    <br /><br>
    <h4>Decimal Degrees</h4>
    <input type="text" id="decimal_degree" class="InputBox" required="true">&deg;
    <p>
	<br>
	<!-- error message display start -->
	<div class=" alert-danger" role="alert">
			<strong id="display_two"></strong>
		</div>
		<!-- error message display end -->
	<br>
	<input type="submit" id="convert_to_degrees" onclick="Dec ()" class="btn" value="Convert" title="Click here to convert to DMS format">
	
	<script>
		function degreetomin(){
	//getting values from HTML ID field
	var degree = Number(document.getElementById('degrees').value);
	var minute = Number(document.getElementById('minutes').value);
	var second = Number(document.getElementById('seconds').value);
	//initial display message
	var message = "";

	//validation of user input values
	if(degree > 359 || degree < -359){
		 message = "Error! Degrees exceed normal range";
	}
	else if(minute > 59 || minute < 0){
		message = "Error! Minutes exceed normal range";
	}
	else if(second > 59 || second < 0){
		message = "Error! Seconds exceed normal range";
	}
	else{

	//conversion into Decimal Degrees
	var decimal_degree = degree + ((minute * 60) + second) / 3600;
	
	//displaying it in Decimal Box
	var dc = document.getElementById('decimal_degree');
	dc.value = decimal_degree;
	document.getElementById('decimal_degree').focus();
	}

	//warning display
	document.getElementById('display').innerHTML = ""+message;
}

function Dec(){
	//getting values from HTML ID field
	var decimal_degrees = Number(document.getElementById('decimal_degree').value);
	var message = "";

	//validating user input
	if(decimal_degrees > 360){
		message = "Error! Value is above normal range"; 
	}


	//=====================converting to DMS==================================================

		//degrees
	var deg = parseInt(decimal_degrees);

		//minutes
	var initial_min = (decimal_degrees - deg) * 60;
	var min = parseInt(initial_min);

		//seconds
	var sec = (initial_min - min) * 60;

		//displaying it in DMS boxes
	var d = document.getElementById('degrees');
	d.value = deg;
	var m = document.getElementById('minutes');
	m.value = min;
	var s = document.getElementById('seconds');
	s.value = sec;

	document.getElementById('display_two').innerHTML = "";

}

	</script>

 </div>
   

<?php require('includes/footer.php'); ?>
