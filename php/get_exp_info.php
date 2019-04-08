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
sqlsrv_free_stmt($getResults);
echo json_encode($array);



