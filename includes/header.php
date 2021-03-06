<?php require('config/database.php');

?>
<!DOCTYPE html>
<html lang="en"   >

<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Online tools for the Geomatics profession. We aim to simplify all processes and needs within the profession through mobile and web applications to assist in this digital era">
  <meta name="author" content="">

  <title>Survey-Tools</title>

  <!-- Custom fonts for this template-->
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
  <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

  <!-- Custom styles for this template-->
  <link href="css/sb-admin-2.min.css" rel="stylesheet">

  <!-- CSS files for the calculator -->
  <link href="css/CalcSS3.css" rel="stylesheet" type="text/css" />
  <link href="css/index.css" rel="stylesheet" type="text/css" />
  
  <!-- input fields and design CSS -->
  <link rel="stylesheet" href="css/field.css">

  <!-- Css for the area coordinates thing -->
  <link rel="stylesheet" href="css/style.css">

  <!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/5ee5f4869e5f694422908628/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->

<!-- Google AdSense Code -->
<script data-ad-client="ca-pub-1726892928324403" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

<!-- ESRI API start -->
<link rel="stylesheet" href="https://js.arcgis.com/4.16/esri/themes/light/main.css" />

    <style>
        html,
        body,
        #viewDiv {
            padding: 0;
            margin: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
        }
    </style>

    <script src="https://js.arcgis.com/4.16/"></script>

    <script>
        require([
            "esri/Map",
            "esri/views/SceneView",
            "esri/widgets/CoordinateConversion",
            "esri/widgets/CoordinateConversion/support/Format",
            "esri/widgets/CoordinateConversion/support/Conversion",
            "esri/geometry/Point",
            "esri/geometry/support/webMercatorUtils",
            "esri/geometry/SpatialReference"
        ], function(
            Map,
            SceneView,
            CoordinateConversion,
            Format,
            Conversion,
            Point,
            webMercatorUtils,
            SpatialReference
        ) {
            var map = new Map({
                basemap: "hybrid",
                ground: "world-elevation"
            });

            var view = new SceneView({
                container: "viewDiv",
                map: map,
                // Clip the view to the extent covered by
                // by NAD 1983 HARN StatePlane California I
                clippingArea: {
                    xmin: -124.45,
                    xmax: -119.99,
                    ymax: 43.01,
                    ymin: 39.59
                },
                center: {
                    x: -122.22,
                    y: 41.3
                },
                zoom: 10,
                viewingMode: "local"
            });

            view.when(function(view) {
                view.goTo({
                    tilt: 45
                }).catch(function(error) {
                    if (error.name != "AbortError") {
                        console.error(error);
                    }
                });
            });

            var ccWidget = new CoordinateConversion({
                view: view
            });

            view.ui.add(ccWidget, "top-right");

            // Regular expression to find a number
            var numberSearchPattern = /-?\d+[\.]?\d*/;

            /**
             * Create a new Format called XYZ, which looks like: "<Latitude>, <Longitude>, <Z>"
             *
             * We need to define a convert function, a reverse convert function,
             * and some formatting information.
             */
            var newFormat = new Format({
                // The format's name should be unique with respect to other formats used by the widget
                name: "XYZ",
                conversionInfo: {
                    // Define a convert function
                    // Point -> Position
                    convert: function(point) {
                        var returnPoint = point.spatialReference.isWGS84 ?
                            point :
                            webMercatorUtils.webMercatorToGeographic(point);
                        var x = returnPoint.x.toFixed(4);
                        var y = returnPoint.y.toFixed(4);
                        var z = returnPoint.z.toFixed(4);
                        return {
                            location: returnPoint,
                            coordinate: `${x}, ${y}, ${z}`
                        };
                    },
                    // Define a reverse convert function
                    // String -> Point
                    reverseConvert: function(string) {
                        var parts = string.split(",");
                        return new Point({
                            x: parseFloat(parts[0]),
                            y: parseFloat(parts[1]),
                            z: parseFloat(parts[2]),
                            spatialReference: {
                                wkid: 4326
                            }
                        });
                    }
                },
                // Define each segment of the coordinate
                coordinateSegments: [{
                    alias: "X",
                    description: "Longitude",
                    searchPattern: numberSearchPattern
                }, {
                    alias: "Y",
                    description: "Latitude",
                    searchPattern: numberSearchPattern
                }, {
                    alias: "Z",
                    description: "Elevation",
                    searchPattern: numberSearchPattern
                }],
                defaultPattern: "X°, Y°, Z"
            });

            // add our new format to the widget's dropdown
            ccWidget.formats.add(newFormat);

            /**
             * Create a new Format 'SPS I', which looks like: "<X>, <Y>" in the
             * California StatePlane Zone I Spatial Reference, described by wkid 102241
             *
             * For this Format, we only need to provide a spatialReference with the correct
             * wkid. The geometry service can take care of the rest.
             */
            var stateplaneCA = new Format({
                name: "SPS I",
                conversionInfo: {
                    spatialReference: new SpatialReference({
                        wkid: 102241
                    }),
                    reverseConvert: function(string, format) {
                        var parts = string.split(",");
                        return new Point({
                            x: parseFloat(parts[0]),
                            y: parseFloat(parts[1]),
                            spatialReference: {
                                wkid: 102241
                            }
                        });
                    }
                },
                coordinateSegments: [{
                    alias: "X",
                    description: "easting",
                    searchPattern: numberSearchPattern
                }, {
                    alias: "Y",
                    description: "northing",
                    searchPattern: numberSearchPattern
                }],
                defaultPattern: "X, Y"
            });

            // Add our new format to the widget's dropdown
            ccWidget.formats.add(stateplaneCA);

            // Add the two custom formats to the top of the widget's display
            ccWidget.conversions.splice(
                0,
                0,
                new Conversion({
                    format: newFormat
                }),
                new Conversion({
                    format: stateplaneCA
                })
            );
        });
    </script>
    <!-- ESRI API end -->
