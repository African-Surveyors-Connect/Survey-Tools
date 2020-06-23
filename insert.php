<?php require('includes/header.php');?>
<!-- form submission into the database -->
<?php

require('config/database.php');
		
			//variables from the input
			$message = $_POST['message'];
			$name = $_POST['name'];
			$email = $_POST['email'];
			$category = $_POST['select'];
			

			//preventing submission of incomplete forms
			//if($email !='' || $message !='') {

		$sql = "INSERT INTO feedback (name, email, category, message) VALUES ('$name', '$email', '$category', '$message')";

		if (mysqli_query($conn, $sql)) {
			echo '<div class="alert alert-success" role="alert" style="text-align:center;">
			<h2 class="alert-heading">Received</h2>
			Thank you for your feedback. It helps us improve your experience too.
		</div>';
		echo '<script>
		setTimeout(function () {
			window.location.href="index.php";
		}, 2000);
		</script>';
			
		} else {
			echo '<div class="alert alert-danger" role="alert" style="text-align:center;">
			<h4 class="alert-heading">Sending Failed</h4>
			Your Feedback was not received. Please make sure you have filled in all the fields and <a href="dev-feedback.php">try again</a><br>Page will automatically redirect in 10 seconds.  
		</div>';
		echo '<script>
		setTimeout(function () {
			window.location.href="dev-feedback.php";
		}, 10000);
		</script>';
					
		}

		mysqli_close($conn);

?>
<?php require('includes/footer.php');?>
