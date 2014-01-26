
var game,
	assets,
	loader,
	stage,
	world,
	background,
	VIEW_WIDTH = window.innerWidth,
	VIEW_HEIGHT = window.innerHeight,
	renderer,
	planets = [],
	suns = [],
	gems = [],
	_startPosition = {x: 0, y: 0},
	_mouseX,
	_mouseY,
	_d = 0,
	_position = {x: 0, y: VIEW_HEIGHT/ 2},
	mouseDownInterval,
	destX = 0,
	destY = 0;

assets = [
		"assets/images/hero.png",
		"assets/images/glow.png",
		"assets/images/planet_1.png",
		"assets/images/planet_2.png",
		"assets/images/planet_3.png",
		"assets/images/bg.png",
		"assets/images/sun.png",
		"assets/images/burst.png",
		"assets/images/sun-particle.png"
	];

renderer = new PIXI.CanvasRenderer(VIEW_WIDTH, VIEW_HEIGHT);
renderer.view.className = "rendererView";
document.body.appendChild(renderer.view);

stage = new PIXI.Stage(0xFFFFFF);

world = new PIXI.DisplayObjectContainer();
stage.addChild(world);

loader = new PIXI.AssetLoader(assets);
loader.load();

console.log(loader);
if (loader.loadCount) {
	loader.addEventListener('onComplete', handle_loader_COMPLETE);
} else {
	setTimeout(handle_loader_COMPLETE, 1000);
}


function handle_loader_COMPLETE(e) {
	game = new Game();
	game.start();
};

var Hero = function (parent) {
	var TEXTURE_HERO,
		TEXTURE_GLOW,
		guy,
		glow,
		p,
		i,
		particles = [];
		
	TEXTURE_HERO = PIXI.Texture.fromImage(assets[0]);
	TEXTURE_GLOW = PIXI.Texture.fromImage(assets[1]);
	
	this.sprite = new PIXI.DisplayObjectContainer();
	this.sprite.position.y = VIEW_HEIGHT / 2;
	this.sprite.position.x = VIEW_WIDTH / 2;
	parent.addChild(this.sprite);
	
	glow = new PIXI.Sprite(TEXTURE_GLOW);
	glow.position.x = -TEXTURE_GLOW.width / 2;
	glow.position.y = -TEXTURE_GLOW.height / 2;
	glow.blendMode = PIXI.blendModes.COLOR_DODGE;
	this.sprite.addChild(glow);
	
	guy = new PIXI.Sprite(TEXTURE_HERO);
	guy.position.x = -TEXTURE_HERO.width / 2;
	guy.position.y = -TEXTURE_HERO.height / 2;
	this.sprite.addChild(guy);
	
	for (i = 0; i < 100; i += 1) {
		p = new PIXI.Sprite(TEXTURE_GLOW);
		p.position.y = -40 + Math.random() * TEXTURE_HERO.height;
		p.scale.x = 0.1;
		p.scale.y = 0.1;
		p.alpha = Math.random();
		p.speed = 5 + Math.random();
		p.blendMode = PIXI.blendModes.COLOR_DODGE;
		this.sprite.addChildAt(p, 1);
		particles.push(p);
	}
	
	this.position = this.sprite.position;
	
	this.update = function (delta) {
		var life;
		
		for (i = 0; i < particles.length; i += 1) {
			life = delta * particles[i].alpha - particles[i].speed / 200;
			
			particles[i].position.x -= delta * particles[i].speed;
			particles[i].alpha = life > 0 ? life : 0;
			
			if (particles[i].alpha === 0) {
				particles[i].position.x = 0;
				particles[i].alpha = 1;
			}
		}
	}
}

var Planet = function (parent) {
	var p,
		TEXTURE_P,
		randP = Math.floor(2 + Math.random() * 3);
		
	TEXTURE_P = PIXI.Texture.fromImage(assets[randP]);
	
	this.sprite = new PIXI.DisplayObjectContainer();
	parent.addChild(this.sprite);
	
	p = new PIXI.Sprite(TEXTURE_P);
	p.position.x = -TEXTURE_P.width / 2;
	p.position.y = -TEXTURE_P.height / 2;
	p.tint = Math.random() * 0xFFFFFF;
	this.sprite.addChild(p);
	
	//add rings to some
	
	this.position = this.sprite.position;
}

var Sun = function (parent) {
	var p,
		TEXTURE_P,
		TEXTURE_SUN_P,
		i,
		particles = [],
		scale =  0.5 + Math.random();
		
	TEXTURE_P = PIXI.Texture.fromImage(assets[6]);
	TEXTURE_SUN_P = PIXI.Texture.fromImage(assets[8]);
	
	this.sprite = new PIXI.DisplayObjectContainer();
	parent.addChild(this.sprite);
	
	p = new PIXI.Sprite(TEXTURE_P);
	p.position.x = -TEXTURE_P.width / 2;
	p.position.y = -TEXTURE_P.height / 2;
	this.sprite.addChild(p);
	
	//add sun particles
	for (i = 0; i < 50; i += 1) {
		p = new PIXI.Sprite(TEXTURE_SUN_P);
		p.position.x = 0;
		p.position.y = 0;
		p.scale.x = scale;
		p.scale.y = scale;
		p.vx = -0.5 + Math.random();
		p.vy = -0.5 + Math.random();
		p.alpha = Math.random();
		p.speed = 2 + Math.random();
		p.blendMode = PIXI.blendModes.ADD;
		this.sprite.addChildAt(p, 1);
		particles.push(p);
	}
	
	this.position = this.sprite.position;
	
	this.update = function (delta) {
		var life;
		
		for (i = 0; i < particles.length; i += 1) {
			life = particles[i].alpha - particles[i].speed / 150;
			
			particles[i].position.x += particles[i].vx * particles[i].speed;
			particles[i].position.y += particles[i].vy * particles[i].speed;
			particles[i].alpha = life > 0 ? life : 0;
			
			if (particles[i].alpha === 0) {
				particles[i].position.x = 0;
				particles[i].position.y = 0;
				
				particles[i].alpha = 1;
			}
		}
	}
}