</head>

<body id="page-top">

  <!-- Page Wrapper -->
  <div id="wrapper">

    <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

      <!-- Sidebar - Brand -->
      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.php">
        <div class="sidebar-brand-icon rotate-n-15">
        <i class="fas fa-toolbox    "></i>
        </div>
        <div class="sidebar-brand-text mx-3">SurveyTools<sup></sup></div>
      </a>

      <!-- Divider -->
      <hr class="sidebar-divider my-0">

      <!-- Nav Item - Dashboard -->
      <li class="nav-item active">
        <a class="nav-link" href="index.php">
          <i class="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span></a>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        Basic Tools
      </div>

      <!-- Nav Item - Pages Collapse Menu -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
          <i class="fas fa-fw fa-cog"></i>
          <span>Jobs</span>
        </a>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Surveying Jobs:</h6>
            <a class="collapse-item" href="#">Create New Job</a>
			<a class="collapse-item" href="#">Manage Jobs</a>
          </div>
        </div>
      </li>

      <!-- Nav Item - Utilities Collapse Menu -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities" aria-expanded="true" aria-controls="collapseUtilities">
          <i class="fas fa-fw fa-wrench"></i>
          <span>Calculator</span>
        </a>
        <div id="collapseUtilities" class="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Survey Calculator:</h6>
            <a class="collapse-item" href="basic-calculator.php">Basic</a>
            <a class="collapse-item" href="distance.php">Distance</a>
            <a class="collapse-item" href="angles.php">Angles</a>
            <a class="collapse-item" href="conversions.php">Conversions</a>
            <a class="collapse-item" href="#">Other</a>
          </div>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="note-pad.php">
          <i class="fas fa-fw fa-book"></i>
          <span>Note Pad / Jotter</span></a>
      </li>


      <!-- Divider -->
      <hr class="sidebar-divider">

      <!-- Heading -->
      <div class="sidebar-heading">
        Adanced Tools
      </div>

      <!-- Nav Item - Pages Collapse Menu -->
      <li class="nav-item">
        <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
          <i class="fas fa-fw fa-folder"></i>
          <span>Tools</span>
        </a>
        <div id="collapsePages" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
          <div class="bg-white py-2 collapse-inner rounded">
            <h6 class="collapse-header">Location Based</h6>
            <a class="collapse-item" href="get-area-coordinates.php">Get Area Coordinates</a>
            <a class="collapse-item" href="coord-trans.php">Coordinate Converter</a><!--
            <a class="collapse-item" href="register.html">Register</a>
            <a class="collapse-item" href="forgot-password.html">Forgot Password</a>-->
            <div class="collapse-divider"></div>
            <h6 class="collapse-header">Professionals</h6>
            <a class="collapse-item" href="q-cogo/index.html">Cogo Tools</a><!--
            <a class="collapse-item" href="404.html">404 Page</a>
            <a class="collapse-item" href="blank.html">Blank Page</a>-->
          </div>
        </div>
      </li>

      <!-- Nav Item - Charts -->
      <li class="nav-item">
        <a class="nav-link" href="dictionary.php">
          <i class="fas fa-fw fa-book"></i>
          <span>Dictionary</span></a>
      </li>

      <!-- Nav Item - Tables -->
      <li class="nav-item">
        <a class="nav-link" target="_blank" href="https://www.africansurveyors.co.zw/communityask/">
        <i class="fas fa-people-carry"></i>
          <span>Community</span></a>
      </li>
      <!-- developer suggest section -->
      <li class="nav-item">
        <a class="nav-link" href="dev-feedback.php">
          <i class="fa fa-comment" aria-hidden="true"></i>
          <span>Developer Feedback</span></a>
      </li>
      <!-- donation button -->
      <li class="nav-item">
        <a class="nav-link" href="https://www.paynow.co.zw/Payment/Link/?q=c2VhcmNoPWFkbWluJTQwYWZyaWNhbnN1cnZleW9ycy5jby56dyZhbW91bnQ9MC4wMCZyZWZlcmVuY2U9U3VydmV5LUNhbGN1bGF0aW9ucy1Eb25hdGlvbiZsPTA%3d" target="_blank">
          </i><i class="fas fa-donate"></i>
          <span>Donate</span></a>
      </li>

      <!-- Divider -->
      <hr class="sidebar-divider d-none d-md-block">

      <!-- Sidebar Toggler (Sidebar) -->
      <div class="text-center d-none d-md-inline">
        <button class="rounded-circle border-0" id="sidebarToggle"></button>
      </div>

    </ul>
    <!-- End of Sidebar -->

    <!-- Content Wrapper -->
    <div id="content-wrapper" class="d-flex flex-column">

      <!-- Main Content -->
      <div id="content">

        <!-- Topbar -->
        <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

          <!-- Sidebar Toggle (Topbar) -->
          <button id="sidebarToggleTop" class=" btn-link d-md-none rounded-circle mr-3">
            <i class="fa fa-bars"></i>
          </button>

          <!-- Topbar Search -->
          <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
            <div class="input-group">
              <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
              <div class="input-group-append">
                <button class="btn-primary" type="button">
                  <i class="fas fa-search fa-sm"></i>
                </button>
              </div>
            </div>
          </form>

          <!-- Topbar Navbar -->
          <ul class="navbar-nav ml-auto">

            <!-- Nav Item - Search Dropdown (Visible Only XS) -->
            <li class="nav-item dropdown no-arrow d-sm-none">
              <a class="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-search fa-fw"></i>
              </a>
              <!-- Dropdown - Messages -->
              <div class="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
                <form class="form-inline mr-auto w-100 navbar-search">
                  <div class="input-group">
                    <input type="text" class="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                      <button class="btn btn-primary" type="button">
                        <i class="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>

            <!-- Nav Item - Alerts -->
            <li class="nav-item dropdown no-arrow mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell fa-fw"></i>
                <!-- Counter - Alerts -->
                <span class="badge badge-danger badge-counter">3+</span>
              </a>
              <!-- Dropdown - Alerts -->
              <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="alertsDropdown">
                <h6 class="dropdown-header">
                  Alerts Center
                </h6>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-primary">
                      <i class="fas fa-file-alt text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">June 01, 2020</div>
                    <span class="font-weight-bold">A new monthly report is ready to download!</span>
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-success">
                      <i class="fas fa-donate text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">May 27, 2020</div>
                    You've a new client from Kenya <i class="fa fa-flag" aria-hidden="true"></i>
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="mr-3">
                    <div class="icon-circle bg-warning">
                      <i class="fas fa-exclamation-triangle text-white"></i>
                    </div>
                  </div>
                  <div>
                    <div class="small text-gray-500">May 26, 2020</div>
                    Your application for approval has been declined.
                  </div>
                </a>
                <a class="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
              </div>
            </li>

            <!-- Nav Item - Messages -->
            <li class="nav-item dropdown no-arrow mx-1">
              <a class="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-envelope fa-fw"></i>
                <!-- Counter - Messages -->
                <span class="badge badge-danger badge-counter">7</span>
              </a>
              <!-- Dropdown - Messages -->
              <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="messagesDropdown">
                <h6 class="dropdown-header">
                  Message Center
				</h6>
			<a class="dropdown-item d-flex align-items-center" href="">
                  <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://www.africansurveyors.co.zw/wp-content/uploads/2020/06/African-surveyors.png" alt="">
                    <div class="status-indicator bg-success"></div>
                  </div>
                  <div class="font-weight-bold">
				  <div class="text-truncate">This is the latest message in your chatbox
						  </div>
						  <div class="small text-gray-500">{Sender Name} . {Time}</div>
						  </div>
						</a>
            <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://www.africansurveyors.co.zw/wp-content/uploads/2020/06/African-surveyors.png" alt="">
                    <div class="status-indicator"></div>
                  </div>
                  <div>
                    <div class="text-truncate">About your recent survey</div>
                    <div class="small text-gray-500">Surveyor General · 1d</div>
                  </div>
                </a><!--
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://source.unsplash.com/CS2uCrpNzJY/60x60" alt="">
                    <div class="status-indicator bg-warning"></div>
                  </div>
                  <div>
                    <div class="text-truncate">Last month's report looks great, I am very happy with the progress so far, keep up the good work!</div>
                    <div class="small text-gray-500">Morgan Alvarez · 2d</div>
                  </div>
                </a>
                <a class="dropdown-item d-flex align-items-center" href="#">
                  <div class="dropdown-list-image mr-3">
                    <img class="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="">
                    <div class="status-indicator bg-success"></div>
                  </div>
                  <div>
                    <div class="text-truncate">Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if they aren't good...</div>
                    <div class="small text-gray-500">Chicken the Dog · 2w</div>
                  </div>
                </a>-->
                <a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
              </div>
            </li>

            <div class="topbar-divider d-none d-sm-block"></div>

            <!-- Nav Item - User Information -->
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="mr-2 d-none d-lg-inline text-gray-600 small">Surveyor {name}</span>
                <img class="img-profile rounded-circle" src="https://www.africansurveyors.co.zw/wp-content/uploads/2020/06/African-surveyors.png">
              </a>
              <!-- Dropdown - User Information -->
              <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#">
                  <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                  Profile
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                  Settings
                </a>
                <a class="dropdown-item" href="#">
                  <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                  Activity Log
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                  Logout
                </a>
              </div>
            </li>

          </ul>

        </nav>
		<!-- End of Topbar -->
		