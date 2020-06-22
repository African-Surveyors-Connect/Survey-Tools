<?php require('header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>

 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
   
 <center>
   <p>
     Measured Distance:<input type="number" id="distance"  class="smallbox">m
   </p>
 
   </center>

 <hr/>
    <br/>
    <br/>
    Field Temperature:<input type="number" id="fieldtemp"  class="smallbox">&deg;C
    <br/>
    <br/>
    Standard Temperature:<input type="number" id="standardtemp"  class="smallbox">&deg;C
    <br/>
    <br/>
    Coefficient of expansion:<input type="number" id="expansion"  class="smallbox">
    <br/>
    <br/>
    Slope Angle:<input type="number" id="deg" placeholder="DDD" min="0" max="359" class="smallbox">&deg;
    <input type="number" id="mins" placeholder="MM" min="0" max="59" class="smallbox">'
    <input type="number" id="sec" placeholder="SS" min="0" max="59" class="smallbox">''
    <br/>
    <br/>
    Mass/Unit Length:<input type="number" id="weight"  class="smallbox">kg/m
    <br/>
    <br/>
    Pulling Force:<input type="number" id="pull"  class="smallbox">N
    <br/>
    <br/>
    Standard Pull:<input type="number" id="standardPull"  class="smallbox">N
    <br/>
    <br/>
    Area of Tape:<input type="Number" id="area"  class="smallbox">mm²;
    <br/>
    <br/>
    Young's Modulus:<input type="number" id="youngs"  class="smallbox">
    <br/>
    <br/>
    Height Above Sea Level:<input type="number" id="height"  class="smallbox">m
   <hr/>
   <br/>
   
  
   <div class="alert-danger" role="alert" id="result"></div>
   
   <center>
   <input type="submit" id="all" title="Correct all" class="btn" value="Calculate">
   <input type="submit" name="button" id="button1" onclick="clear_box()"
			   value="Clear" title="Click here to clear text fields." class="btn" />
 </center>
   <br>
   <br/>
   <br/>
   
   
<hr/>
<script>
       
       
        function all()
      {
          
          //********************************TEMPERATURE********************************
          //CALLING ALL VARIABLES FROM THE HTML BY ID
          var length = Number(document.getElementById('distance').value);
          var fieldTemp = Number(document.getElementById('fieldtemp').value);
          var standardTemp = Number(document.getElementById('standardtemp').value);
          var constant = Number(document.getElementById('expansion').value);
          
          //FORMULA FOR THE TEMPERATURE CORRECTION 
          var Temp_correction = constant * (fieldTemp - standardTemp) * length;
          
         //SEND OUTPUT TO THE TABLE BELOW
         var temperature_correction = document.getElementById('temperature_correction');
         temperature_correction.value = Temp_correction;
          
      //********************************SLOPE********************************
     
           //CALLING AND DECLARING OF VARIABLES IN JS

           var deg = Number(document.getElementById('deg').value);
           var min = Number(document.getElementById('mins').value);
           var sec = Number(document.getElementById('sec').value);

           if(deg > 359 || min > 59 || sec > 59) {
               document.getElementById('result').innerHTML = "Error! Slope input is invalid";
           }
       
           //CONVERTING NOW INTO DECIMAL DEGREE FORMAT
           var totalSeconds = (min*60)+sec;
           var decPart = (totalSeconds / 3600)*0.1;
           var decDeg = (deg + decPart)*0.1;
           
           //CONVERTING RADIANS TO DEGREES
           var radConstant = 57.29577951;
           var angle = decDeg * radConstant;
           
           //FORMULA TO CALCULATE THE CORRECTION...
           var Slope_correction = (1 - Math.cos(angle)) * length;
           
           //SEND OUTPUT TO THE TABLE
           var slope_correction = document.getElementById('slope_correction');
           slope_correction.value = Slope_correction;
           
       //********************************SAG********************************
      
           //DECLARING VARIABLES 
           
           var weight = Number(document.getElementById('weight').value);
           var pullForce = Number(document.getElementById('pull').value);
           
           //FORMULA FOR SAG CORRECTION 
           var numerator = Math.pow(weight,2)*Math.pow(length,3);
           var denominator = 24 * Math.pow(pullForce,2);
           var Sag_correction = numerator / denominator;
           
           //SEND OUTPUT TO THE TABLE
           var sag_correction = document.getElementById('sag_correction');
           sag_correction.value = Sag_correction;
       
       //********************************PULL-TENSION********************************
       
       
           //DECLARING VARIABLE FOR USE IN JS
           
           
           var standardPull = Number(document.getElementById('standardPull').value);
           var area = Number(document.getElementById('area').value);
           var young = Number(document.getElementById('youngs').value);
           
           //FORMULA TO GET THE CORRECTION NOW
           
           var numerator = pullForce - standardPull;
           var denominator = area * young;
           var Tension_correction = (numerator/denominator)*length;
           
           //SEND OUTPUT TO THE TABLE
           var pull_correction = document.getElementById('pull_correction');
           pull_correction.value = Tension_correction;
           
       //********************************MEAN SEA LEVEL********************************
      
           //DECLARING VARIABLES IN JS
          
           var altitude = Number(document.getElementById('height').value);
           
           //FORMULA FOR MEAN SEA LEVEL CORRECTION
           var radius = 6400000;
           var MSL_correction = (length*altitude)/radius;
           
           //SEND OUTPUT TO THE TABLE
           var msl_correction = document.getElementById('msl_correction');
           msl_correction.value = MSL_correction;
    
        
       //*******************************FINAL CORRECTED NEW DISTANCE ***************************************************
       
       var totalCorrection = MSL_correction + Tension_correction + Sag_correction + Slope_correction + Temp_correction;
       var newDistance = length + totalCorrection;
       
       //SEND OUTPUT TO THE TABLE
       var newDist = document.getElementById('corrected_output');
       newDist.value = newDistance;
       
       
    }
       document.getElementById('all').addEventListener('click',all);
      
</script>
<hr/>

<h5>Results:&DownArrow; </h5>
<table border="5" width="" height="">
    <tr width="" height="" style="color:black;">
        <td><b>CORRECTION TYPE</b></td>
        <td><b>CORRECTION VALUE</b></td>
    </tr>
     <tr>
         <td>Temperature</td>
         <td><input type="text" id="temperature_correction" class="InputBox" readonly="true"> </td>
    </tr>
     <tr>
         <td>Slope</td>
         <td> <input type="text" id="slope_correction" class="InputBox" readonly="true"> </td>
    </tr>
     <tr>
         <td>Sag</td>
         <td> <input type="text" id="sag_correction" class="InputBox" readonly="true"> </td>
    </tr>
     <tr>
         <td>Pull</td>
         <td> <input type="text" id="pull_correction" class="InputBox" readonly="true"> </td>
    </tr>
     <tr>
         <td>Mean Sea Level</td>
         <td> <input type="text" id="msl_correction" class="InputBox" readonly="true"> </td>
    </tr>
     <tr>
         <td colspan="2" >New Corrected Distance = <input type="text" name="corrected_output" id="corrected_output"  class="InputBox" readonly="true" /></td>
    </tr>
    
</table>
 

<hr>

 </div>
   

<?php require('footer.php'); ?>
