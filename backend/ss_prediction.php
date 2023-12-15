<?php

require("config.php");
set_include_path(get_include_path() . PATH_SEPARATOR . 'phplib');
include('Net/SSH2.php');
session_start();
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(0);

$namer = $_SESSION['namer'];
// $namer='1638962109853';
$id = $_SESSION['id'];
// $id='O22544';

//$input="/var/www/html/deepNEC/tmp/".$namer.".fasta";
$out=$namer."_".$id."_ss.fasta";
//$ott="/var/www/html/deepNEC/tmp/".$out;
//$cmd="python3 /var/www/html/deepNEC/scripts/seq_extract.py ".$input." ".$id." ".$ott;

//shell_exec($cmd);

$ssh = new Net_SSH2('biocluster.usu.edu', 22);
if (!$ssh->login(MY_USER, MY_PASSWORD)) {
    exit('Login Failed');
}

$ssh->setTimeout(false);
$horiz=$namer."_".$id."_ss.horiz";
$ss=$namer."_".$id."_ss.ss";
$ss2=$namer."_".$id."_ss.ss2";

// $job='module load psipred/4.0; sbatch  --j ss_deepnec --partition guru -W --wrap "runpsipredplus /home/naveen/deepnec/tmp/'.$out.'"';
$job="sbatch  /home/naveen/deepnec/tmp/ss_pred.sl /home/naveen/deepnec/tmp/".$out." ".$horiz." ".$ss." ".$ss2;
echo $job;
$ssh->exec($job);
$resp=$namer."+".$id;
print($resp);


?>