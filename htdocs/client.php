<?php
include("definitions.php");
?>

<!DOCTYPE html>
<head>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <link href="/res/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <script>
        var pusher = new Pusher('<?php echo PUSHER_KEY;?>', { authEndpoint: '/pusher_auth.php' });
        var privateChannel = pusher.subscribe('<?php echo "private-channel".$_GET['game_id'];?>');
        
        var user_id = '<?php echo $_GET['id']; ?>';
        var control = function(num){
            console.log(num);
            privateChannel.trigger('client-ev', {id: user_id, button: num});
        }
    </script>
</head>
<body>
<?php
/*echo "<p>Game_id : {$_GET['game_id']}</p>
      <p>Your id :{$_GET['id']}</p>
      <p>Response:</p>
      <xmp>{$response}</xmp>
";*/
?>
    <table>
        <tr>
            <td><button class="btn btn-info span2" onclick="control(1)">1</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(2)">2</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(3)">3</button>
            </td>
        </tr>
        <tr>
            <td><button class="btn btn-info span2" onclick="control(4)">4</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(5)">5</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(6)">6</button>
            </td>
        </tr>
        <tr>
            <td><button class="btn btn-info span2" onclick="control(7)">7</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(8)">8</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(9)">9</button>
            </td>
        </tr>
        <tr>
            <td><button class="btn btn-info span2" onclick="control(*)">*</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(0)">0</button>
            </td>
            <td><button class="btn btn-info span2" onclick="control(#)">#</button>
            </td>
        </tr>
    </table>
</body>
</html>