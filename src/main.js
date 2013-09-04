function gameCreated(data) {
	console.log(data);
	if(!isNaN(data.game_id) && data.game_id > 0) {
		$("#phoneNumber").text(data.phone);
		$("#gameCode").text(data.game_id);
		$(".callIn").show();
		$(".overlay").fadeOut("slow", function(){ $(this).remove() });
	}
}

$(document).ready(function() {
    var debug = false;
    //-- Window Load
    window.addEventListener('load', Game.start);
	//Game.start();        
    $('.newPlayer').click(function() {
        addNewPlayer("+" + Math.floor(Math.random()*54645645), "Jake");
        return false;
    }); 
    
    $('.newObs').click(function() {
        createWorldObject(Math.floor(Math.random()*10), Math.floor(Math.random()*10));
        return false;
    });
    
    $('#gameCreator').click(function() {
    	$.get('index.php', {'newGame':true}, gameCreated);
    });

});