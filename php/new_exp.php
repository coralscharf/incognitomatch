<?php
$exp_name=stripcslashes($_POST['exp_name']);
$exp_sch_name=stripcslashes($_POST['exp_sch_name']);
$exp_max_num_pairs=stripcslashes($_POST['exp_max_num_pairs']);
$exp_max_duration=stripcslashes($_POST['exp_max_duration']);
$show_type=stripcslashes($_POST['show_type']);
$show_instance=stripcslashes($_POST['show_instance']);
$show_hierarchy=stripcslashes($_POST['show_hierarchy']);
$show_system_sugg=stripcslashes($_POST['show_system_sugg']);
$show_major_res=stripcslashes($_POST['show_major_res']);
$set_active=stripcslashes($_POST['set_active']);
//$files = $_POST['files'];

$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

if ($show_type === "false")
{
    $show_type=0;
}
else
{
    $show_type=1;
}
if ($show_instance === "false")
{
    $show_instance=0;
}
else
{
    $show_instance=1;
}

if ($show_hierarchy === "false")
{
    $show_hierarchy=0;
}
else
{
    $show_hierarchy=1;
}
if ($show_system_sugg === "false")
{
    $show_system_sugg=0;
}
else
{
    $show_system_sugg=1;
}
if ($show_major_res === "false")
{
    $show_major_res=0;
}
else
{
    $show_major_res=1;
}
if ($set_active === "false")
{
    $set_active=0;
}
else
{
    $set_active=1;
}

$sql="insert into experiments (name, schema_name, max_num_pairs, max_duration,
    disp_type, disp_instance, disp_h, disp_system_sugg, disp_major_res, is_active) OUTPUT INSERTED.id
    values('$exp_name','$exp_sch_name',$exp_max_num_pairs,$exp_max_duration,$show_type,$show_instance,$show_hierarchy,
    $show_system_sugg,$show_major_res,$set_active)";
$getResults= sqlsrv_query($conn, $sql);
if ($getResults == FALSE)
    echo "err";
$exp_id="";
while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
    $exp_id=$row['id'];
}

echo $exp_id;
sqlsrv_free_stmt($getResults);
/*$xml="";
for ($i=0; $i<sizeof($files['xml']);$i++)
{
    $xml=$xml.$files['xml'][$i].',';
}
$xml=substr($xml,0,strlen($xml)-1);
$param = "-id $exp_id -p \"".$files['csv']."\" -xs \"".$files['xsd'][0].",".$files['xsd'][1]."\" -xm \"$xml\"";

$command="D:\home\site\wwwroot\script\\new_exp.exe ".$param;
//echo $command;
$out= shell_exec($command);
echo $out;
//$out= shell_exec ("D:\home\site\wwwroot\aviv\scripts\cluster.exe \"BANK OF AMERICA CORPORATION\"" );
//exec( "D:\home\site\wwwroot\aviv\scripts\cluster.exe \"BANK OF AMERICA CORPORATION\"", $output,$ret);
//exec( "D:\home\site\wwwroot\aviv\scripts\hello.exe", $output,$ret);
//echo $ret;*/

