<?php



$u_first=stripcslashes($_POST['u_first']);
$u_last=stripcslashes($_POST['u_last']);
$u_email=stripcslashes($_POST['u_email']);
$u_loc=stripcslashes($_POST['u_loc']);
$u_lang=stripcslashes($_POST['u_lang']);
$u_age=stripcslashes($_POST['u_age']);
$u_occ=stripcslashes($_POST['u_occ']);
$u_edu=stripcslashes($_POST['u_edu']);
$u_gender=stripcslashes($_POST['u_gender']);


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="Insert INTO exp_users(u_first, u_last, email, u_loc, lang, age, occupation, education, gender) values (
       '$u_first','$u_last','$u_email','$u_loc','$u_lang',$u_age,'$u_occ','$u_edu','$u_gender')";

echo $sql;

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    return (sqlsrv_errors());
sqlsrv_free_stmt($getResults);
echo "1";
