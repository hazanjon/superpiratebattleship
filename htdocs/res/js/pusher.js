var pusher = new Pusher('8d6d30d2c32b3a486688', { authEndpoint: '/pusher_auth.php' });

function subscribeChannel(game_id) {
	var channelName = 'private-channel'+game_id;
	var channel	    = pusher.subscribe(channelName);
	//-- Events

	// New User Event
	channel.bind("newUser_event", function(data) {
	    console.log(data);
	    //console.log("Pusher newUser: " + data.name);
	    Game.addNewPlayer(data.id, data.name);
	});

	// Key Press
	channel.bind("keyPress_event", function(data) {
	    console.log("Pusher keyPress: " + data.id + " " + data.button);
	    Game.movePlayersData(data.id, data.button);
	});
	channel.bind("client-ev", function(data) {
	    console.log("Pusher keyPress: " + data.id + " " + data.button);
	    Game.movePlayersData(data.id, data.button);
	});

	// Kill Userh
	channel.bind("killUser_event", function(data) {
	    console.log("Pusher Kill User: " + data.id);
	    players[data.id].killPlayer();
	});
	
	return channel
}

function randomTest(justHowRandom)
{
    if (objectLength(players) >= Game.playerCount)
    {
        if (Math.random() < justHowRandom) {
            Game.createWorldObject(Math.floor(Math.random()*10), Math.floor(Math.random()*4));
        }
    }
}