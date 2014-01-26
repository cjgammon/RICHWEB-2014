
var _game,
	Game,
	assets,
	loader,
	stage,
	world,
	background,
	VIEW_WIDTH = 800,
	VIEW_HEIGHT = 440,
	renderer,
	state = 0,
	delta = 0;

assets = [
	"sprites/ground1.png",
	"sprites/bg1.png",
	"sprites/mario/mario_0005_Layer-0.png",
	"sprites/mario/mario_0004_Layer-0-copy.png",
	"sprites/mario/mario_0003_Layer-0-copy-2.png",
	"sprites/mario/mario_0002_Layer-0-copy-3.png",
	"sprites/mario/mario_0001_Layer-0-copy-4.png",
	"sprites/mario/mario_0000_Layer-0-copy-5.png"
];

//renderer = PIXI.autoDetectRenderer(VIEW_WIDTH, VIEW_HEIGHT);
renderer = new PIXI.CanvasRenderer(VIEW_WIDTH, VIEW_HEIGHT);
renderer.view.className = "rendererView";
document.body.appendChild(renderer.view);

stage = new PIXI.Stage(0xFFFFFF);

world = new PIXI.DisplayObjectContainer();
stage.addChild(world);

loader = new PIXI.AssetLoader(assets);
loader.addEventListener('onComplete', handle_loader_COMPLETE);
loader.load();

Game = function () {
	
	var bgTexture = PIXI.Texture.fromImage(assets[1]);
	bgTexture.frame = new PIXI.Rectangle(0, 0, 510, 432);
	var bg = new PIXI.TilingSprite(bgTexture, VIEW_WIDTH, VIEW_HEIGHT);
	bg.position.y = 0;
	world.addChild(bg);
	
	var floorTexture = PIXI.Texture.fromImage(assets[0]);
	var floor = new PIXI.TilingSprite(floorTexture, VIEW_WIDTH, VIEW_HEIGHT);
	floor.position.y = 400;
	world.addChild(floor);
	
	var mario = new PIXI.MovieClip([
		PIXI.Texture.fromImage(assets[2]),
		PIXI.Texture.fromImage(assets[3]),
		PIXI.Texture.fromImage(assets[4]),
		PIXI.Texture.fromImage(assets[5]),
		PIXI.Texture.fromImage(assets[4]),
		PIXI.Texture.fromImage(assets[3])
		]);
		
	mario.animationSpeed = 0.2;
	mario.position.x = 370;
	mario.position.y = 370;
	world.addChild(mario);
	
	/*
	var fgOffsetText = new PIXI.Text("x1", {font:"30px Helvetica", fill:"white"});
	fgOffsetText.position.x = 50;
	fgOffsetText.position.y = 405;
	
	var bgOffsetText = new PIXI.Text("x1", {font:"30px Helvetica", fill:"white"});
	bgOffsetText.position.x = 50;
	bgOffsetText.position.y = 360;
	*/
		
	this.start = function () {
		document.addEventListener('keydown', this.click.bind(this));
		requestAnimationFrame(this.update.bind(this));
	}
	
	this.click = function () {
		state += 1;
	}
	
	this.update = function () {
				
		switch(state) {
		case 0:
		
			break;
		case 1:
			mario.play();
			break;
		case 2:
			//stage.addChild(fgOffsetText);
			//stage.addChild(bgOffsetText);
			bg.tilePosition.x -= 2;
			floor.tilePosition.x -= 2;
			break;
		default:
			//bgOffsetText.setText("x0.25");
			bg.tilePosition.x -= 0.5;
			floor.tilePosition.x -= 2;
			break;
		}

		renderer.render(stage);
		requestAnimationFrame(this.update.bind(this));
	}
}

function handle_loader_COMPLETE(e) {
	_game = new Game();
	_game.start();
};
