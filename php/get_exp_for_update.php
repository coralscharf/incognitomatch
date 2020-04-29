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
        'max_num_pairs'=> $row['max_num_pairs'],
        'max_duration'=> $row['max_duration'],
        'disp_type' => $row['disp_type'],
        'disp_instance'=> $row['disp_instance'],
        'disp_h' => $row['disp_h'],
        'disp_system_sugg' => $row['disp_system_sugg'],
        'disp_major_res' => $row['disp_major_res'],
        'is_active' =>  $row['is_active']
    );
}

sqlsrv_free_stmt($getResults);

echo json_encode($array);
