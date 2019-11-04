<?php

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="select exp_id, count(*) as totalCorrectAns from exp_results where realconf = user_ans_is_match group by exp_id";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'exp_id'=>$row['exp_id'],
        'totalCorrectAns' => $row['totalCorrectAns']
    );
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);