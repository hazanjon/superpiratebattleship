SC.initialize({
  client_id: '332b52d99a4f6a843cdc4d92dc77d4d9'
});

var SCEqualizer = {
	canvas: 	{},
    gradient: 	null,
    counter:    0,
    position:   0,
    sections:   10,
    sweepLength:1000, //Sweep time in ms
    threshold:  150,
    width:      30,
    maxObjects: 2 + Config.gameOptions.difficulty,
    waveData: 	[],
    lastpoint: 	{
    	position: 	0,
    	value: 		0
    },
    sweepDir: 	0,
    movingAvg: 	0,
    generateDelay: 8000, //ms before starting object creation // @Todo move?

	init: function(id) {
		this.canvas = document.getElementById(id);
		this.context = this.canvas.getContext("2d");
    	this.emptyData();
	},

    emptyData: function() {
        for ( var i = 0; i < this.sections; i++) {
            this.waveData[i] = 0;
        }
    },

    clear: function() {
        this.emptyData();

        //@todo: Replace with .clearRect(0, 0, canvas.width, canvas.height);
        this.canvas.width = this.canvas.width;
    },

    switchSweepDirection: function(){

    	if(this.lastpoint.position >= (this.sections/2)){
    		this.lastpoint.position -= this.sections;
    		this.lastpoint.position = -this.lastpoint.position;
    		this.lastpoint.position += this.sections;
    	}else{
    		this.lastpoint.position = -this.lastpoint.position;
    	}

		if(this.position >= this.generateDelay){ //Dont generate before 10 secs
			this.generateBlocks(this.waveData);
		}
		
		Game.tick();
		this.clear();
    },

    drawBar: function(position, value){
		this.context.fillStyle = 'blue';
		this.context.fillRect(position*this.width, 150-value, this.width - 1, value);
    },

    drawLine: function(position, value){
		this.context.beginPath();

		this.context.moveTo(this.lastpoint.position*this.width, 150-this.lastpoint.value);
		this.context.lineTo(position*this.width, 150-value);

		this.context.strokeStyle = '#ff0000';
		this.context.stroke();
    },

    relativePos: function(position){ //Calculate a given timestamp position in the sweep
		return (position % this.sweepLength) / (this.sweepLength / this.sections);
	},
		
    waveSize: function(eq){ //Calculate the total of the eqData wave
		var totalWave = 0;
		if(eq && eq.left && eq.left.length){
			for(var i = 0; i < eq.left.length; i++){
				totalWave += (parseFloat(eq.left[i]) + parseFloat(eq.right[i]));
			}
		}
		return totalWave;
	},

	calcEq: function(eq, position){
		this.position = position;

		var currentpos = this.relativePos(position);
		var pos = Math.floor(currentpos);

		var dir = Math.floor(position / this.sweepLength) % 2;
		
		if(this.sweepDir != dir){
			this.sweepDir = dir;
			this.switchSweepDirection();
		}
		
		if(dir){
			pos = this.sections - (pos + 1);
			currentpos = this.sections - (currentpos)
		}

		var totalWave = this.waveSize(eq);

		this.waveData[pos] = totalWave;
		this.drawBar(pos, totalWave);
		this.drawLine(currentpos, totalWave);

		this.lastpoint = {position: currentpos, value: totalWave};

	}
};

function createEqCanvas(track_id) {

	if(typeof track_id === 'undefined')
		track_id = '56526690';//Buck Rogers

    SCEqualizer.init("eq");
    SC.stream("/tracks/"+track_id, {
        autoPlay  : false,
        autoLoad  : true,
        useEQData : true,
        onplay : function() {},
        onload : function() {
        },
        whileplaying : function() {
            SCEqualizer.calcEq(this.eqData, this.position);
        }
    },
    function(sound) {
    	Game.music = sound;
        sound.play();
    });
}


//@Todo does this need to go into the game logic code?
SCEqualizer.generateBlocks = function(timebar){

	var timebar2 = [];
	var timebarAvg = 0;

	for(var i = 0; i < timebar.length; i++){
		timebar2[i] = timebar[i];
		timebarAvg += timebar[i];
	}
	
	timebarAvg /= this.sections;
	
	
	timebar2.sort(function (a, b) {
	  	return a - b;
	});
	
	var hprow = timebar.indexOf(timebar2[0]);
	var coinrow = timebar.indexOf(timebar2[1]);
	var mountain1 = timebar.indexOf(timebar2[this.sections - 1]);
	var mountain2 = timebar.indexOf(timebar2[this.sections - 2]);
	var mountain3 = timebar.indexOf(timebar2[this.sections - 3]);
		
	if(timebar[hprow] < (timebarAvg * 0.6) && Math.random()  > 0.8){
		//console.log('power');
			Game.createWorldObject(hprow, 0);//powerup
	}else if(timebar[hprow] < timebarAvg && Math.random()  > 0.5){
		//console.log('hp');
	    Game.createWorldObject(hprow, 2);//hp
	}else{
		//console.log('coin');
		if(Math.random()  > 0.9)
		    Game.createWorldObject(hprow, 1);//coin
	}
	
	if(Math.random()  > 0.8)
	    Game.createWorldObject(coinrow, 1);//coin
	
	Game.createWorldObject(mountain1, 6);//bad
	if(Math.random()  > 0.7)
	    Game.createWorldObject(mountain2, 7);//bad
	if(Math.random()  > 0.7)
	    Game.createWorldObject(mountain3, 7);//bad
	//createWorldObject(mountain3, 8);//bad
	
}

