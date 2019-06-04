<?php

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="select * from experiments";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";
$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'id'=>$row['id'],
        'name' => $row['name'],
        'schema_name'=>$row['schema_name'],
        'num_pairs'=> $row['num_pairs'],
        'disp_instance'=> $row['disp_instance'],
        'disp_type' => $row['disp_type'],
        'disp_h' => $row['disp_h'],
        'disp_feedback' => $row['disp_feedback'],
        'disp_control' => $row['disp_control'],
        'is_active' =>  $row['is_active']
    );
}
echo json_encode($array);
