<?php
$curr_user = stripcslashes($_POST['curr_user']);
$curr_exp_id = stripcslashes($_POST['curr_exp_id']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$sql="WITH time_table AS (
    select ROW_NUMBER() over (order by rec_time asc) as row_number ,rec_time,
           IIF(realconf = user_ans_is_match, 1, 0) as isCorrectAnswer
    from exp_results
    where exp_id = ". $curr_exp_id ." and user_id = ". $curr_user . "
)
SELECT datediff(second, time_table1.rec_time, time_table2.rec_time) as diff_sec, time_table2.isCorrectAnswer
FROM time_table time_table1
    JOIN time_table time_table2
    ON time_table1.row_number = time_table2.row_number - 1";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $array[] = array(
        'diff_sec'=>$row['diff_sec'],
        'isCorrectAnswer'=>$row['isCorrectAnswer']
    );
}
sqlsrv_free_stmt($getResults);

echo json_encode($array);