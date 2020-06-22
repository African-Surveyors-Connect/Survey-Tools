<?php require('header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>

 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
    <hr/>
    Measured Distance:<br>
    <input type="number" id="distance" step="0.0000000000000001" class="InputBox">m
    <br/>
    <br/>
    Slope Angle:<br>
    <input type="number" id="degrees" placeholder="DDD" min="0" max="359" class="InputBox">&deg; 
    <input type="number" id="minutes" placeholder="MM" min="0" max="59" class="InputBox">'
    <input type="number" id="seconds" placeholder="SS" min="0" max="59" class="InputBox">''
    <br/>
    <br/>
   <hr/>
   <br/>
   <button id="slope" title="Correct for slope" class="btn">Calculate</button>
   

   <input type="submit" name="button" id="button1" onclick="clear_box()"
			   value="Clear" title="Click here to clear text fields." class="btn" />
 
               <div class="AnswerBox" id="result"></div>

   <script>
       
       function slope()
       {
           //CALLING AND DECLARING OF VARIABLES IN JS
           var length = Number(document.getElementById('distance').value);
           var deg = Number(document.getElementById('degrees').value);
           var min = Number(document.getElementById('minutes').value);
           var sec = Number(document.getElementById('seconds').value);
           
           /*var totalSeconds = (minutes*60)+seconds;
  var decPart = totalSeconds / 3600;
  var finalBearing = degrees + decPart;*/
       
           //CONVERTING NOW INTO DECIMAL DEGREE FORMAT
           var totalSeconds = (min*60)+sec;
           var decPart = (totalSeconds / 3600);
           var decDeg = deg + decPart;
           
           //CONVERTING RADIANS TO DEGREES
           var radConstant = 57.29577951;
           var angle = decDeg * radConstant;
           
           //FORMULA TO CALCULATE THE CORRECTION...
           var correction = (1-Math.cos(angle)) * length;
           var newDist = length + correction;
           
           
           (document.getElementById('result').innerHTML = "Slope Correction = "+correction+"\n\nNew Corrected Distance = "+newDist);
           
       }
       document.getElementById('slope').addEventListener('click',slope);
   </script>
<hr/>

 </div>
   

<?php require('footer.php'); ?>
