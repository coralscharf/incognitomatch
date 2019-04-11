<?php
/**
 * Created by PhpStorm.
 * User: avivf
 * Date: 2019-04-05
 * Time: 17:59
 */


$exp_id=stripcslashes($_POST['exp_id']);


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);






$sql="select * from exp_schema where exp_id=$exp_id";
$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    return (sqlsrv_errors());
$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'id'=>$row['id'],
        's_name' => $row['s_name'],
        'col_name'=>$row['col_name'],
        'col_type'=> $row['col_type'],
        'col_parent_id'=> $row['col_parent_id'],
    );
}

//echo sizeof($array);

$index=rand(0,sizeof($array));
//echo $index;
sqlsrv_free_stmt($getResults);

$selected=$array[$index];
$found=false;

while (!$found)
{
    $sql_get_instance="select * from exp_instance where sch_id=".$selected['id'];
    $getResults_instance= sqlsrv_query($conn, $sql_get_instance);
    if ($getResults_instance == FALSE)
        return (sqlsrv_errors());
    $instance = array();
    while ($row = sqlsrv_fetch_array($getResults_instance, SQLSRV_FETCH_ASSOC)) {
        $instance[] = array(
            'id'=>$row['id'],
            'sch_id' => $row['sch_id'],
            'instance' => $row['instance'],
            'col_name' => $selected['col_name'],
            'col_type' => $selected['col_type'],
            'col_parent_id' => $selected['col_parent_id']
        );
    }
    if (sizeof($instance) !== 0 )
    {
        $found = true;
    }
    else{
        echo sizeof($instance);
        die();
    }
    sqlsrv_free_stmt($getResults_instance);

}

echo json_encode($instance);



