var players     = new Array(); //-- Setup all player array information
var movement    = {}; //-- Sets up all potential movement
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
    game_id         : 0,
    channel         : false,
    equalizer       : false,
    music           : false,
    gameStart       : false,
    difficulty      : 1,
    playerCount     : 2,
    startingHealth  : 5,
    speed           : 20,
    ships           : ['ship_blue', 'ship_green', 'ship_yellow', 'ship_red'],
    pEntity         : [], //-- Hack to find player object based on entity

    width: function() {
        return Game.map_grid.width * Game.map_grid.tile.width;
    },
    
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
    
    init: function() {
        if(!Game.gameStart){
            Crafty.init(Game.width(), Game.height());
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
            Game.channel = subscribeChannel(data.game_id);
            Game.game_id = data.game_id;
            Crafty.scene("Game");
        }
    },
    
    begin: function(debug) {
        console.log("Game Started");
        if (debug) {
             setInterval(function(){Game.tick(debug)}, 1000);
             setInterval(function(){randomTest("0.6")}, 1000);
         } else {
             createEqCanvas();
         }
    },

    tick: function(debug) {

        Game.movePlayersVertical(1);
        Crafty.trigger('hitcheck');
        Game.movePlayersHorizontal(1);
        Crafty.trigger('gametick');
        Crafty.trigger('hitcheck');
        Game.usePlayerItem();
    },
    
    movePlayersData: function(player_id, button) {
        //-- movePlayers will now hold data until we ask for it
        movement[player_id] = button;
    },
    
    movePlayersVertical: function(distance) {
        //-- Lets go through each element, and see what direction we are 
        //-- going to attempt
        for(var prop in movement) {
            if (movement.hasOwnProperty(prop)) {

                if (typeof players[prop] === 'undefined')
                   continue;

                //-- Do the movement
                var result = players[prop].moveVertical(movement[prop], distance);
                //-- Clear movement
                if(result) //Only clear if it actually did something
                    delete movement[prop];
            }
        }
    },
    
    movePlayersHorizontal: function(distance) {
        //-- Lets go through each element, and see what direction we are 
        //-- going to attempt
        for(var prop in movement) {
            if (movement.hasOwnProperty(prop)) {

                if (typeof players[prop] === 'undefined')
                   continue;

                //-- Do the movement
                var result = players[prop].moveHorizontal(movement[prop], distance);
                //-- Clear movement
                if(result) //Only clear if it actually did something
                    delete movement[prop];
            }
        }
    },
    
    usePlayerItem: function() {
        //-- Lets go through each element, and see what direction we are 
        //-- going to attempt
        for(var prop in movement) {
            if (movement.hasOwnProperty(prop)) {

                if (typeof players[prop] === 'undefined')
                   continue;

                //-- Do the movement
                var result = players[prop].useitem(movement[prop]);
                //-- Clear movement
                if(result) //Only clear if it actually did something
                    delete movement[prop];
            }
        }
    },
    
    addNewPlayer: function(player_id, player_name) {
        players[player_id] = new Player(player_id, player_name);
        //-- Run our check for total players
        if (Game.playerCount === objectLength(players)) {
            //-- Run Game Start
            this.begin(debug);
        }
    },
    
    createWorldObject: function(position, type) {
        //-- A world object will enter the screen at the top, 
        //-- tetris style!
        var myPositionX = (position + 1);
        
        if (type == 0) {
            //-- Will be a POWERUP
            Crafty.e('Powerup').at(myPositionX, -1);
        } else if (type == 1) {
            //-- Good thing - Coins
            Crafty.e('Coins').at(myPositionX, -1);
        } else if (type == 2) {
            //-- Good thing - Health
            Crafty.e('Health').at(myPositionX, -1);
        } else {
            //-- Going to need a random island
            var r = Math.floor(Math.random()*3) + 1;
            if (r == 1) {Crafty.e('Island, island1').at(myPositionX, -1);}
            if (r == 2) {Crafty.e('Island, island2').at(myPositionX, -1);}
            if (r == 3) {Crafty.e('Island, island3').at(myPositionX, -1);}
        }
    },
    
    webhook: function(player_id, type) {
        Game.channel.trigger('client-action', {player_id: player_id, game_id: this.game_id, type: type});
        $.post('http://superpiratebattleship.com/webhook.php', {'game_id': this.game_id, 'player_id': player_id, 'type': type});
    },
    
    winCondition: function() {
        this.music.stop();
        Crafty.scene("EndGame");
        //window.location = 'win.php?id=' + prop + '&name=' + players[prop]['name'];
    },
    
    getPlayerEntityFromCollision: function(data){
        return this.pEntity[data[0].obj._entityName];
    },
    
    checkWin: function() {
        // check for players still alive
        var count = 0;
        var winner = '';
        for(var x in players) {
            var p = players[x];
            if(p.health > 0) {
                winner = p.name;
                count++;
            }
        }
        
        if(count == 1) {
            Game.winner = winner;
            Game.winCondition();
        }
    }
    
}

function objectLength(obj) 
{
    //-- Length of our arrays
    var result = 0;
    for(var prop in obj) {if (obj.hasOwnProperty(prop)) {result++;}}
    return result;
}