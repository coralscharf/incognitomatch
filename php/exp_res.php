<?php
$exp_id=stripcslashes($_POST['exp_id']);
$user_id=stripcslashes($_POST['user_id']);
$sch_id_1=stripcslashes($_POST['sch_id_1']);
$sch_id_2=stripcslashes($_POST['sch_id_2']);
$realconf=stripcslashes($_POST['realconf']);
$userconf=stripcslashes($_POST['userconf']);


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="insert into exp_results(user_id, exp_id, sch_id_1, sch_id_2, realconf, userconf) values($user_id,$exp_id,$sch_id_1,$sch_id_2,$realconf,$userconf)";
echo $sql;

