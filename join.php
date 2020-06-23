<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<h3>Starting Point</h3>
    <input type="text" id="startName" class="InputBox">
    <br>
    <br>
    Y-coordinate
    <input class="InputBox" type="text" id="yStart" class="number-only" step="0.0000000001" required="true">
    X-coordinate
    <input class="InputBox" type="text" id="xStart" class="number-only" step="0.000000001" required="true">
    <br /><br>
    <h3>Ending Point</h3>
    <input type="text" id="endName" class="InputBox">
    <br>
    <br>
    Y-coordinate
    <input class="InputBox" type="text" id="yEnd" class="number-only" step="0.0000000001">
    X-coordinate
    <input class="InputBox" type="text" id="xEnd" class="number-only" step="0.0000000001">
    <br />
    <br />
    <input type="submit" id="calculate" onclick="polar ()" class="btn" 
         value=" Compute " title="Click here to find the Distance and Direction">
    <input type="submit" id="Sequential" onclick="Sequential ()" class="btn" 
         value=" Sequential " title="Click to make the next calculation">
    <input type="submit" id="Radial" onclick="Radial ()" class="btn" 
         value=" Radial " title="Click here to make a radial join">
    <br /><br>
    <br /><br>
    Distance
    <input type="number" id="distance"  readonly="true" class="InputBox" step="0.0000000001"/>m
    <br>
    <br>
    Direction
    <input type="number" id="deg"  readonly="true" class="InputBox">&deg;
    <input type="number" id="mm" readonly="true" class="InputBox">'
    <input type="number" id="ss" readonly="true" class="InputBox">''
    <br /><br>
    
        

         <!-- THE JAVASCRIPT FILES THAT CONSIST OF THE BACK-END OF THE PROGRAM -->   
            <script>
                
           
//************************THE CALCULATING PART*******************************************                

