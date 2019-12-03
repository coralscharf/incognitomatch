<?php

$user_id=stripcslashes($_POST['user_id']);
$id_card=stripcslashes($_POST['id_card']);
$u_validFieldFigureEight =stripcslashes($_POST['u_validFieldFigureEight']);


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="Insert INTO exp_figure_eight_users(user_id, id_card_number, validate_string)
values ('$user_id','$id_card','$u_validFieldFigureEight')";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "err";
sqlsrv_free_stmt($getResults);
echo "1";