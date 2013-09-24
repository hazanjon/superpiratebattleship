var Config = Config || {};

Config.gameOptions = {
	difficulty: 2,
};

Config.playerKeyBindings = [
	{
		forward: {
			key: Crafty.keys['UP_ARROW'],
			value: 2
		},
		left: {
			key: Crafty.keys['LEFT_ARROW'],
			value: 4
		},
		right: {
			key: Crafty.keys['RIGHT_ARROW'],
			value: 6
		},
		backward: {
			key: Crafty.keys['DOWN_ARROW'],
			value: 8
		},
		fire: {
			key: Crafty.keys['CTRL'],
			value: 5
		},
	},
	{
		forward: {
			key: Crafty.keys['W'],
			value: 2
		},
		left: {
			key: Crafty.keys['A'],
			value: 4
		},
		right: {
			key: Crafty.keys['D'],
			value: 6
		},
		backward: {
			key: Crafty.keys['S'],
			value: 8
		},
		fire: {
			key: Crafty.keys['SPACE'],
			value: 5
		},
	}
];