<?php
// Start the session
session_start();
require("config.php");
set_include_path(get_include_path() . PATH_SEPARATOR . 'phplib');
include('Net/SSH2.php');

header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 0);
error_reporting(0);
session_start();

$namer =$_SESSION['namer'];
print("Hello I reached\n");

$typeSeq=$_SESSION['typeSeq'];
$coverage=$_SESSION['coverage'];
$evalue=$_SESSION['evalue'];
$identity=$_SESSION['identity'];
$algorithm=$_SESSION['algorithm'];
$terms = $_SESSION['terms'];
$level=$_SESSION['level2'];
$method=$_SESSION['method'];
$seqType=$_SESSION['seqType'];

$targetdir = '/var/www/html/deepnec-2.0/tmp/';
////$namer=$_POST['namer'];
$sequenceTargetfile = $targetdir.$namer.".fasta";
$input="/tmp/".$namer.".fasta";

$dir=$namer."_".$level;
$out=$dir.".txt";






$ssh = new Net_SSH2('biocluster.usu.edu', 22);
if (!$ssh->login(MY_USER, MY_PASSWORD)) {
    exit('Login Failed');
}

$ssh->setTimeout(false);

$job="sbatch /home/naveen/deepnec/deepnecrun.sl /home/naveen/deepnec".$input." ".$level." ".$terms." ".$method." ".$algorithm." /home/naveen/deepnec/tmp/".$dir." ".$out." ".$evalue." ".$coverage." ".$identity." ".$seqType;
// echo($job);
$ssh->exec($job);
//
//Sending completion email to user\
if ($method === 'DNN'){
    $response=$dir."+".$method."+".$level2;
}
else{
    $response=$dir."+".$method."+".$level2."+".$evalue."+".$coverage."+".$identity;
}
//echo($response);






print($response);

?>





