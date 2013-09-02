<!DOCTYPE html>
<head>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <script>
    
    var pusher = new Pusher('8d6d30d2c32b3a486688', { authEndpoint: '/pusher_auth.php' });
    var channel = pusher.subscribe('test_channel');
    var privateChannel = pusher.subscribe('private-channel');
    privateChannel.bind('client-ev', function(data) {
      alert(data);
    });
    
    var user_id = '<?php echo $_GET['id']; ?>';
    var left = function(){
        privateChannel.trigger('client-ev', {id: user_id, button: 4});

    }
    var right = function(){
        privateChannel.trigger('client-ev', {id: user_id, button: 6});

    }
    </script>
</head>
<body>
<?php echo $_GET['id']; ?>
    <div style="width: 30%; margin: 0 auto">
        <span style="width:30%; height:50px;" onclick="left()">Left</span>
        <span style="width:30%; height:50px;" onclick="right()">Right</span>
        
    </div>


</body>
</html>