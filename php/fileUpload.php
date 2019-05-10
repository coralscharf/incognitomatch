<?php
$connectionInfo = array("UID" => "avivf@avivtest", "pwd" => "1qaZ2wsX!", "Database" => "avivtest", "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0);
$serverName = "tcp:avivtest.database.windows.net,1433";
$conn = sqlsrv_connect($serverName, $connectionInfo);



if (!empty($_FILES)) {
    $target_dir = "D:\home\\site\\wwwroot\\font\\";
    $name = $_POST['file'];
//print_r($_FILES);
    $new_name=time().'_'.basename($_FILES["file"]["name"]);
    $target_file = $target_dir .$new_name;
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        echo("file moved");

    }
} else {
    echo("error!!!");
}