// It's not pretty, but that can come in time
Crafty.scene("EndGame", function() {
    var winner = '';
    var coins = [];
    
    for(var x in players) {
        var p = players[x];
        if(p.health > 0) {
            winner = p.name;
        }
        else {
            if(!coins[0]) {
                coins.push(p.player_id);
            }
            else {
                for(var c in coins) {
                    var pc = coins[c];
                    if(p.score > players[pc].score) {
                        coins.splice(c,0,p.player_id);
                        break;
                    }
                }
            }
        }
    }
    
    var text = "";
    var positions = ['second', 'third', 'last', 'nowhere'];
    for(var c in coins) {
        var p = players[coins[c]];
        text += p.name+" came "+positions[c]+"<br/>";
    }
    
    Crafty.background("rgb(150,150,150)");
    Crafty.e("2D, DOM, Text")
          .css({
              'height' : '50px',
              'width' : '700px',
              'text-align': 'center',
              'font-size' : '2em'
          })
          .text("Aaaaarrrrr<br/>"+winner+" is the winner<br/>"+text)
          .attr({ x: 32, y: 100 });;
    
          
  
});

Crafty.scene("Game", function() {
    Crafty.background("url('/res/img/sprite_water.png')");
    //-- Set Side of screen
    //-- Set everything in the leftmost and rightmost lanes as land
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y <= Game.map_grid.height; y++) {
            if ((x === 0) || (x === 11) && y < Game.map_grid.height) {
                Crafty.e('Land').at(x, y);
            }
            // create garbage collecor area
            if ((y === Game.map_grid.height)) {
                Crafty.e('Garbage').at(x, y);
            }
        }
    }
    
});

Crafty.scene("Menu", function() {
    var x = (Game.width()-310) / 2;
    Crafty.e("2D, DOM, Mouse, menu_easy")
          .attr({
              'x' : x,
              'y' : 20,
              'h' : 180,
              'w' : 310
          })
          .bind('Click', function(){
              Game.create(1);
          });
    
    Crafty.e("2D, DOM, Mouse, menu_medium")
          .attr({
              'x' : x,
              'y' : 220,
              'h' : 180,
              'w' : 310
          })
          .bind('Click', function(){
              Game.create(2);
          });
    
    Crafty.e("2D, DOM, Mouse, menu_hard")
          .attr({
              'x' : x,
              'y' : 420,
              'h' : 180,
              'w' : 310
          })
          .bind('Click', function(){
              Game.create(3);
          });
});

Crafty.scene("Loading", function() {
    Crafty.background("url('/res/img/sprite_water.png')");
    
    Crafty.e("2D, DOM, Text")
          .text("Loading....")
          .attr({
              'x': 0,
              'y': Game.height()/2 - 24,
              'w': Game.width()
          })
          .css({
              'color': 'white',
              'font-family': 'Arial',
              'font-size': '24px',
              'text-align': 'center'
          });
    
    //-- Sprite Loading
    Crafty.sprite(64, "/res/img/island1.png", { island1: [0, 0]});
    Crafty.sprite(64, "/res/img/island2.png", { island2: [0, 0]});
    Crafty.sprite(64, "/res/img/island3.png", { island3: [0, 0]});
    Crafty.sprite(64, "/res/img/ship1.png", { ship1: [0, 0]});
    Crafty.sprite(64, "/res/img/ship_blue.png", { ship_blue: [0, 0]});
    Crafty.sprite(64, "/res/img/ship_red.png", { ship_red: [0, 0]});
    Crafty.sprite(64, "/res/img/ship_yellow.png", { ship_yellow: [0, 0]});
    Crafty.sprite(64, "/res/img/ship_green.png", { ship_green: [0, 0]});
    Crafty.sprite(64, "/res/img/canonball.png", { cannonball: [0, 0]});
    Crafty.sprite(64, "/res/img/heart.png", { heart: [0, 0]});
    Crafty.sprite(64, "/res/img/coin.png", { coin: [0, 0]});
    Crafty.sprite(64, "/res/img/star.png", { star: [0, 0]});
    
    Crafty.sprite("/res/img/menu_buttons.png", {
        'menu_easy'   : [0, 0],
        'menu_medium' : [0, 180],
        'menu_hard'   : [0, 360]
    });
    
    Crafty.scene("Menu");
});
