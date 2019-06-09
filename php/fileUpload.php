<?php
$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);

$exp_name=stripcslashes($_POST['exp_name']);

if (!empty($_FILES)) {
    $total=count($_FILES['file']['name']);
    $arr = "";
    for( $i=0 ; $i < $total ; $i++ ) {
        $target_dir = "D:\home\\site\\wwwroot\\exp_files\\$exp_name\\";
        if (!is_dir($target_dir)) {
            mkdir($target_dir);
        }
        // user time() to not overwrite if exists
        //$new_name = time() . '_' . basename($_FILES["file"]["name"][$i]);
        $new_name = basename($_FILES["file"]["name"][$i]);
        $target_file = $target_dir . $new_name;
        //echo $target_file;
        if (move_uploaded_file($_FILES['file']['tmp_name'][$i], $target_file)) {
            $arr =$arr.",0";

        }
        else{
            echo 'err';
        }
    }
} else {
    echo("1");
}
echo 0;