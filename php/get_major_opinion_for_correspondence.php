<?php

$index_from_a = stripcslashes($_POST['index_from_a']);
$index_from_b = stripcslashes($_POST['index_from_b']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$sql="select cast(100*AVG(CAST(user_ans_is_match AS DECIMAL(5,4))) as decimal(5,2)) as avgMatchAnswer
from exp_results
where sch_id_1 = ". $index_from_a ." and sch_id_2 = ". $index_from_b;

$getResults= sqlsrv_query($conn, $sqlForA);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    echo $row['avgMatchAnswer'];
}
sqlsrv_free_stmt($getResults);