// It's not pretty, but that can come in time
Crafty.scene("EndGame", function() {
    for(var prop in players) {
        if (players.hasOwnProperty(prop)) {
            var name = players[prop].name;
        }
    }
    
    Crafty.e("2D, DOM, Text")
          .css({
              'height' : '50px',
              'width' : '700px',
              'text-align': 'center'
          })
          .text("Aaaaarrrrr<br/>"+name+" is the winner");
});

Crafty.scene("Game", function() {
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
    Crafty.sprite(64, "Design/assets/img/island1.png", { island1: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/island2.png", { island2: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/island3.png", { island3: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/ship1.png", { ship1: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/ship_blue.png", { ship_blue: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/ship_red.png", { ship_red: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/ship_yellow.png", { ship_yellow: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/ship_green.png", { ship_green: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/canonball.png", { cannonball: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/heart.png", { heart: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/coin.png", { coin: [0, 0]});
    Crafty.sprite(64, "Design/assets/img/star.png", { star: [0, 0]});
    
    Crafty.sprite("Design/assets/img/menu_buttons.png", {
        'menu_easy'   : [0, 0],
        'menu_medium' : [0, 180],
        'menu_hard'   : [0, 360]
    });
    
    Crafty.scene("Menu");
});