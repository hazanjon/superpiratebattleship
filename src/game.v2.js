var players = new Array();
var playerEnts = new Array();
var playerHealth = new Array();
var playerName = new Array();

//-- Game Vars
var startingHealth = 1;

Game = {
    
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  12,
        height: 10,
        tile: {
          width:  32,
          height: 32
        }
    },
    gameSpeed: 10,
    gameStart: false,
    playerCount: 3,

    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },
    
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
    
    start: function() {
        Crafty.init(Game.width(), Game.height(), 'game');
        Crafty.background('rgb(41, 128, 185)');

        //-- Set everything in the leftmost and rightmost lanes as land
        for (var x = 0; x < Game.map_grid.width; x++) {
            for (var y = 0; y < Game.map_grid.height; y++) {
                if ((x === 0) || (x === 11)) {
                    Crafty.e('Land').at(x, y);
                }
                
                if ((y === Game.map_grid.height - 1)) {
                    console.log(y);
                    Crafty.e('Garbage').at(x, y);
                }
            }
        }
        
        gameStart();
    }
};

//-- dir
//-- 1 = Up
//-- 2 = Down
//-- 3 = Left
//-- 4 = Right
function movePlayer(player_name, dir)
{
    //if (dir === undefined) {dir = 1;}
    //-- Move 1 grid up
    
    if (players[player_name] === undefined) 
    {
       console.log("Player not found - " + player_name);
       return false;
    }

    var myOldPositionY = (players[player_name].y);
    var myOldPositionX = (players[player_name].x);
    
    if (dir == 2) {players[player_name].attr({y: myOldPositionY - Game.map_grid.tile.height});}
    if (dir == 8) {players[player_name].attr({y: myOldPositionY + Game.map_grid.tile.height});}
    if (dir == 4) {players[player_name].attr({x: myOldPositionX - Game.map_grid.tile.width});}
    if (dir == 6) {players[player_name].attr({x: myOldPositionX + Game.map_grid.tile.width});}
    
}

function createWorldObject(position, type)
{
    //-- A world object will enter the screen at the top, 
    //-- tetris style!
    
    var myPositionX = (position + 1);
    
    if (type == 8) {
        //-- Good thing
        console.log("New GOOD world object: " + position);
        var my1 = Crafty.e('Good_health').at(myPositionX, 0);
    } else {
         //-- Bad thing
        console.log("New BAD world object: " + position);
        var my1 = Crafty.e('Test').at(myPositionX, 0);
    }
    
}

function addNewPlayer(player_name, player_actualName)
{
    players[player_name] = Crafty.e('Player');
    playerHealth[player_name] = startingHealth;
    playerName[player_name] = player_actualName;
    var playerX = (objectLength(players) * 64) ;
    players[player_name].attr({x: playerX, y: (Game.map_grid.height * Game.map_grid.tile.height) - Game.map_grid.tile.height});
    var myCol = 'rgb(' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')';
    players[player_name].color(myCol);
    var ent = players[player_name]._entityName;
    playerEnts[players[player_name]._entityName] = player_name;
    console.log("Added player: " + player_name + " " + ent);
    niceName = player_name.replace('+', 'b');
    $('.playerTable tr:last').after('<tr class="' + niceName + '" style="background:' + myCol + '"><td>' + player_actualName + '</td><td>' + player_name + '</td><td class="lazyhealth">' + startingHealth + '</td></tr>');
}

function objectLength(obj) {
    var result = 0;
    for(var prop in obj) {if (obj.hasOwnProperty(prop)) {result++;}}
    return result;
}
