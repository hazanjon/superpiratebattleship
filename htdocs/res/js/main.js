
$(document).ready(function() {
    var debug = false;
    //-- Window Load
    window.addEventListener('load', Game.init);
	//Game.start();        
    $('.newPlayer').click(function() {
        Game.addNewPlayer("+" + Math.floor(Math.random()*54645645), "Jake");
        return false;
    }); 
    
    $('.newObs').click(function() {
        Game.createWorldObject(Math.floor(Math.random()*10), Math.floor(Math.random()*10));
        return false;
    });
});