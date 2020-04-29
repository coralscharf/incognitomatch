<?php
$exp_id=$_POST['exps'];

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

for( $i=0; $i<sizeof($exp_id);$i++)
{
    $sql="UPDATE experiments
    set [name] = '".$exp_id[$i]['name']."',
    schema_name ='".$exp_id[$i]['schema_name'] ."',
    max_num_pairs =".$exp_id[$i]['max_num_pairs'].",
    max_duration =".$exp_id[$i]['max_duration'].",
    disp_type=".$exp_id[$i]['disp_type'].",
    disp_instance = ".$exp_id[$i]['disp_instance'].",
    disp_h = ".$exp_id[$i]['disp_h'].",
    disp_system_sugg = ".$exp_id[$i]['disp_system_sugg'].",
    disp_major_res = ".$exp_id[$i]['disp_major_res'].",
    is_active = ".$exp_id[$i]['is_active']." 
    where id=".$exp_id[$i]['id'];

    $getResults= sqlsrv_query($conn, $sql);
    if ($getResults == FALSE)
    {
        echo "1";
        die();
    }
}

sqlsrv_free_stmt($getResults);
echo "0";

