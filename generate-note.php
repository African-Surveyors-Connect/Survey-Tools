<?php require_once('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
	<!-- Page Heading -->
  <h1 class="h3 mb-4 text-gray-800"></h1>

<?php

// testfile.php

$filename = "files/".$_POST['topic'].".docx"; 

$fh = fopen($filename, 'w') or die("<div class='alert alert-danger' role='alert'>Failed to create file</div>");
$text = $_POST['notes'];
fwrite($fh, $text) or die("<div class='alert alert-danger' role='alert'>
Notes could not be generated. Please <a href='note-pad.php'>try again.</a><br>Make sure your note is: <br>-->Labeled<br>-->and has some content in it
</div>");
fclose($fh);
echo "
<div class='alert alert-success' role='alert'>
Your file <strong>".$_POST['topic']."</strong> has been written successfully
<br><br> <p>Download your Plans <a href='$filename' download>Here</a></p>
</div> 
<div class='alert alert-warning' role='alert'>
File will automatically delete in <span id='countdown'>20</span> seconds
</div>";
echo '<script>
		setTimeout(function () {
			window.location.href="note-pad.php";
		}, 20000);
		</script>';
		
?>
<script>
	var seconds = document.getElementById("countdown").textContent;
	var countdown = setInterval(function() {
		seconds--;
		document.getElementById("countdown").textContent = seconds;
		if (seconds <= 0) clearInterval(countdown);
	}, 1000
	);
</script>
</div>
