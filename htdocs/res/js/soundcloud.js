var canvas;

SC.initialize({
  client_id: '332b52d99a4f6a843cdc4d92dc77d4d9'
});

var EqCanvas = function(id) {
	this.el 	    = document.getElementById(id);
	this.context    = this.el.getContext("2d");
	this.gradient   = null;
	this.counter    = 0;
	this.sections   = 10;
	this.threshold	= 150;
	this.width  	= 30;
	this.data       = [];
	
	this.fire = function(i, rand) {
		createWorldObject(i, rand);
		movePlayers();
		Crafty.trigger('gametick');
		this.clear();
		this.counter++;
	}
	
	this.fillRect = function() {
		for(var i=0; i<this.sections; i++) {
			var value = this.data[i];
			if(value > this.threshold) {
				var rand = Math.floor(Math.random() * 100);
				if(rand <= 10) {		rand = 0; 	}
				else if(rand <= 30) {	rand = 1;	}
				else if(rand <= 50) { 	rand = 2;	}
				else{					rand = 3;	}
				
				
				this.fire(i, rand);
				if(this.counter == this.sections) {
					this.counter = 0;
				}
				break;
				this.data[i] = 0;
				this.context.fillStyle = 'black';
			}
			else {
				this.context.fillStyle = 'blue';
			}
			
			this.context.fillRect(i*this.width, 0, this.width-1, value);
		}
	};
	
	this.draw = function(data) {
		for(var i=0; i<data.length; i++) {
			var index = i % this.sections;
			index += this.counter;
			if(index >= this.sections) {
				index -= this.sections;
			}
			var value = data[i] * 4;
			this.data[index] += value * value;
		}
		this.fillRect();
	};

	this.emptyData = function() {
		for(var i=0; i<this.sections; i++) {
			this.data[i] = 0;
		}
	};
	
	this.clear = function() {
		this.emptyData();
		this.el.width = this.el.width;
	};
	
	this.emptyData();
	return this;
};

