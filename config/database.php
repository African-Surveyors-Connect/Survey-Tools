<?php
/*
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "survey_tools";
*/

$servername = "localhost";
$username = "fzhzf_fzhzfxpv";
$password = "nkm10636";
$dbname = "fzhzfxpv_african_surveyor_connect";


//create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

//check connection
if (!$conn) {
	die("connection failed: " .mysqli_connect_error());
}
?>
