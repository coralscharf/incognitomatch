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
    where user_id = " . $curr_user . " and user_ans_is_match = 1 and exp_results.sch_id_1 != 0
) ,
     norms as (
         select sqrt(sum(userWithAlgs.confOfUser * userWithAlgs.confOfUser)) as confOfUser_n2,
                sqrt(sum(userWithAlgs.Token_Path * userWithAlgs.Token_Path)) as Token_Path_n2,
                sqrt(sum(userWithAlgs.Term_Match * userWithAlgs.Term_Match)) as Term_Match_n2,
                sqrt(sum(userWithAlgs.WordNet * userWithAlgs.WordNet)) as WordNet_n2
         from userWithAlgs
     )
select cast(sum(userWithAlgs.confOfUser * userWithAlgs.Token_Path)/(select confOfUser_n2*Token_Path_n2 from norms) as decimal(5,4)) as Token_Path_Sim,
       cast(sum(userWithAlgs.confOfUser * userWithAlgs.Term_Match)/(select confOfUser_n2*Term_Match_n2 from norms) as decimal(5,4)) as Term_Match_Sim,
       cast(sum(userWithAlgs.confOfUser * userWithAlgs.WordNet)/(select confOfUser_n2*WordNet_n2 from norms)  as decimal(5,4)) as WordNet_Sim
from userWithAlgs";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "1";

$array = array();
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $token_path = $row['Token_Path_Sim'];
    $term_match = $row['Term_Match_Sim'];
    $WordNet = $row['WordNet_Sim'];

    $max_value = max($token_path, $term_match, $WordNet);
    $token_path_arg_max = 0;
    $Term_Match_arg_max = 0;
    $WordNet_arg_max = 0;

    if ($token_path == $max_value) {
        $token_path_arg_max = 1;
    } elseif ($term_match == $max_value){
        $Term_Match_arg_max = 1;
    } else {
        $WordNet_arg_max = 1;
    }

    $array[] = array(
        'algName'=>'AMC Token Path',
        'algSim'=>$token_path,
        'isMax'=>$token_path_arg_max
    );

    $array[] = array(
        'algName'=>'Ontobuilder Term Match',
        'algSim'=>$term_match,
        'isMax'=>$Term_Match_arg_max
    );

    $array[] = array(
        'algName'=>'WordNet Jiang Conrath',
        'algSim'=>$WordNet,
        'isMax'=>$WordNet_arg_max
    );
}
sqlsrv_free_stmt($getResults);
echo json_encode($array);
