<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<h4>Convert -</h4>
	<div class="form-group">
	  <label for="from_from_unit">From</label>
	  <select name="from" id="from" class="InputBox">
	  <option id="select" value="0">-----Select-----</option>
		<option id="mm" value="1">Millimeters (mm)</option>
		<option id="cm" value="2">Centimeters (cm)</option>
		<option id="m" value="3">Meters (m)</option>
		<option id="km" value="4">Kilometers (km)</option>
		<option id="mi" value="5">Miles (Mi)</option>
		<option id="in" value="6">Inch (in)</option>
		<option id="yd" value="7">Yard (yd)</option>
		<option id="ft" value="8">Feet (ft)</option>

	  </select>
	</div>

    <input class="InputBox" type="text" id="x" required="true">
	<br><br>
	<div class="form-group">
	  <label for="to_from_unit">To</label>
	  <select name="to" id="to" class="InputBox">
	  <option id="select" value="0">-----Select-----</option>
		<option id="mm" value="1">Millimeters (mm)</option>
		<option id="cm" value="2">Centimeters (cm)</option>
		<option id="m" value="3">Meters (m)</option>
		<option id="km" value="4">Kilometers (km)</option>
		<option id="mi" value="5">Miles (Mi)</option>
		<option id="in" value="6">Inch (in)</option>
		<option id="yd" value="7">Yard (yd)</option>
		<option id="ft" value="8">Feet (ft)</option>

	  </select>
	</div>
	<p>
	<input class="InputBox" type="text" id="result" readonly="true">
	</p>
	<p>   
		<br>
		<!-- error message display start -->
		<div class=" alert-danger" role="alert">
			<strong id="display"></strong>
		</div>
		<!-- error message display end -->
		<br>
    <input type="submit" id="convert" onclick="convert ()" class="btn" 
		 value=" Convert " title="Click to convert">
</p>

<script>
	function convert(){
		//getting value to be converted (x)
		var x = Number(document.getElementById('x').value);

		//declaring output variable
		var r = "";

		//getting input [from] selection 
		var u = document.getElementById('from');
		var from_unit = u.options[u.selectedIndex].value;

		//getting input [to] selection
		var t = document.getElementById('to');
		var to_unit = t.options[t.selectedIndex].value;
		
		//setting conditions for the selected values in [from]
		if(from_unit == 1){
			//==>checking second conditions
			if (to_unit == 1) {
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 2){
				r = x*0.1;
			}
			else if(to_unit == 3){
				r = x*0.001;
			}
			else if(to_unit == 4){
				r = x*0.000001;
			}
			else if(to_unit == 5){
				r = x*0.000000621;
			}
			else if(to_unit == 6){
				r = x*0.0393701;
			}
			else if(to_unit == 7){
				r = x*0.00109361;
			}
			else if(to_unit == 8){
				r = x*0.00328084;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 2){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*10;
			}
			else if(to_unit == 2){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 3){
				r = x*0.01;
			}
			else if(to_unit == 4){
				r = x*0.00001;
			}
			else if(to_unit == 5){
				r = x*0.0000062137;
			}
			else if(to_unit == 6){
				r = x*0.393701;
			}
			else if(to_unit == 7){
				r = x*0.0109361;
			}
			else if(to_unit == 8){
				r = x*0.0328084;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 3){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*1000;
			}
			else if(to_unit == 2){
				r = x*100;
			}
			else if(to_unit == 3){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 4){
				r = x*0.001;
			}
			else if(to_unit == 5){
				r = x*0.00062137;
			}
			else if(to_unit == 6){
				r = x*39.3701;
			}
			else if(to_unit == 7){
				r = x*1.09361;
			}
			else if(to_unit == 8){
				r = x*3.28084;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 4){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*1000000;
			}
			else if(to_unit == 2){
				r = x*100000;
			}
			else if(to_unit == 3){
				r = x*1000;
			}
			else if(to_unit == 4){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 5){
				r = x*0.621371;
			}
			else if(to_unit == 6){
				r = x*39370.1;
			}
			else if(to_unit == 7){
				r = x*1093.61;
			}
			else if(to_unit == 8){
				r = x*3280.84;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 5){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*0.000001609;
			}
			else if(to_unit == 2){
				r = x*160934;
			}
			else if(to_unit == 3){
				r = x*1609.34;
			}
			else if(to_unit == 4){
				r = x*1.609;
			}
			else if(to_unit == 5){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 6){
				r = x*63360;
			}
			else if(to_unit == 7){
				r = x*1760;
			}
			else if(to_unit == 8){
				r = x*5280;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 6){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*25.4;
			}
			else if(to_unit == 2){
				r = x*2.54;
			}
			else if(to_unit == 3){
				r = x*0.0254;
			}
			else if(to_unit == 4){
				r = x*0.0000254;
			}
			else if(to_unit == 5){
				r = x*0.000015783;
			}
			else if(to_unit == 6){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 7){
				r = x*0.0277778;
			}
			else if(to_unit == 8){
				r = x*0.0833333;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unit == 7){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*914.4;
			}
			else if(to_unit == 2){
				r = x*91.44;
			}
			else if(to_unit == 3){
				r = x*0.9144;
			}
			else if(to_unit == 4){
				r = x*0.0009144;
			}
			else if(to_unit == 5){
				r = x*0.000568182;
			}
			else if(to_unit == 6){
				r = x*36;
			}
			else if(to_unit == 7){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else if(to_unit == 8){
				r = x*3;
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else if(from_unity == 8){
			//==>checking second conditions
			if (to_unit == 1) {
				r = x*304.8;
			}
			else if(to_unit == 2){
				r = x*30.48;
			}
			else if(to_unit == 3){
				r = x*0.3048;
			}
			else if(to_unit == 4){
				r = x*0.0003048;
			}
			else if(to_unit == 5){
				r = x*0.000189394;
			}
			else if(to_unit == 6){
				r = x*12;
			}
			else if(to_unit == 7){
				r = x*0.33333;
			}
			else if(to_unit == 8){
				document.getElementById('display').innerHTML = "Error! Identical metric units. Cannot perform action";
			}
			else{
				document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
			}
		}
		else{
			document.getElementById('display').innerHTML = "Error! Please select a metric from_unit";
		}

		var output = document.getElementById('result');
		output.value = r;
	}
	/*==================== to add the following metrics =====================================
	***Nautical Mile
	***Nanometer
	***Micrometer
	===========================================================================================*/
	
	
</script>


 </div>
   

<?php require('includes/footer.php'); ?>
