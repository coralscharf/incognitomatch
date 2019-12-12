<?php

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="select userconf, IIF(realconf = user_ans_is_match, 1, 0) as isCorrectAnswer
from exp_results
where user_id = 308
order by rec_time";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'user_conf'=>$row['userconf'],
        'isCorrectAnswer'=>$row['isCorrectAnswer']
    );
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);