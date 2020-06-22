<?php require('header.php'); ?>

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
    Pull Force:<input type="number" id="pull" step="0.0000000000000001" class="InputBox">N
    <br/>
    <br/>
    Standard Pull:<input type="number" id="standardPull" step="0.0000000000000001" class="InputBox">N
    <br/>
    <br/>
    Area of Tape:<input type="number" id="area" step="0.0000000000000001" class="InputBox">mm²
    <br/>
    <br/>
    Young's Modulus:<input type="number" id="youngs" step="0.0000000000000001" class="InputBox">
    <br/>
    <br/>
   <hr/>
   <br/>
   <button id="tensionpull" title="Correct for Pull/Tension" class="btn">Calculate</button>
   
   <input type="submit" name="button" id="button1" onclick="clear_box()"
			   value="Clear" title="Click here to clear text fields." class="btn" />
 
               <div class="AnswerBox" id="result"></div>
   <script>
       
       function pull()
       {
           //DECLARING VARIABLE FOR USE IN JS
           var length = Number(document.getElementById('distance').value);
           var pullForce = Number(document.getElementById('pull').value);
           var standardPull = Number(document.getElementById('standardPull').value);
           var area = Number(document.getElementById('area').value);
           var young = Number(document.getElementById('youngs').value);
           
           //FORMULA TO GET THE CORRECTION NOW
           
           var numerator = pullForce - standardPull;
           var denominator = area * young;
           var correction = (numerator/denominator)*length;
           
           var newDist = length + correction;
           
           //DISPLAYING THE OUTPUT TO THE USER 
           (document.getElementById('result').innerHTML = "Pull/Tension Correction = "+correction+"\n\nCorrected New Distance = "+newDist);
       }
       document.getElementById('tensionpull').addEventListener('click',pull);
   </script>
<hr/>

 </div>
   

<?php require('footer.php'); ?>
