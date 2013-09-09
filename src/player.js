Player = function(player_id, player_name) {
    var playerNum   = objectLength(players);
    this.player_id  = player_id;
    this.name       = player_name;
    this.niceName   = player_id.replace('+', 'b');
    this.score      = 0;
    this.health     = Game.startingHealth;
    this.powerup    = false;
    this.object     = Crafty.e('Player, Canvas, ' + Game.ships[playerNum]);
    this.ent        = this.object._entityName;
    
    // soomething to do with collisions?
    pEntity[this.object._entityName] = player_id;
    //-- Set player up, ready to play
    this.object.attr({
        x: ((playerNum+1) * (Game.map_grid.tile.width * 2)),
        y: (Game.map_grid.height * Game.map_grid.tile.height) - Game.map_grid.tile.height,
        color: 'rgb(' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ', ' + Math.floor(Math.random()*255) + ')'
    });
    console.log("Added player: " + player_name + " [" + player_id + "] [" + this.ent + "]");
    
    var myHealthBar = false;
    if (playerNum == 0) {myHealthBar = "#3498db";}
    if (playerNum == 1) {myHealthBar = "#2ecc71";}
    if (playerNum == 2) {myHealthBar = "#f1c40f";}
    if (playerNum == 3) {myHealthBar = "#c0392b";}
    
    //-- Add List - Sorry for the HTML
    $('ul.ll').append('<li class="li_' + this.niceName + '"><div class="userListLi"><div class="userListName"><a href="client.php?id=' + encodeURIComponent(player_id) + '" style="color: #fff; text-decoration: none;" target="_blank">' + player_name + '</a></div><div class="userListPowerup"><img src="http://images.wikia.com/mario/images/4/4b/Ice_Flower_Artwork_-_New_Super_Mario_Bros._Wii.png" width="32px" height="32px" style="margin-left: 15px;margin-top:5px"></div><div class="userListCoinage"><img src="http://icons.iconarchive.com/icons/ph03nyx/super-mario/256/Retro-Coin-icon.png" width="32px" style="margin-right: 15px;margin-top:-5px"><span>0</span></div><div style="clear: both"></div></div><div class="userListHealth" style="width: 100%;background: ' + myHealthBar + '"></div></li>');
    
    
    this.move = function(dir) {
        var myOldPositionY = this.object.y;
        var myOldPositionX = this.object.x;
        
        if (dir == 2) {this.object.tween({y: myOldPositionY - Game.map_grid.tile.height}, Game.speed);}
        if (dir == 8) {this.object.tween({y: myOldPositionY + Game.map_grid.tile.height}, Game.speed);}
        if (dir == 4) {this.object.tween({x: myOldPositionX - Game.map_grid.tile.width}, Game.speed);}
        if (dir == 6) {this.object.tween({x: myOldPositionX + Game.map_grid.tile.width}, Game.speed);}
        //-- Shoot
        if (dir == 5) {
            if (true || this.powerup == true) {
                var x1 = Crafty.e('ShootRight').attr({x: this.object.x + Game.map_grid.tile.width, y: this.object.y + (Game.map_grid.tile.height/5)});
                var x2 = Crafty.e('ShootLeft').attr({x: this.object.x - Game.map_grid.tile.width, y: this.object.y + (Game.map_grid.tile.height/5)});
                this.givePowerup(false);
            }
        }
    };
    
    this.updateHealth = function(health_change) {
        this.health = this.health + health_change;
        var pCent = Math.floor((this.health / Game.startingHealth) * 100);
        if (pCent > 100) {
            pCent = 100;
            this.health = Game.startingHealth;
        }
        
        $('ul.ll li.li_' + this.niceName + ' .userListHealth').css('width', pCent + "%");
        //-- End of game conditions
        if (this.health <= 0) {
            this.object.destroy();
            delete players[this.player_id];
            //-- Check for game end conditions
            if (objectLength(players) == 1) {
                //-- Work out who has won
                Game.winCondition();
            }
            
            if (objectLength(players) == 0) {
                alert("Game over condition - Noone wins!");
                //Crafty.scene("GameOver");
            }
        }
    };
    
    this.kill = function() {
        this.updateHealth(-999);
    }
    
    this.givePowerup = function(value) {
        this.powerup = value;
        var niceName = this.player_id.replace('+', 'b');
        if(this.powerup) {
            $('ul.ll li.li_' + niceName + ' .userListPowerup').show();
        }
        else {
            $('ul.ll li.li_' + niceName + ' .userListPowerup').hide();
        }
    };
    
    this.updateScore = function(score_change) {
        this.score = this.score + score_change;
        $('ul.ll li.li_' + this.niceName + ' .userListCoinage span').html(this.score);
    };
    
    return this;
}
