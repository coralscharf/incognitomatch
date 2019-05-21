<?php
$exp_name=stripcslashes($_POST['exp_name']);
$exp_sch_name=stripcslashes($_POST['exp_sch_name']);
$exp_num_pairs=stripcslashes($_POST['exp_num_pairs']);
$show_instance=stripcslashes($_POST['show_instance']);
$show_type=stripcslashes($_POST['show_type']);
$show_hierarchy=stripcslashes($_POST['show_hierarchy']);
$show_feedback=stripcslashes($_POST['show_feedback']);
$show_control=stripcslashes($_POST['show_control']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$sql="insert into experiments(name, schema_name, num_pairs, disp_instance, disp_type, disp_h, disp_feedback, disp_control) 
values('$exp_name','$exp_sch_name',$exp_num_pairs,$show_instance,$show_type,$show_hierarchy,$show_feedback,$show_control)";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    return (sqlsrv_errors());
sqlsrv_free_stmt($getResults);
echo "1";
