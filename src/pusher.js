var pusher = new Pusher('8d6d30d2c32b3a486688');
var channel = pusher.subscribe('test_channel');

//-- Events

// New User Event
channel.bind("newUser_event", function(data) {
   console.log("Pusher newUser: " + data.name);
   addNewPlayer(data.id, data.name);
   if (Game.playerCount == 4) {gameStart()};
});

// Key Press
channel.bind("keyPress_event", function(data) {
    console.log("Pusher keyPress: " + data.id + " " + data.button);
    movePlayer(data.id, data.button);
});

//-- RANDOMS
//var myVar = setInterval(function(){randomTest("0.6")}, 1000);
var myVar2 = setInterval(function(){gameSpeedStuff()}, 7000);

function randomTest(justHowRandom)
{
    if (objectLength(players) > 0)
    {
        if (Math.random() < justHowRandom) {
            createWorldObject(Math.floor(Math.random()*10), Math.floor(Math.random()*10));
        }
    }
}

function gameSpeedStuff()
{
    if (objectLength(players) > 0)
    {
        if (Game.gameSpeed < 10)
        {
            Game.gameSpeed = Game.gameSpeed + 1;
            console.log("Game Just got faster! " + (15 - Game.gameSpeed));
        }
    }
}

function gameStart()
{
    Game.gameStart = true;
    console.log("Game Start!");
}