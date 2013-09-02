SC.initialize({
  client_id: '332b52d99a4f6a843cdc4d92dc77d4d9'
});

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
	
	self.currentTimebar = ko.observable(0);
	
	self.rec = [0,0,0,0,0,0,0,0,0,0,0];
}

hack.vm = new viewModel();

hack.calcEq = function(eq, position){
	//console.log('#################Start CALCS############');
		var output = [];
		var totalWave = 0;
		
		var timebar = hack.vm.timebar;
		
		var pos = Math.floor((position % hack.vm.timebarLength) / (hack.vm.timebarLength / hack.vm.timebarSections));

		var dir = Math.floor(position / hack.vm.timebarLength) % 2;
		
		hack.vm.currentTimebar(pos);
		//console.log(dir);
		if(hack.vm.timebarDir() != dir){
			hack.vm.timebarDir(dir);
			var temptimebar = [];
			//clone timebar so the calcs can run async and zero out timebar
			for(var i = 0; i < hack.vm.timebarSections; i++){
				temptimebar[i] = timebar[i]();
				timebar[i](0);
			}
			
			if(hack.vm.sound.position >= 8000) //Dont generate before 10 secs
				hack.generateBlocks(temptimebar, hack.vm.timebarAvg());
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
					total += pair;
					totalWave += pair;
				}
				
				
				output.push(total/segsize);
			}
		}
		
		hack.vm.eqDivided(output);
		if(dir){
			timebar[hack.vm.timebarSections - (pos + 1)](totalWave); //Total wave max should be 512
		}else{
			timebar[pos](totalWave); //Total wave max should be 512
		}
		//console.log('end of equp, mutate');
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
	
	//console.log(timebarAvg, thisavg, timebar)
	//@todo use the avgdiff in calcs
	//[11, 16, 30, 28, 104, 31, 0, 0, 0, 0, 0]
	//var minval = timebar.min();
	
	//var coinrow = timebar.indexOf(minval);
	//delete timebar[timebar.indexOf(minval)];
	
	/*minval = timebar.min();
	var coinrow = timebar.indexOf(minval);
	delete timebar[timebar.indexOf(minval)];*/
	
	function compareNumbers(a, b) {
	  	return a - b;
	}
	
	timebar2.sort(compareNumbers);
	console.log(timebar2);
	
	var hprow = timebar.indexOf(timebar2[0]);
	var coinrow = timebar.indexOf(timebar2[1]);
	var mountain1 = timebar.indexOf(timebar2[hack.vm.timebarSections - 1]);
	var mountain2 = timebar.indexOf(timebar2[hack.vm.timebarSections - 2]);
	var mountain3 = timebar.indexOf(timebar2[hack.vm.timebarSections - 3]);
	
	console.log(hprow, coinrow);
	
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
	
	/*
	for(var i = 0; i < hack.vm.timebarSections; i++){
		if(timebar[i] > 0){
			if(thisavg >= (timebarAvg * 1.4)){ //Avg way above
					if(timebar[i] < timebarAvg){
						createWorldObject(i, 8);//8 is good
						//console.log('0create nice coin',i);
						self.rec[0] += 1;
					}
					if(timebar[i] > (thisavg * 1.3)){ //50% greater than avg
						createWorldObject(i, 1);//bad
						//console.log('1create nasty obstruction',i);
						self.rec[1] += 1;
					}
			}else if(thisavg >= timebarAvg){ //Avg above
					if(timebar[i] < timebarAvg * 0.6){ // 20% down
						createWorldObject(i, 8);//8 is good
						//console.log('2create coin',i);	
						self.rec[2] += 1;
					}
					if(timebar[i] > (thisavg * 1.5)){ //50% greater than avg
						createWorldObject(i, 1);//bad
						//console.log('3create obstruction',i);
						self.rec[3] += 1;
					}
			}else if(thisavg <= timebarAvg){ //Avg below
					if(timebar[i] < thisavg * 0.5){ // 20% down
						//console.log('4create coin',i, timebar[i], thisavg * 0.5);
						createWorldObject(i, 8);//8 is good
						self.rec[4] += 1;
					}
					if(timebar[i] > (thisavg * 1.5)){ //50% greater than avg
						//console.log('5create obstruction',i);
						createWorldObject(i, 1);//bad
						self.rec[5] += 1;
					}
			}else if((thisavg * 1.5) <= timebarAvg){ //Avg  way below
					if(timebar[i] < thisavg * 0.8){ // 20% down
						createWorldObject(i, 8);//8 is good
						//console.log('6create coin',i);	
						self.rec[6] += 1;
					}
					if(timebar[i] > (thisavg * 1.8)){ //50% greater than avg
						createWorldObject(i, 1);//bad
						//console.log('7create nasty obstruction',i);
						self.rec[7] += 1;
					}
			}else{
					if(timebar[i] < thisavg * 0.8){ // 20% down
						createWorldObject(i, 8);//8 is good
						//console.log('6create coin',i);	
						self.rec[6] += 1;
					}
					if(timebar[i] > (thisavg * 1.8)){ //50% greater than avg
						createWorldObject(i, 1);//bad
						//console.log('7create nasty obstruction',i);
						self.rec[7] += 1;
					}
			}
		}
	}*/
		
	//use the actual time avg incase the function is behind
	hack.vm.timebarAvg((hack.vm.timebarAvg() + thisavg) / 2);
	//hack.vm.timebar(timebar);
	console.log('////////////////////////////END ROW/////////////////////////////////////');
	movePlayers();
	Crafty.trigger('gametick');
}