<?php
$curr_user = stripcslashes($_POST['curr_user']);
$curr_exp_id = stripcslashes($_POST['curr_exp_id']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


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

echo json_encode($array);