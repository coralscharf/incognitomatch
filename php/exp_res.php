<?php
$exp_id=stripcslashes($_POST['exp_id']);
$user_id=stripcslashes($_POST['user_id']);
$sch_id_1=stripcslashes($_POST['sch_id_1']);
$sch_id_2=stripcslashes($_POST['sch_id_2']);
$realconf=stripcslashes($_POST['realconf']);
$userconf=stripcslashes($_POST['userconf']);
$mouse_loc=$_POST['mouse_loc'];
$user_ans_match=stripcslashes($_POST['user_ans_match']);


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);
$mouse_str="";
for($i=0;$i<sizeof($mouse_loc);$i++)
{
    $s="(".$mouse_loc[$i]["time"].",".$mouse_loc[$i]["x"].",".$mouse_loc[$i]["y"].",".$mouse_loc[$i]["l"].",".$mouse_loc[$i]["r"].",".$mouse_loc[$i]["s"].");";
    if (strlen($s)+strlen($mouse_str)<2500)
        $mouse_str=$mouse_str.$s;
    else
        break;
}

$sql="insert into exp_results(user_id, exp_id, sch_id_1, sch_id_2, realconf, userconf,rec_time,mouse_loc,user_ans_is_match) 
    values($user_id,$exp_id,$sch_id_1,$sch_id_2,$realconf,$userconf,getdate(),'$mouse_str',$user_ans_match)";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "err";
sqlsrv_free_stmt($getResults);
echo "1";
