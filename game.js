var Game = require('crtrdg-gameloop');
var Keyboard = require('crtrdg-keyboard');
var Mouse = require('crtrdg-mouse');

var game = new Game({
	canvas: 'game',
	width: 800,
	height: 500,
	backgroundColor: 'rgba(0, 0, 0, 0.0)'
});

var keyboard = new Keyboard(game);
var mouse = new Mouse(game);

mouse.on('mousemove', function(e){
	box.x = e.x - box.width / 2;
	box.y = e.y - box.height / 2;
});

var boxes = [];

mouse.on('mousedown', function(e){
	if ('<space>' in keyboard.keysDown){
		boxes.push(new Box({
			x: e.x,
			y: e.y
		}));
	}
	else if ('<shift>' in keyboard.keysDown){
		box.shrinking = true;
	}
	else {
		box.growing = true;
	}
});

mouse.on('mouseup', function(e){
	box.growing = false;
	box.shrinking = false;
});

game.on('update', function(){
	box.update(keyboard.keysDown);

	for (var i=0; i<boxes.length; i++){
		boxes[i].update(keyboard.keysDown);
	}
});

game.on('draw', function(context){
	context.fillStyle = 'rgba(23, 54, 12, 0.3)';
	context.fillRect(0, 0, game.width, game.height);
	context.font = '100px sans-serif';
	context.fillText('this is some text', 20, 150);
	box.draw(context);

	for (var i=0; i<boxes.length; i++){
		boxes[i].draw(context);
	}
});


function Box(options){
	this.x = options.x;
	this.y = options.y;
	this.width = 20;
	this.height = 20;
	this.speed = 10;
	this.color = '#5f4e21';
	this.growing = false;
	this.shrinking = false;
}

Box.prototype.update = function(keysDown){

	if (this.growing){
		this.width += 1;
		this.height += 1;
	}

	else if (this.shrinking){
		this.width -= 1;
		this.height -= 1;
	}

	// going up
	if ('W' in keysDown){
		this.y -= this.speed;
	}

	// going down
	if ('S' in keysDown){
		this.y += this.speed;
	}

	// going left
	if ('A' in keysDown){
		this.x -= this.speed;
	}

	//going right
	if ('D' in keysDown){
		this.x += this.speed;
	}

	this.boundaries();
};

Box.prototype.boundaries = function(){
	if (this.x <= 0){
		this.x = 0;
	}

	if (this.x >= game.width - this.width){
		this.x = game.width - this.width;
	}

	if (this.y <= 0){
		this.y = 0;
	}

	if (this.y >= game.height - this.height){
		this.y = game.height - this.height;
	}
}

Box.prototype.draw = function(context){
	context.fillStyle = this.color;
	context.fillRect(this.x, this.y, this.width, this.height);
};

var box = new Box({
	x: 50,
	y: 50
});