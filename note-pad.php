<?php require('includes/header.php'); ?>

<div class="container-fluid" style="text-align:center;">
	
   <!-- Page Heading -->
 <h1 class="h3 mb-4 text-gray-800"></h1>
 
 
 <div class="alert alert-warning" role="alert" style="text-align:center;">
	 <h4 class="alert-heading">Under Construction</h4>	 
	 If you'd like to contribute kindly visit the <a href="https://github.com/African-Surveyors-Connect/Survey-Tools/">GitHub Repository</a> <i class="fab fa-github"></i>
 </div>
<div class="alert alert-info" role="alert">
<strong>Note Pad</strong> helps you create quick files basing on your thoughts for later use. Type in what's on your mind and you can download the file as soon as you create it
</div>

 

 </div>

 <!-- Training HTML-->
   <form method="post" action="generate-note.php" style="text-align:center;">
   <div class="input-group mb-3">
	   <div class="input-group-prepend">
		   <span class="input-group-text" id="topic">Topic Name</span>
	   </div>
	   <input type="text" class="form-control" name="topic" placeholder="Topic Name" aria-label="topic" aria-describedby="topic">
   </div>
   <div class="input-group mb-3">
   <div class="input-group-prepend">
		   <span class="input-group-text" id="topic">What are<br> you planning?</span>
	</div>
		   <textarea class="form-control" name="notes" id="notes" placeholder="Say what's on your mind..." rows="10"></textarea>
	   </div>

	   <div class="alert alert-info alert-dismissible fade show" role="alert">
		  <sub>Your files are automatically deleted by the server once you download them</sub>
		   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
			   <span aria-hidden="true">&times;</span>
		   </button>
	   </div>

	<div class="form-group">
		<div class="col-sm-10 col-sm-offset-2">
			<button type="submit" class="btn btn-info">Create File</button>
		</div>
	</div>	   
</form>

<?php require('includes/footer.php'); ?>