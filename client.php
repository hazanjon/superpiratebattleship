<!DOCTYPE html>
<head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <link href="/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script>
    
    var pusher = new Pusher('8d6d30d2c32b3a486688', { authEndpoint: '/pusher_auth.php' });
    var channel = pusher.subscribe('test_channel');
    var privateChannel = pusher.subscribe('private-channel');
    
    var user_id = '<?php echo $_GET['id']; ?>';
    var control = function(num){
        privateChannel.trigger('client-ev', {id: user_id, button: num});

    }
    </script>
</head>
<body>
<?php echo $_GET['id']; ?>
    <div class="row">
        <button class="btn btn-info span2 offset2" onclick="control(2)">Up</button>
    </div>
    <div class="row">
        <button class="btn btn-info span2" onclick="control(4)">Left</button>
        <button class="btn btn-info span2" onclick="control(5)">Fire</button>
        <button class="btn btn-info span2" onclick="control(6)">Right</button>
    </div>
    <div class="row">
        <button class="btn btn-info span2 offset2" onclick="control(8)">Down</button>
    </div>


</body>
</html>