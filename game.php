<?php 
include("definitions.php");
?>
<!DOCTYPE html>
<html>
<head>

    <link rel="stylesheet" type="text/css" href="Design/assets/css.css">

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="http://js.pusher.com/2.1/pusher.min.js"></script>
    <script src="lib/crafty.js"></script>
    <script src="src/game.js"></script>
    <script src="src/scenes.js"></script>
    <script src="src/components.js"></script>
    <script src="src/pusher.v4.js"></script>
    
    <!-- Soundcloud Stuff -->
    <script src="http://connect.soundcloud.com/sdk.js"></script>
    <script src="src/knockout-2.3.0.js"></script>
    <script src="src/soundcloud.js"></script>
    
    <script>
    $(document).ready(function() {
        var debug = false;
        
        //-- Window Load
        window.addEventListener('load', Game.start);
        
        $('.newPlayer').click(function() {
            Game.addNewPlayer("+" + Math.floor(Math.random()*54645645), "Jake");
            return false;
        }); 
        
        $('.newObs').click(function() {
            Game.createWorldObject(Math.floor(Math.random()*10), Math.floor(Math.random()*10));
            return false;
        });

    });
    </script>
</head>
<body>

    <div class="" style="position: relative; height: 100px; width: 640px; margin-left: 107px; margin-bottom: -20px">
		<canvas id="eq" style="width:100%; height:100%; border:1px solid black;"></canvas>
    </div>
    
    <div class="container">
        
        <div class="gameContainer">
            <div id="cr-stage" style="width: 384px; float: left;"></div>
        </div>
        
        <div class="rightSide">
            <h1 style="color: #FFF;text-align:center">01708 394044</h1>
            <div class="pirateGameLogo">
                <img src='Design/assets/img/logo.png' width="480px"/>
            </div>
        
            <a href='' class="newPlayer">Add New Player</a>
            <!--
            <a href='' class="newObs">Add World Object</a>
            -->
            
            <div class="userList">
                <ul class="ll">
                   
                </ul>
            </div>
        </div>
        
    </div>

</body>
</html>