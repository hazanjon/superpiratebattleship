// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});
 
Crafty.c('Land', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Solid');
    this.color('rgb(46, 204, 113)');
  },
});

Crafty.c('Garbage' , {
    init: function() {
    this.requires('2D, Canvas, Grid, Color, Solid');
        this.color('rgba(46, 204, 113, 0)');
      },
});

Crafty.c('Test', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor')
        .color('rgb(211, 84, 0)')
        //.tween({x: this.x, y: this.y + 800}, (15 - Game.gameSpeed) * 100)
        .bind('gametick', function(){
            //this.tween({x: this.x, y: this.y + 640}, (15 - Game.gameSpeed) * 100)
            this.y += 340;            
            console.log(this, this.y);
        })
        .onHit('Player', this.hitTest)
        .onHit('Garbage', this.garbageCollector);
    },
    hitTest: function(data) {
        if (Game.gameStart == true)
        {
            //-- The player has been hit! Get player var
            var playerCollide = (playerEnts[data[0].obj._entityName]);
            playerHealth[playerCollide] = (playerHealth[playerCollide] - 1);
            var myHealth = (playerHealth[playerCollide]);
            console.log("Collision between " + playerCollide + " and world object. Health: " + myHealth);
            niceName = playerCollide.replace('+', 'b');
            $('.' + niceName + ' .lazyhealth').html(myHealth)
            this.destroy();
            
            //-- Very simple end game
            if (myHealth == 0)
            {
                alert(playerName[playerCollide] + " has died");
                players[playerCollide].destroy();
                $('.' + niceName + ' .lazyhealth').html("DEAD")
                delete players[playerCollide];
                
                //-- Check if last player left?
                if (objectLength(players) == 1)
                {
                    alert("Game over condition");
                }
                
                 if (objectLength(players) == 0)
                {
                    alert("Game over condition - Noone wins!");
                }
            }
        }
    },
    garbageCollector: function()
    {
        console.log("Destroyed");
        this.destroy();
    }
});

Crafty.c('Good_health', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor')
        .color('rgb(192, 57, 43)')
        .tween({x: this.x, y: this.y + 800}, 400)
        .onHit('Garbage', this.garbageCollector)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        //-- The player has been hit! Get player var
        var playerCollide = (playerEnts[data[0].obj._entityName]);
        playerHealth[playerCollide] = (playerHealth[playerCollide] + 1);
        var myHealth = (playerHealth[playerCollide]);
        console.log("Collision between " + playerCollide + " and GOOD world object. Health: " + myHealth);
        niceName = playerCollide.replace('+', 'b');
        $('.' + niceName + ' .lazyhealth').html(myHealth)
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    }
});

Crafty.c('Player', {
    init: function() {
        this.requires('2D, Canvas, Grid, Color, Fourway, Collision, Actor')
        .fourway(4)
        .color('rgb(127, 140, 141)')
        .onHit('Land', this.hitTest);
    },
    hitTest: function(data) {
        //-- Stop movement if its on a LAND Object
        if (this.x < Game.map_grid.tile.width) {this.x = Game.map_grid.tile.width;}
        if (this.x > ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width)) {this.x = ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width);}
    }
});