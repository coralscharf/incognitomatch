<?php
$usersToShowStats = $_POST['usersToShowStats'];
$groupsToShowStats = $_POST['groupsToShowStats'];

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$firstWhereClause = "where ";
$secondWhereClause = "where ";

echo $usersToShowStats;
echo "usersToShowStats";

foreach ($usersToShowStats as $user){

    echo "USER: ";
    echo $user;

    if($firstWhereClause !== "where "){
        $firstWhereClause = $firstWhereClause . "and user_id = " . $user . " ";

    } else{
        $firstWhereClause = $firstWhereClause . "user_id = " . $user . " ";
    }
}

foreach ($groupsToShowStats as $group){

    echo "GROUP: ";
    echo $group;

    if($firstWhereClause !== "where "){
        $firstWhereClause = $firstWhereClause . "and exp_id = " . $group.id . " ";

    } else{
        $firstWhereClause = $firstWhereClause . "exp_id = " . $group.id . " ";
    }

    if($secondWhereClause !== "where "){
        $secondWhereClause = $secondWhereClause . "and exp_id = " . $group.id . " and [order] <= " . $group.num_pairs . " ";

    } else{
        $secondWhereClause = $secondWhereClause . "exp_id = " . $group.id . " and [order] <= " . $group.num_pairs . " ";
    }
}


$sql="WITH answers_table AS (
    select sch_id_1, sch_id_2, userconf, IIF(realconf = user_ans_is_match, 1, 0) as isCorrectAnswer
    from exp_results
    where exp_id = 3
)
select [order], AVG(userconf) as avgConf, 100*AVG(CAST(isCorrectAnswer AS DECIMAL(5,4))) as avgCorrAns
from answers_table join (select [order], sch_id_1, sch_id_2
                         from exp_pairs
                         where exp_id = 3 and [order]<=20) questions_orders
on answers_table.sch_id_1 = questions_orders.sch_id_1
       and answers_table.sch_id_2 = questions_orders.sch_id_2
group by [order]
order by [order] asc";

/*
$sql="WITH answers_table AS (
    select sch_id_1, sch_id_2, userconf, IIF(realconf = user_ans_is_match, 1, 0) as isCorrectAnswer
    from exp_results ".
    $firstWhereClause . "
)
select [order], AVG(userconf) as avgConf, 100*AVG(CAST(isCorrectAnswer AS DECIMAL(5,4))) as avgCorrAns
from answers_table join (select [order], sch_id_1, sch_id_2
                         from exp_pairs ".
                         $secondWhereClause . ") questions_orders
on answers_table.sch_id_1 = questions_orders.sch_id_1
       and answers_table.sch_id_2 = questions_orders.sch_id_2
group by [order]
order by [order] asc";

echo $sql;*/

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'avgConf'=>$row['avgConf'],
        'avgCorrAns'=>$row['avgCorrAns']
    );
}
sqlsrv_free_stmt($getResults);

//echo json_encode($array);