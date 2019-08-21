<?php



$riddle_1=stripcslashes($_POST['riddle_1']);
$riddle_2=stripcslashes($_POST['riddle_2']);
$riddle_3=stripcslashes($_POST['riddle_3']);
$riddle_4=stripcslashes($_POST['riddle_4']);
$riddle_5=stripcslashes($_POST['riddle_5']);
$riddle_6=stripcslashes($_POST['riddle_6']);
$riddle_7=stripcslashes($_POST['riddle_7']);
$user_id=stripcslashes($_POST['user_id']);



$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


if($riddle_1 === null)
{
    $riddle_1=-1;
}
if($riddle_2 === null)
{
    $riddle_2=-1;
}
if($riddle_3 === null)
{
    $riddle_3=-1;
}
if($riddle_4 === null)
{
    $riddle_4=-1;
}
if($riddle_5=== null)
{
    $riddle_5=-1;
}
if($riddle_6=== null)
{
    $riddle_6=-1;
}
if($riddle_7 === null)
{
    $riddle_7=-1;
}


$sql="insert into riddles(user_id, riddle_1, riddle_2, riddle_3, riddle_4, riddle_5, riddle_6, riddle_7, time) 
values($user_id,$riddle_1,$riddle_2,$riddle_3,$riddle_4,$riddle_5,$riddle_6,$riddle_7,getdate())";


$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
{
    echo "err";
    die();
}
sqlsrv_free_stmt($getResults);
echo "1";
