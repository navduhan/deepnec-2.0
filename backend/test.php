<?php   
$emailAddress = "duhan27dec@gmail.com";
$msgEmail =  $message = "Your deepNEC job is done!\nPlease go to https://bioinfo.usu.edu/deepNEC/deepnec-results.php?result= to see the results.";
    $msgEmail = wordwrap($msgEmail,70);
    $from = "noreply@bioinfo.biotec.usu.edu";
    $headers = "From: $from"; 
    // $mail= mail($emailAddress,"deepNEC results",$msgEmail,$headers,'-f '.$from);
    $mail = mail('duhan27dec@gmail.com', 'the subject', 'the message', "the headers");
 
    
    if($mail){
      echo "Email sent";
    }else{
      echo "Something went wrong with Mail."; 
    }



?>