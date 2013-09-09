var players     = new Array(); //-- Setup all player array information
var movement    = {}; //-- Sets up all potential movement
var pEntity     = new Array(); //-- Hack to find player object based on entity
debug           = false;

Game = {
    // Basic Variables
    map_grid: {
        width:  12,
        height: 10,
        tile: {
          width:  64,
          height: 64
        }
    },
    channel         : false,
    music           : false,
    gameStart       : false,
    difficulty      : 1,
    playerCount     : 2,
    startingHealth  : 5,
    speed           : 20,
    ships           : ['ship_blue', 'ship_green', 'ship_yellow', 'ship_red'],

    width: function() {
        return Game.map_grid.width * Game.map_grid.tile.width;
    },
    
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
    
    start: function() {
        if(!Game.gameStart){
            Crafty.init(Game.width(), Game.height());
            Crafty.background('rgb(0, 67, 171)');
            Crafty.scene("Loading");
        }
        else {
            Crafty.scene("Menu");
        }
    },
    
    create: function(difficulty) {
        this.difficulty = difficulty;
        // sadly have to use ajax for this at the moment :(
        $.get('index.php', {'newGame':true}, this.created);
    },
    
    created: function(data) {
        console.log(data);
        if(!isNaN(data.game_id) && data.game_id > 0) {
            $("#phoneNumber").text(data.phone);
            $("#gameCode").text(data.game_id);
            $(".callIn").show();
            $(".overlay").fadeOut("slow", function(){ $(this).remove() });
            this.channel = subscribeChannel(data.game_id);
            Crafty.scene("Game");
        }
    },

    tick: function(debug) {
        if(debug) {
            Crafty.trigger('gametick');
        }
        this.movePlayers();
    },
    
    movePlayersData: function(player_id, button) {
        //-- movePlayers will now hold data until we ask for it
        console.log('Player data : '+player_id +' '+ button);
        movement[player_id] = button;
    },
    
    movePlayers: function() {
        //-- Lets go through each element, and see what direction we are 
        //-- going to attempt
        for(var prop in movement) {
            if (movement.hasOwnProperty(prop)) {
                //-- Do the movement
                this.actuallyMovePlayer(prop, movement[prop]);
                //-- Clear movement
                delete movement[prop];
            }
        }
    },
    
    actuallyMovePlayer: function(player_id, dir) {
        //-- YES, its three functions.
        if (players[player_id] === undefined) {
           console.log("Player not found - " + player_id);
           return false;
        }
        
        players[player_id].move(dir);
    },
    
    addNewPlayer: function(player_id, player_name) {
        players[player_id] = new Player(player_id, player_name);
        //-- Run our check for total players
        if (Game.playerCount === objectLength(players)) {
            //-- Run Game Start
            gameStart(debug);
        }
    },
    
    createWorldObject: function(position, type) {
        //-- A world object will enter the screen at the top, 
        //-- tetris style!
        var myPositionX = (position + 1);
        
        if (type == 0) {
            //-- Will be a POWERUP
            Crafty.e('Powerup').at(myPositionX, 0);
        } else if (type == 1) {
            //-- Good thing - Coins
            Crafty.e('Coins').at(myPositionX, 0);
        } else if (type == 2) {
            //-- Good thing - Health
            Crafty.e('Health').at(myPositionX, 0);
        } else {
            //-- Going to need a random island
            var r = Math.floor(Math.random()*3) + 1;
            if (r == 1) {Crafty.e('Island, island1').at(myPositionX, 0);}
            if (r == 2) {Crafty.e('Island, island2').at(myPositionX, 0);}
            if (r == 3) {Crafty.e('Island, island3').at(myPositionX, 0);}
        }
    },
    
    winCondition: function() {
        for(var prop in players) {
            if (players.hasOwnProperty(prop)) {
                this.music.stop();
                Crafty.scene("EndGame");
                //window.location = 'win.php?id=' + prop + '&name=' + players[prop]['name'];
            }
        }
    }
    
    
}

//-- Just for testing for the time being

function objectLength(obj) 
{
    //-- Length of our arrays
    var result = 0;
    for(var prop in obj) {if (obj.hasOwnProperty(prop)) {result++;}}
    return result;
}

function gameStart(debug)
{
    console.log("Game Started");
   if (debug) {
        setInterval(function(){Game.tick(debug)}, 1000);
        setInterval(function(){randomTest("0.6")}, 1000);
    } else {
    	createEqCanvas();
    	/*
        hack.setup();
        hack.create(56526690);
        */
    }
}