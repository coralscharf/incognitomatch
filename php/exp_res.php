<?php
$exp_id=stripcslashes($_POST['exp_id']);
$user_id=stripcslashes($_POST['user_id']);
$sch_id_1=stripcslashes($_POST['sch_id_1']);
$sch_id_2=stripcslashes($_POST['sch_id_2']);
$realconf=stripcslashes($_POST['realconf']);
$userconf=stripcslashes($_POST['userconf']);
$mouse_loc=$_POST['mouse_loc'];


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);
$mouse_str="";
for($i=0;$i<sizeof($mouse_loc);$i++)
{
    $mouse_str=$mouse_str."(".$mouse_loc[$i]["x"].",".$mouse_loc[$i]["y"].");";
}

$sql="insert into exp_results(user_id, exp_id, sch_id_1, sch_id_2, realconf, userconf,rec_time,mouse_loc) 
    values($user_id,$exp_id,$sch_id_1,$sch_id_2,$realconf,$userconf,getdate(),$mouse_str)";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    return (sqlsrv_errors());
sqlsrv_free_stmt($getResults);
echo "1";
