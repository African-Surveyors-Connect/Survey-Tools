<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
<b>Coordinates of ST1</b><br>
Y-coordinate
<input type="number" id="y1" required="true" step="0.000001" class="InputBox">
X-coordinate
<input type="number" id="x1" required="true" step="0.000001" class="InputBox" >
<br><br><br>
<center><b>Coordinates of ST2</b></center>
Y-coordinate
<input type="number" id="y2" required="true" step="0.000001" class="InputBox">
X-coordinate
<input type="number" id="x2" required="true" step="0.000001"  class="InputBox">
<br><br><br>
Angles/True Direction?
<select class="InputBox">
    <option>select</option>
    <option id="angle" value="angle">Angles</option>
    <option id="direction" value="direction">True Direction</option>
</select>
<br><br><br>
<h3>AT FIRST SETUP STATION</h3>

 Observed direction to ST2<br>
                    <input type="number" id="degree_known1" required="true" class="number-only" max="359" min="0">&deg;
                    <input type="number" id="minute_known1" required="true" class="number-only" max="59" min="0">'
                    <input type="number" id="second_known1" required="true" class="number-only" max="59" min="0">''
  <br><br>          
                
Observed direction to intersection point (P)<br>
                    <input type="number" id="degree_unknown1" required="true" class="number-only" min="0" max="359">&deg;
                    <input type="number" id="minute_unknown1" required="true" class="number-only" min="0" max="59">'
                    <input type="number" id="second_unknown1" required="true" class="number-only" min="0" max="59">''
  <br><br><br>
  <h3>AT SECOND SETUP STATION</h3>

   Observed direction to ST1<br>
                    <input type="number" id="degree_known2" required="true" class="number-only" max="359" min="0">&deg;
                    <input type="number" id="minute_known2" required="true" class="number-only" max="59" min="0">'
                    <input type="number" id="second_known2" required="true" class="number-only" max="59" min="0">''
  <br><br>          
                
Observed direction to intersection point (P)<br>
                    <input type="number" id="degree_unknown2" required="true" class="number-only" min="0" max="359">&deg;
                    <input type="number" id="minute_unknown2" required="true" class="number-only" min="0" max="59">'
                    <input type="number" id="second_unknown2" required="true" class="number-only" min="0" max="59">''
  <br><br><br>


  <center> 
  <input type="submit" id="compute" value="COMPUTE" onclick="Intersection ()" class="btn" style="font-family: sans-serif"> 
  </center>  
  <br><br><br>
  <center>
  <h4><b>Intersection Point Coordinates</b></h4>
</center>
  <br><br>
  Y-coordinate
  <input type="number" id="Yp" readonly="true" class="InputBox" title="Y-coordinate of the intersection point is displayed here">
  X-coordinate
  <input type="number" id="Xp" readonly="true" class="InputBox" title="X-coordinate of the intersection point is displayed here"> 
