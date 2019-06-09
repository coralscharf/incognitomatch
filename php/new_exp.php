<?php
$exp_name=stripcslashes($_POST['exp_name']);
$exp_sch_name=stripcslashes($_POST['exp_sch_name']);
$exp_num_pairs=stripcslashes($_POST['exp_num_pairs']);
$show_instance=stripcslashes($_POST['show_instance']);
$show_type=stripcslashes($_POST['show_type']);
$show_hierarchy=stripcslashes($_POST['show_hierarchy']);
$show_feedback=stripcslashes($_POST['show_feedback']);
$show_control=stripcslashes($_POST['show_control']);
$files = $_POST['files'];


$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);


if ($show_instance === "false")
{
    $show_instance=0;
}
else
{
    $show_instance=1;
}
if ($show_type === "false")
{
    $show_type=0;
}
else
{
    $show_type=1;
}
if ($show_hierarchy === "false")
{
    $show_hierarchy=0;
}
else
{
    $show_hierarchy=1;
}
if ($show_feedback === "false")
{
    $show_feedback=0;
}
else
{
    $show_feedback=1;
}
if ($show_control === "false")
{
    $show_control=0;
}
else
{
    $show_control=1;
}
$sql="insert into experiments(name, schema_name, num_pairs, disp_instance, disp_type, disp_h, disp_feedback, disp_control) 
values('$exp_name','$exp_sch_name',$exp_num_pairs,$show_instance,$show_type,$show_hierarchy,$show_feedback,$show_control)";
$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    return (sqlsrv_errors());
sqlsrv_free_stmt($getResults);
$xml="";
for ($i=0; $i<sizeof($files['xml']);$i++)
{
    $xml=$xml.$files['xml'][$i].',';
}
$xml=substr($xml,0,strlen($xml)-1);
$param = " -p \"".$files['csv']."\" -xs \"".$files['xsd'][0].",".$files['xsd'][0]."\" -xm \"$xml\"";

$command="D:\\home\\site\\wwwroot\\scripts\\new_exp.exe ".$param;
echo $command;
//$out= shell_exec ( $command);

//$out= shell_exec ("D:\home\site\wwwroot\aviv\scripts\cluster.exe \"BANK OF AMERICA CORPORATION\"" );
//exec( "D:\home\site\wwwroot\aviv\scripts\cluster.exe \"BANK OF AMERICA CORPORATION\"", $output,$ret);
//exec( "D:\home\site\wwwroot\aviv\scripts\hello.exe", $output,$ret);
//echo $ret;
echo "1";
