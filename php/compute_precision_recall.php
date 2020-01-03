<?php
$usersToShowStats = $_POST['usersToShowStats'];
$groupsToShowStats = $_POST['groupsToShowStats'];

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="select users.user_id, users.exp_id, (select count(*)
        from (
                 select sch_id_1, sch_id_2
                 from exp_results
                 where user_id = users.user_id and exp_id = users.exp_id and realconf = 1
                 intersect
                 select sch_id_1, sch_id_2
                 from exp_pairs
                 where realConf = 1 and exp_id = users.exp_id and exp_pairs.[order] <= experiments.num_pairs) A) as commonCorrNum,
       (select count(*)
        from exp_results
        where user_id = users.user_id and exp_id = users.exp_id and realconf = 1) as matchNum,
       (select count(*)
        from exp_pairs
        where realConf = 1 and exp_id = users.exp_id and exp_pairs.[order] <= experiments.num_pairs) as exactMatchNum
from exp_results users join experiments on users.exp_id = experiments.id
group by users.user_id, users.exp_id, experiments.num_pairs";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $commonCorrNum = $row['commonCorrNum'];
    $precision = 0;
    $recall = 0;
    if ($commonCorrNum !== 0){
        $precision = $commonCorrNum / $row['matchNum'];
        $recall = $commonCorrNum / $row['exactMatchNum'];
    }

    $array[] = array(
        'user_id'=>$row['user_id'],
        'exp_id'=>$row['exp_id'],
        'precision'=>$precision,
        'recall'=>$recall
    );
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);