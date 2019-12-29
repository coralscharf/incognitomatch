<?php

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$sql="select CONCAT(u_first, ' ', u_last) as fullName
from exp_users
where id in (
    select distinct user_id
    from exp_results
    )";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'fullName'=>$row['fullName'],
        'isSingleUser' => 'True'
    );
}
sqlsrv_free_stmt($getResults);

$sql="select schema_name
from experiments
where name!='Test'";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'exp_name'=>$row['schema_name'],
        'isSingleUser' => 'False'
    );
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);