</center>

  <!-- THE CALCULATING PART NOW COMES HERE-->
    <script type="text/javascript">

        function Intersection()
        {
            //INPUT FROM CORRDINATES
           var Ya = Number(document.getElementById('y1').value);
            var Xa = Number(document.getElementById('x1').value);
            var Yb = Number(document.getElementById('y2').value);
            var Xb = Number(document.getElementById('x2').value);

            //INPUT FROM DROPDOWN BAR
           // var angles = document.getElementById("angle");
           // var result = angles.options[angles.selectedIndex].value;

           // var directions = document.getElementById("direction");
           // var result2 = directions.options[directions.selectedIndex].value;

            
            //INPUT FROM OBSERVED DIRECTION AND ANGLES

            //1st set-up station


            //to the known point
            var dKnown1 = Number(document.getElementById('degree_known1').value);
            var mKnown1 = Number(document.getElementById('minute_known1').value);
            var sKnown1 = Number(document.getElementById('second_known1').value);

            //to the unknown intersection point now
            var dUnknown1 = Number(document.getElementById('degree_unknown1').value);
            var mUnknown1 = Number(document.getElementById('minute_unknown1').value);
            var sUnknown1 = Number(document.getElementById('second_unknown1').value);


            //2nd set-up station


            //to the known point
            var dKnown2 = Number(document.getElementById('degree_known2').value);
            var mKnown2 = Number(document.getElementById('minute_known2').value);
            var sKnown2 = Number(document.getElementById('second_known2').value);

            //to the unknown intersection point now
            var dUnknown2 = Number(document.getElementById('degree_unknown2').value);
            var mUnknown2 = Number(document.getElementById('minute_unknown2').value);
            var sUnknown2 = Number(document.getElementById('second_unknown2').value);



            //CALCULATING JOIN FROM A TO B
            var deltaY = Yb - Ya;
            var deltaX = Xb - Xa;
            var distanceAB = Math.sqrt( Math.pow(deltaY, 2) + Math.pow(deltaX, 2) );

            //dealing with the bearing now
            var bearing = Math.tan(deltaY/deltaX);
            var radConstant = 57.29577951;
            var radBearing = bearing * radConstant;

            //need to accomodate for special conditions
            if(deltaY < 0 && deltaX == 0)
        {
            var direction = 270.0000;            
            
        }
        else if(deltaY == 0 && deltaX < 0)
        {
            var direction = 180.0000;

        }
        
//================THE PROBLEM STARTS HERE THERE IS NEED TO CORRECT THESE CONDTIONS AND MAKE SURE THEY EXECUTE WELL ENOUGH ====================

        //accomodate for normal conditions for polar
        
        
         else if(deltaY>0 && deltaX<0)
         //SECOND QUADRANT 
        {
            var direction = radBearing + 180.000;
             
        }
        else if(deltaY<0 && deltaX<0)
        //THIRD QUADRANT
        {
            var direction = radBearing + 180.000;

        }
        
        else if(deltaY<0 && deltaX>0)
        //FOURTH QUADRANT
        {
            var direction = radBearing + 360.000;
             
        }
        else 
        //FIRST QUADRANT
                    
        {
            var direction = radBearing;
             
        }
        

        //CALCULATING ANGLES NOW

        // #1st set-up (gives angle alpha)

        //converting DMS into Decimal degrees #to known point
        var decimal_known1 = (mKnown1 / 60) + (sKnown1/3600);
        var dec_deg_known1 = dKnown1 + decimal_known1;

        //converting DMS into Decimal degrees #to unknown point
        var decimal_unknown1 = (mUnknown1 / 60) + (sUnknown1/3600);
        var dec_deg_unknown1 = dUnknown1 + decimal_unknown1;

        //the angle between the known point and the unknown point 
        var angle_A = dec_deg_known1 - dec_deg_unknown1;

        //checking conditions if angle is negative

        if (angle_A < 0 ) 
        {
            angle_A = angle_A * (-1);
        }
        else
        {
            angle_A = angle_A;
        }

         
        // #2nd set-up (gives angle beta)

        //converting DMS into Decimal degrees #to known point
        var decimal_known2 = (mKnown2 / 60) + (sKnown2/3600);
        var dec_deg_known2 = dKnown2 + decimal_known2;

        //converting DMS into Decimal degrees #to unknown point
        var decimal_unknown2 = (mUnknown2 / 60) + (sUnknown2/3600);
        var dec_deg_unknown2 = dUnknown2 + decimal_unknown2;

        //the angle between the known point and the unknown point
        var angle_B = dec_deg_known2 - dec_deg_unknown2;

        //checking conditions if angle is negative

        if(angle_B < 0 )
        {
            angle_B = angle_B * (-1);
        }
        else
        {
            angle_B = angle_B;
        }

       

        //getting angle gamma the 3rd angle of the triangle
        var angle_G = 180 - (angle_A + angle_B);


        //CALCULATING THE DISTANCE BETWEEN 1ST SET-UP AND INTERSECTION POINT USING THE SINE RULE'

        // #start by calling PI function
        var PI = Math.PI;
        // #converting radians into degrees
        var radAngle_A = angle_B * (PI/180.00);
        // #converting radians into degrees
        var radG = angle_G * (PI/180.00);
        // #finally getting the distance now
        var distanceAP = (distanceAB / Math.sin(radG)) * Math.sin(radAngle_A);
        


       

        //CALCULATING THE DIRECTION FROM 1st SET-UP TO INTERSECTION POINT
        var directionAP = direction + angle_A;



        //FINALLY CALCULATING THE COORDINATES OF THE INTERSECTION POINT NOW

        // #converting radians into degrees
        var rad_directionAP = directionAP * (PI/180.00);

        // #getting the coordinates now

        var Yp = Ya + distanceAP * Math.sin(rad_directionAP);
        var Xp = Xa + distanceAP * Math.cos(rad_directionAP);

         //testing one-two
        // alert("distance = "+distanceAB+"\nbearing ="+direction+"\n\n@1st Set-up\n\nAngle differece ="+angle_A+"\nconverted to known="+dec_deg_known1+"\n\n@2nd Set-up\n\nAngle difference ="+angle_B+"\nconverted to known="+dec_deg_known2+"\n\nAngle Gamma="+angle_G+"\n\nDistance btwn ST1 & P="+distanceAP+"\n\nDirection="+directionAP+"\n\nY-coordinates="+Yp+"X-coordinate="+Xp);


        //DISPLAING THE RESULTS NOW
        var Y = document.getElementById('Yp');
        Y.value = Yp;

        var X = document.getElementById('Xp');
        X.value = Xp; 


        }
        //document.getElementById('compute').addEventListener('click',Intersection);
    </script>   

 </div>
   

<?php require('includes/footer.php'); ?>
