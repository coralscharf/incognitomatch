<?php

$curr_user = stripcslashes($_POST['curr_user']);
$curr_exp_id = stripcslashes($_POST['curr_exp_id']);
$isSingleUser = stripcslashes($_POST['isSingleUser']);
$usersToShowStats = $_POST['usersToShowStats'];
$groupsToShowStats = $_POST['groupsToShowStats'];

$sql = "";
if ($isSingleUser == 'True'){
    $sql="select mouse_loc from exp_results where exp_id = " . $curr_exp_id . "and user_id = ". $curr_user;
} else {
    $whereClause = "where ";

    foreach ($usersToShowStats as $user){

        if($whereClause !== "where "){
            $whereClause = $whereClause . "or user_id = " . $user . " ";

        } else{
            $whereClause = $whereClause . "( user_id = " . $user . " ";
        }

    }

    if($whereClause !== "where "){
        $whereClause = $whereClause . ") ";
    }

    $firstGroupForStatement = True;
    foreach ($groupsToShowStats as $group){

        if($whereClause !== "where "){

            if($firstGroupForStatement === True){
                $whereClause = $whereClause . "and ( exp_id = " . $group["id"] . " ";
                $firstGroupForStatement = False;
            } else {
                $whereClause = $whereClause . "or exp_id = " . $group["id"] . " ";
            }

        } else{
            $whereClause = $whereClause . "( exp_id = " . $group["id"] . " ";
            $firstGroupForStatement = False;
        }
    }

    if($whereClause !== "where "){
        $whereClause = $whereClause . ") ";
    }

    $sql="select mouse_loc from exp_results " . $whereClause ;

}

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    array_push($array, $row['mouse_loc']);
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);