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
    num_pairs =".$exp_id[$i]['num_pairs'].",
    disp_instance = ".$exp_id[$i]['disp_instance'].",
    disp_type=".$exp_id[$i]['disp_type'].",
    disp_h = ".$exp_id[$i]['disp_h'].",
    disp_feedback = ".$exp_id[$i]['disp_feedback'].",
    disp_control = ".$exp_id[$i]['disp_control'].",
    is_active = ".$exp_id[$i]['is_active']."
    where id=$exp_id[$i]['id']";
    echo $sql;
    $getResults= sqlsrv_query($conn, $sql);
    if ($getResults == FALSE)
    {
        echo "1";
        die();
    }


}


sqlsrv_free_stmt($getResults);
echo "0";

