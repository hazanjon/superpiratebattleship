<?php 
$db = new mysqli("localhost", "root", "online", "hackference");
$db->query("TRUNCATE events");
$db->query("TRUNCATE hack_users");

?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="Design/assets/css.css">
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
</head>
<body>
    
    <div style="width: 480px;margin: 30px auto">
        <img src='Design/assets/img/logo.png' width="480px"/>
        <h1 style="color: #FFF;text-align:center;">Arrrrrrrrrrr</h1>
        <h2 style="color: #FFF;text-align:center"><?php echo $_GET['name']; ?> is the Winner</h1>
    </div>
    
</body>
</html>