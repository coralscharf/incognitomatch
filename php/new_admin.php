<?php
$user=stripcslashes($_POST['new_admin_email']);
$pass=md5($_POST['new_admin_pass']);
$user_name=stripcslashes($_POST['new_admin_name']);



$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);



$sql="INSERT into admins ([usr],[pass],f_name) OUTPUT Inserted.id values ('$user','$pass','$user_name')";

$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
{
    echo 'err';
    die();
}
else
{
    $uid="";
    while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
        $uid=$row['uid'];
    }
    session_start();
    $_SESSION['id'] = $uid;
    $_SESSION['full_name'] = $user_name;
    $_SESSION['user'] = $user;
    $_SESSION['time'] = time();
    if(isset($_SESSION['user']))
    {
        header('Location: /#');
    }


}