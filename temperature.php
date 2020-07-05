<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800">Temperature</h1>

 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>

Measured Distance:<input type="number" id="distance" step="0.0000000000000001" class="InputBox" >m
    <br/>
    <br/>
    Field Temperature:<input type="number" id="fieldtemp" step="0.0000000000000001" class="InputBox">&deg;C
    <br/>
    <br/>
    Standard Temperature:<input type="number" id="standardtemp" step="0.0000000000000001" class="InputBox">&deg;C
    <br/>
    <br/>
    Coefficient of expansion:<input type="number" id="expansion" step="0.0000000000000001" class="InputBox">
    <br/>
    <br/>
   <hr/>
   <br/>
   <p>
   <button id="temp" title="Correct for temperature" class="btn">Calculate</button>
   
 
   <input type="submit" name="button" id="button1" onclick="clear_box()"
               value="Clear" title="Click here to clear text fields." class="btn">
               </p>
               <!-- displaying the answer -->
               <p>
               Correction
               <input type="text" id="result" class="InputBox">
               <br>New Distance
               <input type="text" id="newdist" class="InputBox">
             <!--  <div class="AnswerBox" id="result" ></div>-->
             </p>


   <script>
       
      function temperature()
      {
          //CALLING ALL VARIABLES FROM THE HTML BY ID
          var length = Number(document.getElementById('distance').value);
          var fieldTemp = Number(document.getElementById('fieldtemp').value);
          var standardTemp = Number(document.getElementById('standardtemp').value);
          var constant = Number(document.getElementById('expansion').value);
          
          //FORMULA FOR THE TEMPERATURE CORRECTION 
          var correction = constant * (fieldTemp - standardTemp) * length;
          var newDist = length + correction;
          
          //DISPLAYING THE OUTPUT TO THE SCREEN NOW
         
     
     var cor = document.getElementById("result");
     cor.value = correction;

     var new_distance = document.getElementById("newdist");
     new_distance.value = newDist;
     
     }
      document.getElementById('temp').addEventListener('click',temperature);
       
   </script>

 </div>
   
 
<?php require('includes/footer.php'); ?>
