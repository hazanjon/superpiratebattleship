$text_css = {
    'color': 'white',
    'font-family': 'Arial',
    'font-size': '24px',
    'text-align': 'center'
};

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

Crafty.scene("Info", function() {
	Crafty.scene("Game");
});

Crafty.scene("Loading", function() {
    Crafty.e("2D, DOM, Text")
          .text("Loading....")
          .attr({
              'x': 0,
              'y': Game.height()/2 - 24,
              'w': Game.width()
          })
          .css($text_css);
    

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
   
   Crafty.scene("Info");
});