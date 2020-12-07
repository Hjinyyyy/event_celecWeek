<?php
include '../_config/set.php';
include_once $engine_dir."/_engine/include/common.lib.php";

if(empty($member_no)){
    $login_display = "block";
    $logout_display = "none";
}else{
    $login_display = "none";
    $logout_display = "block";
}

$mobile_agent = '/(iPad|iPod|iPhone|Android|BlackBerry|SymbianOS|SCH-M\d+|Opera Mini|Windows CE|Nokia|SonyEricsson|webOS|PalmOS)/';
if (preg_match($mobile_agent, $_SERVER['HTTP_USER_AGENT'])) {
    $browser_type = "mobile";
}else{
    $browser_type = "pc";
}

if($browser_type == "pc"){
    if($_SERVER["HTTP_HOST"] != "celecon.com"){
        header( 'Location: https://celecon.com/event/celeconEvent.php' );
    }
    include_once "./celeconEvent.html";
}else if($browser_type == "mobile"){
    if($_SERVER["HTTP_HOST"] != "m.celecon.com"){
        header( 'Location: https://m.celecon.com/event/celeconEvent.php' );
    }
    include_once  "./celeconEvent_mo.html";
}else{
    include_once "./celeconEvent.html";
}
?>