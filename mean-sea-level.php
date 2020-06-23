<?php require('includes/header.php');

 ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
<div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
    <hr/>
    Measured Distance:<input type="number" id="distance" step="0.0000000000000001" class="InputBox">m
    <br/>
    <br/>
    Height above Sea Level:<input type="number" id="height" step="0.0000000000000001" class="InputBox">m
    <br/>
    <br/>
   <hr/>
   <br/>
   <button id="msl" title="Correct for Mean Sea Level" class="btn">Calculate</button>
   
   <input type="submit" name="button" id="button1" onclick="clear_box()"
			   value="Clear" title="Click here to clear text fields." class="btn" />
 
               <div class="AnswerBox" id="result"></div>
   
   <script>
       
       function MSL()
       {
           //DECLARING VARIABLES IN JS
           var length = Number(document.getElementById('distance').value);
           var altitude = Number(document.getElementById('height').value);
           
           //FORMULA FOR MEAN SEA LEVEL CORRECTION
           var radius = 6400000;
           var correction = (length*altitude)/radius;
           
           var newDist = length + correction;
           
           //DISPLAY OUTPUT TO THE USER
           (document.getElementById('result').innerHTML = "Mean Sea Level Correction = "+correction+"\n\nNew Corrected Distance = "+newDist);
           
       }
       document.getElementById('msl').addEventListener('click',MSL);
       
   </script>
<hr/>

 </div>
   

<?php require('includes/footer.php'); ?>
