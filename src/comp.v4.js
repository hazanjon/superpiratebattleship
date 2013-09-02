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

//-- Land is used for the left and right areas
Crafty.c('Land', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Solid');
    this.color('rgba(46, 204, 113, 1)');
  },
});

//-- Basic garbage collection
Crafty.c('Garbage' , {
    init: function() {
    this.requires('2D, Canvas, Grid, Color, Solid');
        this.color('rgba(46, 204, 113, 0)');
      },
});

//-- Islands
Crafty.c('Island', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, island2')
        .color('rgb(211, 84, 0)')
        .bind('gametick', function(){
            this.y += Game.map_grid.tile.height;
        })
        .onHit('Player', this.hitTest)
        .onHit('ShootRight', this.cannon)
        .onHit('Garbage', this.garbageCollector);
    },
    hitTest: function(data) {
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        updateHealth(player_id, -1);
        //-- Destroy element
        this.destroy();
        
    },
    garbageCollector: function(data) {
        this.destroy();
    },
    cannon: function(data) {
        this.destroy();
    }
});

Crafty.c('Player', {
    init: function() {
        this.requires('2D, Canvas, Grid, Color, Fourway, Collision, Actor, ship1')
        .fourway(2)
        .color('rgb(0, 67, 171)')
        .onHit('Land', this.hitTest);
    },
    hitTest: function(data) {
        //-- Stop movement if its on a LAND Object
        if (this.x < Game.map_grid.tile.width) {this.x = Game.map_grid.tile.width;}
        if (this.x > ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width)) {this.x = ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width);}
    }
});

Crafty.c('Health', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, heart')
        .color('rgb(0, 67, 171)')
        .bind('gametick', function(){
            this.y += Game.map_grid.tile.height;
        })
        .onHit('Garbage', this.garbageCollector)
        .onHit('ShootRight', this.cannon)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://hack.hazan.me/webhook.php', {player_id: player_id, type: 'health'});
        updateHealth(player_id, 1);
        //-- Destroy element
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    },
    cannon: function(data) {
        this.destroy();
    }
});

Crafty.c('Coins', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, coin')
        .color('rgb(0, 67, 171)')
        .bind('gametick', function(){
            this.y += Game.map_grid.tile.height;
        })
        .onHit('Garbage', this.garbageCollector)
        .onHit('ShootRight', this.cannon)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        //-- The player has been hit! Get player var
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://hack.hazan.me/webhook.php', {player_id: player_id, type: 'coin'});
        updateScore(player_id, 1);
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    },
    cannon: function(data) {
        this.destroy();
    }
});

Crafty.c('Powerup', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, star')
        .color('rgb(0, 67, 171)')
        .bind('gametick', function(){
            this.y += Game.map_grid.tile.height;
        })
        .onHit('Garbage', this.garbageCollector)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        //-- The player has been hit! Get player var
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://hack.hazan.me/webhook.php', {player_id: player_id, type: 'powerup'});
        givePowerup(player_id, true);
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    }
});

Crafty.c('ShootRight', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, cannonball')
        .color('rgb(0, 67, 171)')
        .tween({x: this.x  + 1000, y: this.y}, 100)
        .onHit('Garbage', this.garbageCollector)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        console.log("dskfsd");
       var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        updateHealth(player_id, 2);
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    }
});

Crafty.c('ShootLeft', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Tween, Collision, Actor, cannonball')
        .color('rgb(0, 67, 171)')
        .tween({x: this.x  - 1000, y: this.y}, 100)
        .onHit('Garbage', this.garbageCollector)
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
       var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        console.log(player_id);
        updateHealth(player_id, 2);
        this.destroy();
    },
    garbageCollector: function()
    {
        //console.log("Destroyed");
        this.destroy();
    }
});