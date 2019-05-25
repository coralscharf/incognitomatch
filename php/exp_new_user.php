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


$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo 'err';
sqlsrv_free_stmt($getResults);

$get_exp_id="SELECT id from experiments where is_active=1";
$getResults= sqlsrv_query($conn, $get_exp_id);
if ($getResults == FALSE)
    echo 'err';
$arr=array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $arr[] = array(
        'id' => $row['id']
    );
}


sqlsrv_free_stmt($getResults);

$ind=rand(0,sizeof($arr)-1);
echo $ind;
echo $arr[$ind];
