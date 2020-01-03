<?php

$index_from_a = stripcslashes($_POST['index_from_a']);
$index_from_b = stripcslashes($_POST['index_from_b']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$sqlForA="select col_name
from (select sch_id_2 as sch_id
    from exp_pairs
    where sch_id_1 = ". $index_from_a ." and sch_id_2 != ". $index_from_b ." and [order]<=100
    union
    select sch_id_1 as sch_id
    from exp_pairs
      where sch_id_2 = ". $index_from_a ." and sch_id_1 != ".$index_from_b." and [order]<=100) more_sch_ids
       join exp_schema on more_sch_ids.sch_id = exp_schema.id";

$getResults= sqlsrv_query($conn, $sqlForA);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'forWho'=>'A',
        'col_name'=>$row['col_name']
    );
}
sqlsrv_free_stmt($getResults);

$sqlForB="select col_name
from (select sch_id_2 as sch_id
    from exp_pairs
    where sch_id_1 = ". $index_from_b ." and sch_id_2 != ". $index_from_a ." and [order]<=100
    union
    select sch_id_1 as sch_id
    from exp_pairs
      where sch_id_2 = ". $index_from_b ." and sch_id_1 != ".$index_from_a." and [order]<=100) more_sch_ids
       join exp_schema on more_sch_ids.sch_id = exp_schema.id";

$getResults= sqlsrv_query($conn, $sqlForB);
if ($getResults == FALSE)
    echo "1";

while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'forWho'=>'B',
        'col_name'=>$row['col_name']
    );
}

sqlsrv_free_stmt($getResults);

echo json_encode($array);