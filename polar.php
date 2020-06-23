<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<p>
            Y: <input type="number" id="inputCoordinateY" class="InputBox"> 
            
            X: <input type="number" id="inputCoordinateX" class="InputBox">
          </p>
          <br>
          <p>
            Bearing 
            <input type="number" id="deg" placeholder="DD" class="smallbox">&deg;
            <input type="number" id="mm" placeholder="MM" class="smallbox">`
            <input type="number" id="ss" placeholder="SS" class="smallbox">``
          </p>
          <br>
          <p>Distance <input type="number" id="distance" class="InputBox">m</p>
          <p>
              <button id="compute" class="btn" title="Click here to get new Coordinates"><b>COMPUTE</b></button>
              <!-- error displaying -->
              <div id="error" class="error"></div>
              <p>
              <input type="button" value="Radial" onclick="radial()" class="btn">
              <input type="button" value="Sequential" onclick="sequential()" class="btn">
             </p>
          </p>
          <br>
  <hr>
  <p>
    Y-coordinate<input type="number" id="outputCoordinateY" class="InputBox" readonly="true">
    X-coordinate<input type="number" id="outputCoordinateX" class="InputBox" readonly="true">
  </p>
   
   
  
         <!-- THE JAVASCRIPT FILES THAT CONSIST OF THE BACK-END OF THE PROGRAM -->   
            <script>
                
           
//************************THE CALCULATING PART*******************************************                
function polar()
{
               //converting variables from HTML form into JS format
               var y = Number(document.getElementById('inputCoordinateY').value);
               var x = Number(document.getElementById('inputCoordinateX').value);
               var distance = Number(document.getElementById('distance').value);
               var degrees = Number(document.getElementById('deg').value);
               var minutes = Number(document.getElementById('mm').value);
               var seconds = Number(document.getElementById('ss').value);
          
         //VALIDATING THE USER INPUT AND ERROR HANDLING 
         if(degrees > 359 || degrees < 0)
         {
             document.getElementById('error').innerHTML = "Error! Value for Degrees is out of range";
         }
         else if(minutes > 59 || minutes < 0)
         {
            document.getElementById('error').innerHTML = "Error! Value for Minutes is out of normal range";
         }
         else if(seconds > 59 || seconds < 0)
         {
            document.getElementById('error').innerHTML = "Error! Value for Seconds is out of normal range";
         }
         else
         {

             //CONVERTING D.M.S INTO DECIMAL DEGREES
             var totalSeconds = (minutes*60)+seconds;
             var decPart = totalSeconds / 3600;
             var finalBearing = degrees + decPart;

             //CALLING THE PI FUNCTION FROM MATHEMATICS LIBRARY
             var PI = Math.PI;
             //converting radians into degrees format
             var radBearing = finalBearing * PI/180;

             //FINAL STAGE TO COME UP WITH THE NEW COORDINATES USING THE FORMULA
             var Y_unknown = y + (distance * Math.sin(radBearing));
             var X_unknown = x + (distance * Math.sin(radBearing));

              var yOutput = document.getElementById('outputCoordinateY');
              yOutput.value = Y_unknown; 

              var xOutput = document.getElementById('outputCoordinateX');
              xOutput.value = X_unknown;
          }
}
document.getElementById('compute').addEventListener('click', polar); 

//***************************WHEN THE USER CLICKS ON THE RADIAL BUTTON TO PERFORM A RADIAL POLAR**************************
function radial()
{
    document.getElementById('distance').value = "";
    document.getElementById('deg').value = "";
    document.getElementById('mm').value = "";
    document.getElementById('ss').value = "";
    document.getElementById('outputCoordinateY').value = "";
    document.getElementById('outputCoordinateX').value = "";
    document.getElementById('pointB').value = "";
    document.getElementById('distance').focus();
    document.getElementById('deg').focus();
    document.getElementById('mm').focus();
    document.getElementById('ss').focus();
    
}

//*******************WHEN THE USER CLICKS ON THE SEQUENTIAL BUTTON IN ORDER TO ENTER NEW SET OF POINTS, DIRECTION AND DISTANCE*********************
function sequential()
{
    document.getElementById('distance').value = "";
    document.getElementById('deg').value = "";
    document.getElementById('mm').value = "";
    document.getElementById('ss').value = "";
    document.getElementById('inputCoordinateY').value = document.getElementById('outputCoordinateY').value;
    document.getElementById('inputCoordinateX').value = document.getElementById('outputCoordinateX').value;
    document.getElementById('outputCoordinateY').value = "";
    document.getElementById('outputCoordinateX').value = "";
    document.getElementById('pointA').value = document.getElementById('pointB').value;
    document.getElementById('inputCoordinateY').focus();
    document.getElementById('inputCoordinateX').focus();
}

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

                
                
            </script>

 </div>
   

<?php require('includes/footer.php'); ?>
