<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 <div class="alert alert-info" role="alert">
Fill in the boxes accordingly. Wrong input values result in distorted output records.
</div>
 
 <div class="alert alert-warning" role="alert" style="text-align:center;">
	 <h4 class="alert-heading">Under Construction</h4>	 
	 If you'd like to contribute kindly visit the <a href="https://github.com/African-Surveyors-Connect/Survey-Tools/">GitHub Repository</a> <i class="fas fa-grin-tongue-wink"></i>
 </div>

 <p><b>Universal Transverse Mercator (UTM)</b></p>
          <p>
              Easting: <input type="Number" id="x" placeholder="0.000m" step="0.00001" class="InputBox">
              Northing: <input type="Number" id="y" placeholder="0.000m" step="0.0001" class="InputBox">
          </p> 
          Zone:<input type="Number" id="zone" readonly="true" class="InputBox">
          <br>
          <br>
          Hemisphere:<input type="text" id="hemisphere" readonly="true" class="InputBox">
          
          <br>
          <br>
          <button id="convert" class="btn" title="Convert coordinates to WGS-84" >Convert</button>
          <br>
          <hr>
 <!-- FIELD FOR WORLD GEODETIC SYSTEM 1984 COORDINATES INPUT AND OUTPUT -->         
    <p><b>World Geodetic System 84 (WGS84)</b></p>
    <p>
        Latitude  :<input type="Number" id="latitude" placeholder="0.000&deg;" class="InputBox"> 
        Longitude :<input type="Number" id="longitude" placeholder="0.000&deg;" class="InputBox">    
    </p>
    <br>
    <input type="submit" name="button" id="button2" onclick="UTM()"
           class="btn"
			   value="Convert" title="Convert coordinates to UTM"/>
          
    <!-- FIELD FOR GPS COORDINATES INPUT AND OUTPUT -->
      
  <script>
      
      function WGS()
{
    
    //variables from the input data 
    var yInput = Number(document.getElementById('y').value);
    var xInput = Number(document.getElementById('x').value);
   
        
     //declaring of all constants in the equations
            var m = 0.0009129;
            var e = 2.2570317;
            var b = -91.31515147;
            var a = 25.37851551;
            
             //changing radians into degree format
            var PI = Math.PI;
            var radAngle = e*(PI/180);
            
            
            //final equations for the converted coordinates
            var yOutput = b + (m*xInput*Math.sin(radAngle)*0.01) + (m*yInput*Math.cos(radAngle)*0.01);
            var xOutput = a + (m*xInput*Math.cos(radAngle)*0.01) - (m*yInput*Math.sin(radAngle)*0.01);
            
            //SENDING OUTPUT TO WGS84 FIELD
            var latitude = document.getElementById('latitude');
            latitude.value = xOutput;
            
            var longitude = document.getElementById('longitude');
            longitude.value = yOutput;
            
           
           // alert(document.getElementById('go').innerHTML="lat = "+xOutput+"\n\nlong = "+yOutput);
            
}
     document.getElementById('convert').addEventListener('click',WGS);       
     
    function UTM()
    {
        
        var yInput = Number(document.getElementById('longitude').value);
        var xInput = Number(document.getElementById('latitude').value);
        
         //declaring of all constants in the equations
            var m = 109530.0506;
            var e = -2.2570317;
            var b = 10104250.96;
            var a = -2383580.17;
            
            //changing radians into degree format
            var PI = Math.PI;
            var radAngle = e*(PI/180);
            
            //final equations for the converted coordinates
            var yOutput = b + (m*xInput*Math.sin(radAngle)) + m*yInput*Math.cos(radAngle);
            var xOutput = a + m*xInput*Math.cos(radAngle) - m*yInput*Math.sin(radAngle);
            
            //SENDING OUTPUT TO UTM FIELD
            var Northing = document.getElementById('y');
            Northing.value = yOutput;
            
            var Easting = document.getElementById('x');
            Easting.value = xOutput;
            
            //DETERMINING THE HEMISPHERE OF THE INPUT COORDINATES
           
            if(xInput < 0)
            {
                var hemisphere = "Southern Hemisphere";
            }
            else if(xInput > 0)
            {
                var hemisphere = "Northen Hemisphere";
            }
            else
            {
                var hemisphere = "At the Equator";
            }
            
            //SENDING OUTPUT TO THE HEMISPHERE BOX
            var Hemisphere = document.getElementById('hemisphere');
            Hemisphere.value = hemisphere;
            
             //determine the UTM zone of the coordinates
            var zone = 31 + (yInput/6);
            var utmZone = Math.floor(zone);
            
            //SENDING OUTPUT TO THE ZONE BOX
            var Zone = document.getElementById('zone');
            Zone.value = utmZone;
            
    }
       
  </script>

 </div>
   

<?php require('includes/footer.php'); ?>