function createEqCanvas() {
	canvas = new EqCanvas("eq");
	
	SC.stream("/tracks/56526690", {
			autoPlay: false,
			autoLoad: true,
			useEQData: true,
			onplay: function(){
			},
			onload: function(){
				console.log('ready');
			},
			whileplaying: function(){
				//canvas.draw(this.eqData);

				hack.calcEq(this.eqData, this.position);
			}
		},
		function(sound) {
			sound.play();
			hack.vm.sound = sound;
		}
	);
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

var hack = hack || {};

viewModel = function(){
	self = this;
	self.sound = null;
	self.eq = ko.observableArray(null);
	self.eqDivided = ko.observableArray(null);
	self.height = ko.observable(400);
	self.divider = ko.observable(4);
	self.dividerOptions = ko.observable([1,2,3,4,5,6]);
	self.segsize = ko.computed(function(){
		return Math.pow(2, self.divider());
	});
	self.segs = ko.computed(function(){
		return 256 / self.segsize();
	});
	
	self.timebarSections = 10;//Sections within the timebar 
	self.timebarLength = 1000;//Length of time it covers
	self.timebarDir = ko.observable(0);
	self.timebarAvg = ko.observable(0);
	
	self.timebar = [];
	for(var i = 0; i < self.timebarSections; i++){
		var temp = ko.observable(0);
		self.timebar.push(temp);
	}
	
	self.currentTimebarPos = ko.observable(0);
	self.currentTimebarValue = ko.observable(0);
	
	self.rec = [0,0,0,0,0,0,0,0,0,0,0];
}

hack.vm = new viewModel();

hack.relativePos = function(position){
	return (position % hack.vm.timebarLength) / (hack.vm.timebarLength / hack.vm.timebarSections);
}

hack.calcEq = function(eq, position){
	//console.log('#################Start CALCS############');
		var output = [];
		var totalWave = 0;
		
		var timebar = hack.vm.timebar;
		
		var pos = Math.floor(hack.relativePos(position));

		var dir = Math.floor(position / hack.vm.timebarLength) % 2;
		
		if(hack.vm.timebarDir() != dir){
			hack.vm.timebarDir(dir);
			canvas.clear();

			var temptimebar = [];
			//clone timebar so the calcs can run async and zero out timebar
			for(var i = 0; i < hack.vm.timebarSections; i++){
				temptimebar[i] = timebar[i]();
				timebar[i](0);
			}
			
			if(hack.vm.sound.position >= 8000){ //Dont generate before 10 secs
				hack.generateBlocks(temptimebar, hack.vm.timebarAvg());
			}
		}
		
		if(eq && eq.left && eq.left.length){
			var segsize = hack.vm.segsize();
			for(var i = 0; i < 256 / segsize; i++){
			
				//console.log('i', i);
				var total = 0;
				for(var j = 0; j < segsize; j++){
				//console.log('j', j);
					var channel = (i * segsize) + j;
					var pair = (parseFloat(eq.left[channel]) + parseFloat(eq.right[channel]));
					//total += pair;
					totalWave += pair;
				}
				
				
				//output.push(total/segsize);
			}
		}
		
		//hack.vm.eqDivided(output);
		var realpos = pos;
		if(dir)
			realpos = hack.vm.timebarSections - (pos + 1);

		timebar[realpos](totalWave); //Total wave max should be 512


		canvas.context.fillStyle = 'blue';
		canvas.context.fillRect(realpos*canvas.width, 150-totalWave, canvas.width - 1, totalWave);

			canvas.context.beginPath();
			var lastpos = hack.relativePos(hack.vm.currentTimebarPos());
			var currentpos = hack.relativePos(position);
			
			if(dir){
				lastpos = hack.vm.timebarSections - lastpos;
				currentpos = hack.vm.timebarSections - currentpos;
			}

			if(pos == 0){
				if(dir){
					lastpos = hack.vm.timebarSections + 1;
				}else{
					lastpos = hack.vm.timebarSections;
				}
			}

			canvas.context.moveTo(lastpos*canvas.width, 150-hack.vm.currentTimebarValue());
			canvas.context.lineTo(currentpos*canvas.width, 150-totalWave);

			canvas.context.strokeStyle = '#ff0000';
			canvas.context.stroke();
		//console.log(canvas.height);
		hack.vm.currentTimebarPos(position);
		hack.vm.currentTimebarValue(totalWave);

};

hack.setup = function(){
	var temp = {left: [], right: []};
	for(var i = 0; i < 256; i++){
		temp.left.push(0.001);
		temp.right.push(0.001);
	}
	hack.vm.eq(temp);
	
	ko.applyBindings(hack.vm);
}

hack.create = function(track_id){ 
	SC.stream("/tracks/"+track_id, {
			autoPlay: false,
			autoLoad: true,
			useEQData: true,
			onplay: function(){
			},
			onload: function(){
				console.log('ready');
			},
			ontimedcomments: function(comments){
				//console.log(comments[0].body);
			},
			whileloading: function(arg){
				//console.log(this.bytesLoaded+'/'+this.bytesTotal);
			},
			whileplaying: function(){
				hack.calcEq(this.eqData, this.position);
			}
		},
		function(sound){
			if(hack.vm.sound != null)
				hack.vm.sound.unload();
			hack.vm.sound = sound;
			
			sound.play();
			
		}
	);
}

hack.generateBlocks = function(timebar, timebarAvg){
	//console.log('////////////////////////////GENERATE ROW/////////////////////////////////////');
	var lastbar = 0;
	var avgdiff = [];
	var timebar2 = [];
	
	//Calc total for this bar &  the diff for each slot vs the avg
	for(var i = 0; i < timebar.length; i++){
		var thisval = 0;
		if(timebar[i] > 0){
			thisval = timebar[i];
		}else{
			thisval = timebarAvg;//If there was no value avg between the two surrounding
		}
		avgdiff[i] = thisval - timebarAvg;
		lastbar += thisval;
	}
	//console.log('first');
	var thisavg = lastbar / hack.vm.timebarSections;
	
	var bardiff = [];
	var bardiffsort = [];
	
	//Calc the local diff for this bar
	for(var i = 0; i < timebar.length; i++){
		var thisval = 0;
		if(timebar[i] > 0){
			thisval = timebar[i];
		}else{
			thisval = thisavg;//If there was no value avg between the two surrounding
			timebar[i] = thisavg;//If there was no value avg between the two surrounding
			
		}
		bardiff[i] = thisval - thisavg;
		timebar2[i] = thisval;
	}
	
	function compareNumbers(a, b) {
	  	return a - b;
	}
	
	timebar2.sort(compareNumbers);
//	console.log(timebar2);
	
	var hprow = timebar.indexOf(timebar2[0]);
	var coinrow = timebar.indexOf(timebar2[1]);
	var mountain1 = timebar.indexOf(timebar2[hack.vm.timebarSections - 1]);
	var mountain2 = timebar.indexOf(timebar2[hack.vm.timebarSections - 2]);
	var mountain3 = timebar.indexOf(timebar2[hack.vm.timebarSections - 3]);
	
//console.log(hprow, coinrow);
	
	if(timebar[hprow] < (timebarAvg * 0.6) && Math.random()  > 0.8){
		//console.log('power');
			createWorldObject(hprow, 0);//powerup
	}else if(timebar[hprow] < timebarAvg && Math.random()  > 0.5){
		//console.log('hp');
			createWorldObject(hprow, 2);//hp
	}else{
		//console.log('coin');
		if(Math.random()  > 0.9)
			createWorldObject(hprow, 1);//coin
	}
	
	if(Math.random()  > 0.8)
		createWorldObject(coinrow, 1);//coin
	
	createWorldObject(mountain1, 6);//bad
	if(Math.random()  > 0.7)
		createWorldObject(mountain2, 7);//bad
	if(Math.random()  > 0.7)
		createWorldObject(mountain3, 7);//bad
	//createWorldObject(mountain3, 8);//bad
	
	//use the actual time avg incase the function is behind
	hack.vm.timebarAvg((hack.vm.timebarAvg() + thisavg) / 2);
	//hack.vm.timebar(timebar);
//	console.log('////////////////////////////END ROW/////////////////////////////////////');
	movePlayers();
	Crafty.trigger('gametick');
}

