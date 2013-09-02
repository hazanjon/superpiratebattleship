//-- Load Game Grid
var gameGrid = [
    [0,0,0,0,1,0,0,0,0,0]
];

console.log(gameGrid);

Game = {
    
    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  12,
        height: 16,
        tile: {
          width:  32,
          height: 32
        }
    },
    
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },
    
    
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },
    
    start: function() {
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(41, 128, 185)');
        
        //-- Set everything in the leftmost and rightmost lanes as land
        for (var x = 0; x < Game.map_grid.width; x++) {
            for (var y = 0; y < Game.map_grid.height; y++) {
                if ((x === 0) || (x === 11)) {
                    Crafty.e('Land').at(x, y);
                }
            }
        }
        
        setInterval(function(){newData()}, 1000);
       
    }
};

function newData() {
    console.log("Requesting New Data");
     //-- Don't really want to put this here, but for testing
    for (var myX = 0; myX < (Game.map_grid.width - 2); myX++) {
        //-- Only use myY = 0
        myY = 0;
        if (gameGrid[myY][myX + 1] == 1) {
            Crafty.e('Test').at(myX + 1, myY);
        }
    }
}