var Gem = function (parent) {
	var p,
		TEXTURE_P;
		
	TEXTURE_P = PIXI.Texture.fromImage(assets[7]);
	
	this.sprite = new PIXI.DisplayObjectContainer();
	parent.addChild(this.sprite);
	
	p = new PIXI.Sprite(TEXTURE_P);
	p.position.x = -TEXTURE_P.width / 2;
	p.position.y = -TEXTURE_P.height / 2;
	p.rotation = Math.random() * 360;
	p.blendMode = PIXI.blendModes.COLOR_DODGE;
	this.sprite.addChild(p);
			
	this.position = this.sprite.position;
}

var Background = function (parent) {
	var BG_TEXTURE,
		bg,
		container,
		i,
		panels = [];
		
	BG_TEXTURE = PIXI.Texture.fromImage(assets[5]);
		
	this.sprite = new PIXI.DisplayObjectContainer();
	parent.addChildAt(this.sprite, 0);
		
	for (i = 0; i < 3; i += 1) {
		bg = new PIXI.Sprite(BG_TEXTURE);
		bg.position.x = BG_TEXTURE.width * i;
		this.sprite.addChild(bg);
		panels.push(bg);
	}
	
	this.update = function () {
		for (i = 0; i < panels.length; i += 1) {
			if (this.sprite.position.x + panels[i].position.x < -BG_TEXTURE.width) {
				panels[i].position.x += BG_TEXTURE.width * 3;
			}
		}
	}
}

var Game = function () {
	var hero;
	
	this.start = function () {
		
		background = new Background(stage);
		
		this.addPlanets(world);
		this.addGems(world);
		this.addSuns(world);
		hero = new Hero(stage);
		
		//document.body.addEventListener('mousedown', this.handle_MOUSE_DOWN.bind(this));
		//document.body.addEventListener('mouseup', this.handle_MOUSE_UP.bind(this));
		
		requestAnimationFrame(this.update.bind(this));
	}
	
	this.update = function () {
		var i;
		
		speed = 5;
		
		for (i = 0; i < 100; i += 1) {
			suns[i].update();
		}
		
		_position.x -= speed;
		_position.y = VIEW_HEIGHT / 2 + Math.sin(_position.x / 200) * VIEW_HEIGHT / 4;
		
		hero.position.y = _position.y;
		world.position.x = _position.x;
		hero.update(speed / 5);
		
		background.sprite.position.x -= speed / 2;
		background.update();
				
		renderer.render(stage);
		requestAnimationFrame(this.update.bind(this));
	}
	
	this.addPlanets = function (parent) {
		var i,
			p;
			
		for (i = 0; i < 100; i += 1) {
			p = new Planet(parent);
			p.position.x = i * 200;
			p.position.y = VIEW_HEIGHT / 2 + Math.cos(i * 10) * (VIEW_HEIGHT / 4);
			planets.push(p);
		}
	}
	
	this.addGems = function (parent) {
		var i,
			p;
			
		for (i = 0; i < 100; i += 1) {
			p = new Gem(parent);
			p.position.x = i * 500;
			p.position.y = VIEW_HEIGHT / 2 + Math.cos(i * 20) * (VIEW_HEIGHT / 5);
			gems.push(p)
		}
	}
	
	this.addSuns = function (parent) {
		var i,
			p;
			
		for (i = 0; i < 100; i += 1) {
			p = new Sun(parent);
			p.position.x = i * 1000;
			p.position.y = VIEW_HEIGHT / 2 + Math.cos(i * 20) * (VIEW_HEIGHT / 2);
			suns.push(p)
		}
	}
	
	this.handle_MOUSE_DOWN = function (e) {
		_d = 0;
		_startPosition = {x: _position.x, y: _position.y};
		_mouseX = e.pageX;
		_mouseY = e.pageY;
		mouseDownInterval = setInterval(this.mouseIsDown.bind(this), 10);
	}
	
	this.mouseIsDown = function () {
		_d += .01;
		_position.x = _d * _startPosition.x + (1 - _d) * _mouseX;
	    _position.y = _d * _startPosition.y + (1 - _d) * _mouseY;
	
		if (_d >= 1) {
			this.handle_MOUSE_UP();
		}
	}
	
	this.handle_MOUSE_UP = function (e) {
		clearInterval(mouseDownInterval);
	}
}
