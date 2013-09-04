var players     = new Array(); //-- Setup all player array information
var movement    = new Array(); //-- Setts up all potential movement
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
    gameSpeed: 10,
    gameStart: false,
    playerCount: 2,
    startingHealth:5,
    ships: ['ship_blue', 'ship_green', 'ship_yellow', 'ship_red'],

    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },
    
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
    
    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(0, 67, 171)');
        Crafty.scene("Loading");
    }
}

//-- Just for testing for the time being
function gametick(debug) 
{
    if (debug) {
        Crafty.trigger('gametick');
    }
    movePlayers();
}

function movePlayersData(player_id, button)
{
    //-- movePlayers will now hold data until we ask for it
    movement[player_id] = button;
}

function movePlayers()
{
    //-- Lets go through each element, and see what direction we are 
    //-- going to attempt
    console.log("Moving");
    for(var prop in movement) {
        if (movement.hasOwnProperty(prop)) {
            //-- Do the movement
            actuallyMovePlayer(prop, movement[prop]);
            //-- Clear movement
            delete movement[prop];
        }
    }
}

function actuallyMovePlayer(player_id, dir)
{
    //-- YES, its three functions.
    if (players[player_id] === undefined) 
    {
       console.log("Player not found - " + player_id);
       return false;
    }
    
    console.log("PID" + player_id);
    
    var myOldPositionY = (players[player_id]['object'].y);
    var myOldPositionX = (players[player_id]['object'].x);
    
    if (dir == 2) {players[player_id]['object'].attr({y: myOldPositionY - Game.map_grid.tile.height});}
    if (dir == 8) {players[player_id]['object'].attr({y: myOldPositionY + Game.map_grid.tile.height});}
    if (dir == 4) {players[player_id]['object'].attr({x: myOldPositionX - Game.map_grid.tile.width});}
    if (dir == 6) {players[player_id]['object'].attr({x: myOldPositionX + Game.map_grid.tile.width});}
    
    //-- Shoot
    if (dir == 5) {
        if (players[player_id]['powerup'] == true)
        {
            var xx = Crafty.e('ShootRight').attr({x: players[player_id]['object'].x + 64, y: players[player_id]['object'].y});
            var xx = Crafty.e('ShootLeft').attr({x: players[player_id]['object'].x - 64, y: players[player_id]['object'].y});
            givePowerup(player_id, false);
            players[player_id]['powerup'] = false;
        }
    }
}

function addNewPlayer(player_id, player_name)
{
    //-- add a new player to the screen
    players[player_id] = new Array();
    players[player_id]['object']    = Crafty.e('Player, Canvas, ' + Game.ships[objectLength(players) - 1]);
    players[player_id]['name']      = player_name;
    players[player_id]['health']    = Game.startingHealth;
    players[player_id]['score']     = 0;
    players[player_id]['powerup']   = false;
    players[player_id]['ent']       = players[player_id]['object']._entityName;
    
    //-- Hack for collisions
    pEntity[players[player_id]['object']._entityName] = player_id;
    
    //-- Set player up, ready to play
    players[player_id]['object'].attr({x: (objectLength(players) * (Game.map_grid.tile.width * 2)), y: (Game.map_grid.height * Game.map_grid.tile.height) - Game.map_grid.tile.height, color: 'rgb(' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')'});
    
    console.log("Added player: " + player_name + " [" + player_id + "] [" + players[player_id]['ent'] + "]");
    
    var myHealthBar = false;
    
    if (objectLength(players) == 1) {myHealthBar = "#3498db";}
    if (objectLength(players) == 2) {myHealthBar = "#2ecc71";}
    if (objectLength(players) == 3) {myHealthBar = "#f1c40f";}
    if (objectLength(players) == 4) {myHealthBar = "#c0392b";}
    
    //-- Add List - Sorry for the HTML
    niceName = player_id.replace('+', 'b');
    $('ul.ll').append('<li class="li_' + niceName + '"><div class="userListLi"><div class="userListName"><a href="client.php?id=' + encodeURIComponent(player_id) + '" style="color: #fff; text-decoration: none;" target="_blank">' + player_name + '</a></div><div class="userListPowerup"><img src="http://images.wikia.com/mario/images/4/4b/Ice_Flower_Artwork_-_New_Super_Mario_Bros._Wii.png" width="32px" height="32px" style="margin-left: 15px;margin-top:5px"></div><div class="userListCoinage"><img src="http://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Retro-Coin-icon.png" width="32px" style="margin-right: 15px;margin-top:-5px"><span>0</span></div><div style="clear: both"></div></div><div class="userListHealth" style="width: 100%;background: ' + myHealthBar + '"></div></li>');
    
    //-- Run our check for total players
    if (Game.playerCount === objectLength(players))
    {
        //-- Run Game Start
        gameStart(debug);
    }
}

function createWorldObject(position, type)
{
    //-- A world object will enter the screen at the top, 
    //-- tetris style!
    
    var myPositionX = (position + 1);
    
    //console.log("Generate object: " + position + " -> " + type);
    
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
        if (r == 1) {Crafty.e('Island, DOM, island1').at(myPositionX, 0);}
        if (r == 2) {Crafty.e('Island, DOM, island2').at(myPositionX, 0);}
        if (r == 3) {Crafty.e('Island, DOM, island3').at(myPositionX, 0);}
    }
    
}

function updateHealth(player_id, health_change)
{
    players[player_id]['health'] = players[player_id]['health'] + health_change;
    var pCent = Math.floor((players[player_id]['health'] / Game.startingHealth) * 100);
    if (pCent > 100) {pCent = 100;players[player_id]['health'] = Game.startingHealth;}
    niceName = player_id.replace('+', 'b');
    $('ul.ll li.li_' + niceName + ' .userListHealth').css('width', pCent + "%");
    
    //-- End of game conditions
    if (players[player_id]['health'] <= 0)
    {
        players[player_id]['object'].destroy();
        delete players[player_id];
        //-- Check for game end conditions
         if (objectLength(players) == 1)
        {
            //-- Work out who has won
            winCondition();
            //alert("Game over condition");
        }
        
        if (objectLength(players) == 0)
        {
            window.location = 'fail.php';
            //alert("Game over condition - Noone wins!");
        }
    }
}

function winCondition()
{
    for(var prop in players) {
        if (players.hasOwnProperty(prop)) {
            window.location = 'win.php?id=' + prop + '&name=' + players[prop]['name'];
        }
    }
}

function updateScore(player_id, score_change)
{
    players[player_id]['score'] = players[player_id]['score'] + score_change;
    niceName = player_id.replace('+', 'b');
    $('ul.ll li.li_' + niceName + ' .userListCoinage span').html(players[player_id]['score']);
}

function givePowerup(player_id, type)
{
    players[player_id]['powerup'] = true;
    niceName = player_id.replace('+', 'b');
    $('ul.ll li.li_' + niceName + ' .userListPowerup').show();
}

function objectLength(obj) 
{
    //-- Length of our arrays
    var result = 0;
    for(var prop in obj) {if (obj.hasOwnProperty(prop)) {result++;}}
    return result;
}

function killPlayer(player_id)
{
    updateHealth(player_id, -999);
}

function gameStart(debug)
{
    console.log("Game Started");
   if (debug) {
        setInterval(function(){gametick(debug)}, 1000);
        setInterval(function(){randomTest("0.6")}, 1000);
    } else {
    	createEqCanvas();
    	setInterval(function(){
    		Crafty.trigger('gametick');
    	}, 1000);
    	
    	/*
        hack.setup();
        hack.create(56526690);
        */
    }
}