<?php require('includes/header.php');?>
<!-- form submission into the database -->

        <!-- Begin Page Content -->
        <div class="container-fluid" style="text-align:center;">

          <!-- Page Heading -->
          <div class="d-sm-flex align-items-center justify-content-between mb-4">
            <h1 class="h3 mb-0 text-gray-800">Developer Feedback</h1>
          </div>
           <div class="row" style="text-align:center;">

            <div class="col-md-12">            

              <!-- Basic Card Example -->
              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary" style="text-align:center;">Developer Feedback Form</h6>
                </div>
                <div class="card-body" style="text-align:center;">
				  We would love <i class="fa fa-heart" aria-hidden="true"></i> to hear what you have to say or suggest
				  <hr>
				  <div class="col-lg-8" style="text-align:center;">
          <form class="form-contact contact_form" action="insert.php" method="post" id="contactForm" novalidate="novalidate">
            <div class="row">
			<div class="form-group col-lg-6 center">
					<label for="select">Feedback Category</label>
					<select class="form-control" name="select" id="select">
						<option>---Select Category---</option>
						<option value="suggestion">Suggestion</option>
						<option value="error">Error Detection</option>
						<option value="general">General Comment</option>
						<option value="other">Other</option>
					</select>
				</div>
              <div class="col-12">
                <div class="form-group">
                    <textarea class="form-control w-100" name="message" id="message" cols="30" rows="9" placeholder="Your message here..."></textarea>
				</div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" name="name" id="name" type="text" placeholder="Name">
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group">
                  <input class="form-control" name="email" id="email" type="email" placeholder="Email">
                </div>
              </div>
            </div>
            <div class="form-group mt-3">
              <button type="submit" value="submit" class="btn button-contactForm">Send Message</button>
            </div>
          </form>
        </div>
                </div>
              </div>

            </div>


          </div>

        </div>
        <!-- /.container-fluid -->

      </div>
      <!-- End of Main Content -->

<?php require('includes/footer.php');?>