<?php

$curr_user = stripcslashes($_POST['curr_user']);
$curr_exp_id = stripcslashes($_POST['curr_exp_id']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


#$sql="select mouse_loc from exp_results where exp_id = ". $curr_exp_id ." and user_id = ". $curr_user ;
$sql="select mouse_loc from exp_results where exp_id = 3 and user_id = 394" ;

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    array_push($array, $row['mouse_loc']);
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);