<?php
$curr_user = stripcslashes($_POST['curr_user']);
$curr_exp_id = stripcslashes($_POST['curr_exp_id']);

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


$sql="with userWithAlgs as (
    select exp_schema1.col_name as corr1, exp_schema2.col_name as corr2, userconf/100 as confOfUser, Token_Path, Term_Match, WordNet
    from exp_results join exp_schema exp_schema1 on
                exp_results.sch_id_1 = exp_schema1.id and exp_results.exp_id = exp_schema1.exp_id
                     join exp_schema exp_schema2 on
                exp_results.sch_id_2 = exp_schema2.id and exp_results.exp_id = exp_schema2.exp_id
                     join PO_Match_Alg on exp_schema2.col_name =  PO_Match_Alg.corr2 and exp_schema1.col_name =  PO_Match_Alg.corr1
    where user_id = " . $curr_user . " and user_ans_is_match = 1
) ,
     norms as (
         select sqrt(sum(userWithAlgs.confOfUser * userWithAlgs.confOfUser)) as confOfUser_n2,
                sqrt(sum(userWithAlgs.Token_Path * userWithAlgs.Token_Path)) as Token_Path_n2,
                sqrt(sum(userWithAlgs.Term_Match * userWithAlgs.Term_Match)) as Term_Match_n2,
                sqrt(sum(userWithAlgs.WordNet * userWithAlgs.WordNet)) as WordNet_n2
         from userWithAlgs
     )
select sum(userWithAlgs.confOfUser * userWithAlgs.Token_Path)/(select confOfUser_n2*Token_Path_n2 from norms) as Token_Path_Sim,
       sum(userWithAlgs.confOfUser * userWithAlgs.Term_Match)/(select confOfUser_n2*Term_Match_n2 from norms) as Term_Match_Sim,
       sum(userWithAlgs.confOfUser * userWithAlgs.WordNet)/(select confOfUser_n2*WordNet_n2 from norms) as WordNet_Sim
from userWithAlgs";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $token_path = $row['Token_Path_Sim'];
    $term_match = $row['Term_Match_Sim'];
    $WordNet = $row['WordNet_Sim'];

    $max_value = max($token_path, $term_match, $WordNet);
    if ($token_path == $max_value) {
        echo "Token_Path";
    } elseif ($term_match == $max_value){
        echo "Term_Match";
    } else {
        echo "WordNet";
    }
}
sqlsrv_free_stmt($getResults);