function polar()
{

    var x = Number(document.getElementById('xStart').value);
    var y = Number(document.getElementById('yStart').value);
    var x2 = Number(document.getElementById('xEnd').value);
    var y2 = Number(document.getElementById('yEnd').value);
    var startName1 = Number(document.getElementById('startName').value);
    var endName1 = Number(document.getElementById('endName').value);
    var x_difference = x2-x;
    var y_difference = y2-y;
    var join = Math.sqrt(Math.pow(y_difference , 2) + Math.pow(x_difference , 2));

    //DISPLAYING THE DISTANCE AS OUTPUT
    var distance = document.getElementById('distance');
    distance.value = join;
    
    //****************************DEALING WITH DIRECTION NOW************************************

    var radBearing = Math.atan(y_difference/x_difference);
     /*introduce a constant for rad to degrees which is 57.29577951
         * this constant multiples the rad answer and converts it into decimal degrees
         */
        var radConstant = 57.29577951;
      
        var bearing = radBearing*radConstant;
        var bearingFinal;
        
        
        //converting Decimal degrees into D.M.S
        //these are the declared variables for later conversion use in the program
        
        var Degrees ;
        var unroundedMinutes;
        
        var Minutes;
        var Seconds ;
        var roundedSeconds;
        
        //cater for special conditions first 
        if(y_difference < 0 && x_difference == 0)
        {
            var specialDegrees = 270;
            var specialMinutes = 00;
            var specialroundedSeconds = 00;
            
            var deg = document.getElementById('deg');
            deg.value = specialDegrees;

            var mm = document.getElementById('mm');
            mm.value = specialMinutes;

            var ss = document.getElementById('ss');
            ss.value = specialroundedSeconds;
        }
        else if(y_difference == 0 && x_difference < 0)
        {
            var specialDegrees = 180;
            var specialMinutes = 00;
            var specialroundedSeconds = 00;
            
            var deg = document.getElementById('deg');
            deg.value = specialDegrees;

            var mm = document.getElementById('mm');
            mm.value = specialMinutes;

            var ss = document.getElementById('ss');
            ss.value = specialroundedSeconds;
        }
        //end of cater for special condtions
        //return to normal condtions for polar
        else
        {
        
         if(y_difference>0 && x_difference<0)
         //SECOND QUADRANT 
        {
             bearingFinal=bearing+180;
              Degrees = Math.floor(bearingFinal);
             unroundedMinutes = (bearingFinal - Degrees)*60;
             Minutes = Math.floor(unroundedMinutes);
             Seconds = (unroundedMinutes - Minutes)*60;
             roundedSeconds = Math.ceil(Seconds);
            
            //DISPLAYING OUTPUT IN THE BOX
            var deg = document.getElementById('deg');
            deg.value = Degrees;

            var mm = document.getElementById('mm');
            mm.value = Minutes;

            var ss = document.getElementById('ss');
            ss.value = roundedSeconds;


        }
        else if(y_difference<0 && x_difference<0)
        //THIRD QUADRANT
        {
             bearingFinal=bearing+180;
              Degrees = Math.floor(bearingFinal);
             unroundedMinutes = (bearingFinal - Degrees)*60;
             Minutes = Math.floor(unroundedMinutes);
             Seconds = (unroundedMinutes - Minutes)*60;
             roundedSeconds = Math.ceil(Seconds);       
             
            //DISPLAYING THE OUTPUT IN THE BOX
            var deg = document.getElementById('deg');
            deg.value = Degrees;

            var mm = document.getElementById('mm');
            mm.value = Minutes;

            var ss = document.getElementById('ss');
            ss.value = roundedSeconds;


        }
        
        else if(y_difference<0 && x_difference>0)
        //FOURTH QUADRANT
        {
             bearingFinal=bearing+360;
             Degrees = Math.floor(bearingFinal);
             unroundedMinutes = (bearingFinal - Degrees)*60; 
             Minutes = Math.floor(unroundedMinutes);
             Seconds = (unroundedMinutes - Minutes)*60;
             roundedSeconds = Math.ceil(Seconds);
            
            //DISPLAYING THE OUTPUT IN THE BOX
            var deg = document.getElementById('deg');
            deg.value = Degrees;

            var mm = document.getElementById('mm');
            mm.value = Minutes;

            var ss = document.getElementById('ss');
            ss.value = roundedSeconds;


        }
        else 
        //FIRST QUADRANT
                    
        {
             Degrees = Math.floor(bearing);
             unroundedMinutes = (bearing - Degrees)*60;
             Minutes = Math.floor(unroundedMinutes);
             Seconds = (unroundedMinutes - Minutes)*60;
             roundedSeconds = Math.ceil(Seconds);

             if(Minutes > 59 || roundedSeconds > 59)
             {
              Degrees = Degrees+1;
              Minutes = Minutes-60;

              Minutes = Minutes+1
              roundedSeconds = roundedSeconds-60;
             }
             
            
            //DISPLAYING THE OUTPUT IN THE BOX
            var deg = document.getElementById('deg');
            deg.value = Degrees;

            var mm = document.getElementById('mm');
            mm.value = Minutes;

            var ss = document.getElementById('ss');
            ss.value = roundedSeconds;


        }
    }

  
 }
document.getElementById('calculate').addEventListener('click', polar); 


//*********************WHEN THE USER IS DONE CALCULATING AND NOW WANTS TO LEAVE THE WEB APPLICATION ***********************************
function quit()
{
    var result = confirm("Thank you for using Surveyor Jr Web-Applications\n\nAre you sure you want to leave?");
    if(result==true)
    {
        /*function closeWin() {
  myWindow.close(); */
    }
    else
    {
        
    }

}
//*****************************WHEN THE USER CLICKS THE SEQUENTIAL BUTTON****************************
function Sequential()
{

    document.getElementById("yStart").value = document.getElementById("yEnd").value;
    document.getElementById("xStart").value = document.getElementById("xEnd").value;
    document.getElementById("startName").value = document.getElementById("endName").value;
    document.getElementById("yEnd").value = "";
    document.getElementById("xEnd").value = "";
    document.getElementById("endName").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("deg").value = "";
    document.getElementById("mm").value = "";
    document.getElementById("ss").value = "";
    document.getElementById("yEnd").focus();
    document.getElementById("xEnd").focus();

}
//*****************************WHEN THE USER CLICKS THE RADIAL BUTTON*********************************
function Radial()
{

    document.getElementById("yEnd").value = "";
    document.getElementById("xEnd").value = "";
    document.getElementById("endName").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("deg").value = "";
    document.getElementById("mm").value = "";
    document.getElementById("ss").value = "";
    document.getElementById("yEnd").focus();
    document.getElementById("xEnd").focus();

}
    
  </script>

 </div>
   

<?php require('includes/footer.php'); ?>
