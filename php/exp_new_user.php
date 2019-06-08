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
{
    echo 'err';
    die();
}


sqlsrv_free_stmt($getResults);
# choose randomly an active experiment which is not an test schema.
$get_exp_id="SELECT * from experiments where is_active=1 and [name]!= 'Test'";
$getResults= sqlsrv_query($conn, $get_exp_id);
if ($getResults == FALSE)
{
    echo 'err';
    die();
}

$arr=array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $arr[] = array(
        'id' => $row['id'],
        'num_pairs' => $row['num_pairs'],
        'disp_instance' => $row['disp_instance'],
        'disp_type' => $row['disp_type'],
        'disp_h' => $row['disp_h'],
        'dist_feedback' => $row['dist_feedback'],
        'disp_control' => $row['disp_control']
    );
}


sqlsrv_free_stmt($getResults);

$ind=rand(0,sizeof($arr)-1);

# get id for test scheme
$get_exp_id_test="SELECT * from experiments where is_active=1 and [name]= 'Test'";
$getResults= sqlsrv_query($conn, $get_exp_id_test);
if ($getResults == FALSE)
{
    echo 'err';
    die();
}
$test_id="";
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $test_id = $row['id'];
}

$res=[$arr[$ind],$test_id];
echo json_encode($res);
