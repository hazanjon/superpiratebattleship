// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function() {
    	this.requires('2D, Canvas');
    	this.attr({w: Game.map_grid.tile.width, h: Game.map_grid.tile.height});
    },
 
  // Locate this entity at the given position on the grid
    at: function(x, y) {
    	if (x === undefined && y === undefined) {
	  		return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
  		}
  		else {
	  		this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
	  		return this;
  		}
    }
});

//-- Land is used for the left and right areas
Crafty.c('Land', {
  init: function() {
    this.requires('Grid, Color, Solid');
    this.color('rgba(46, 204, 113, 1)');
  },
});

//-- Basic garbage collection
Crafty.c('Garbage' , {
    init: function() {
    	this.requires('Grid, Color, Solid');
        this.color('rgba(96, 204, 113, 1)');
      },
});


Crafty.c('Player', {
    init: function() {
        this.requires('Grid, Color, Fourway, Collision, Actor, Tween, ship1')
        .fourway(2)
        .color('rgb(0, 67, 171)')
        .onHit('Land', this.hitTest)
        .onHit('Player', this.stopMovement);
    },
    hitTest: function(data) {
        //-- Stop movement if its on a LAND Object
        if (this.x < Game.map_grid.tile.width) {this.x = Game.map_grid.tile.width;}
        if (this.x > ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width)) {this.x = ((Game.map_grid.tile.width * (Game.map_grid.width - 1)) - Game.map_grid.tile.width);}
    },
    stopMovement: function(data) {
    	this._speed = 0;
    	if(this._movement) {
    		this.x -= this._movement.x;
    		this.y -= this._movement.y;
    	}
    }
});


Crafty.c('BaseObject', {
	init: function() {
		this.requires('Grid, Color, Tween, Collision')
			.onHit('Garbage', this.garbageCollector);
	},
	garbageCollector: function() {
		this.destroy();
	}
});

Crafty.c('GameTickObject', {
	init: function() {
		this.requires('BaseObject')
			.bind('gametick', function() {
				this.tween({x: this.x, y: this.y + Game.map_grid.tile.height}, Game.speed)
				//this.y += Game.map_grid.tile.height;
			});
	}
});

//-- Islands
Crafty.c('Island', {
  init: function() {
    this.requires('GameTickObject, Actor, island2')
        .color('rgb(211, 84, 0)')
        .onHit('Player', this.hitTest)
    },
    hitTest: function(data) {
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        players[player_id].updateHealth(-1);
        //-- Destroy element
        this.destroy();
    }
});

Crafty.c('Health', {
  init: function() {
    this.requires('GameTickObject, Actor, heart')
        .color('rgb(0, 67, 171)')
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://superpiratebattleship.com/webhook.php', {player_id: player_id, type: 'health'});
        players[player_id].updateHealth(1);
        //-- Destroy element
        this.destroy();
    }
});

Crafty.c('Coins', {
  init: function() {
    this.requires('GameTickObject, Actor, coin')
        .color('rgb(0, 67, 171)')
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        //-- The player has been hit! Get player var
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://superpiratebattleship.com/webhook.php', {player_id: player_id, type: 'coin'});
        players[player_id].updateScore(1);
        this.destroy();
    }
});

Crafty.c('Powerup', {
  init: function() {
    this.requires('GameTickObject, Actor, star')
        .color('rgb(0, 67, 171)')
        .onHit('Player', this.hitTest);
    },
    hitTest: function(data) {
        //-- The player has been hit! Get player var
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decreate health
        $.post('http://superpiratebattleship.com/webhook.php', {player_id: player_id, type: 'powerup'});
        players[player_id].givePowerup(true);
        this.destroy();
    }
});

Crafty.c('BaseCannonball', {
    init: function() {
        this.requires('BaseObject, Actor, cannonball')
            .color('rgb(0, 67, 171')
            .attr({'h':31, 'w': 31})
            .onHit('Player', this.hitPlayer)
            .onHit('GameTickObject', this.hitObject);
    },
    hitPlayer: function(data) {
        var player_id = pEntity[data[0].obj._entityName];
        //-- Decrease health
        players[player_id].updateHealth(-2);
        this.destroy();
    },
    hitObject: function(data) {
        data[0].obj.destroy();
     }
});

Crafty.c('ShootRight', {
  init: function() {
    this.requires('BaseCannonball')
        .tween({x: this.x  + 1000, y: this.y}, 100);
    }
});

Crafty.c('ShootLeft', {
  init: function() {
    this.requires('BaseCannonball')
        .tween({x: this.x  - 1000, y: this.y}, 100);
    }
});