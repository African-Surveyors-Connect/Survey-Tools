<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800">Sag</h1>

 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
    <hr/>
    Measured Distance:<input type="number" id="distance" step="0.0000000000000001" class="InputBox">m
    <br/>
    <br/>
    Mass/Unit Length:<input type="number" id="weight" step="0.0000000000000001" class="InputBox">kg/m
    <br/>
    <br/>
    Pulling Force:<input type="number" id="pull" step="0.0000000000000001" class="InputBox">N
    <br/>
    <br/>
   <hr/>
   <br/>
   <div class="row">
   <button id="sag" title="Correct for sag" class="btn">Calculate</button>
   
   <input type="submit" name="button" id="button1" onclick="clear_box()"
               value="Clear" title="Click here to clear text fields." class="btn" />
</div>

<div class="AnswerBox" id="result"></div>

   
   <script>
       
       function sag()
       {
           //DECLARING VARIABLES 
           var length = Number(document.getElementById('distance').value);
           var weight = Number(document.getElementById('weight').value);
           var pullForce = Number(document.getElementById('pull').value);
           
           //FORMULA FOR SAG CORRECTION 
           var numerator = Math.pow(weight,2)*Math.pow(length,3);
           var denominator = 24 * Math.pow(pullForce,2);
           var correction = numerator / denominator;
           
          var newDist = length + correction;
           
           //DISPLAYING THE RESULTS ON THE SCREEN
           (document.getElementById('result').innerHTML = "Sag Correction = "+correction+"\n\nCorrected New Distance = "+newDist);
       }
       document.getElementById('sag').addEventListener('click',sag);
   </script>
<hr/>

 </div>
   

<?php require('includes/footer.php'); ?>
