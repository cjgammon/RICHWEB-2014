/*global define THREE $ TweenMax*/
define([], function (require) {
	
	var Backbone = require('backbone'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		NoiseFS = require('text!app/shaders/noise.fs'),
		NoiseVS = require('text!app/shaders/noise.vs'),
		SkyVS = require('text!app/shaders/sky.vs'),
		SkyFS = require('text!app/shaders/sky.fs'),
		BgView;
	
	require('tweenmax');
	require('three');
	
	require('app/post/BloomPass');
	require('app/post/EffectComposer');
	require('app/post/MaskPass');
	require('app/post/RenderPass');
	require('app/post/SavePass');
	require('app/post/ShaderPass');
	require('app/shaders/BleachBypassShader');
	require('app/shaders/ConvolutionShader');
	require('app/shaders/CopyShader');
	require('app/shaders/HorizontalTiltShiftShader');
	require('app/shaders/LuminosityShader');
	require('app/shaders/NormalMapShader');
	require('app/shaders/ShaderTerrain');
	require('app/shaders/VerticalTiltShiftShader');
	
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var renderer, container, stats;
	var camera, scene;
	var directionalLight, pointLight;
	var skyUniforms;
	
	var models = [
		{url: 'assets/models/waterfall.js', geometry: null},
		{url: 'assets/models/cloud1.js', geometry: null},
		{url: 'assets/models/cloud2.js', geometry: null},
		{url: 'assets/models/tree1.js', geometry: null},
		{url: 'assets/models/tree2.js', geometry: null},
		{url: 'assets/models/tree3.js', geometry: null},
		{url: 'assets/models/mountain1.js', geometry: null}
	];
	
	BgView = Backbone.View.extend({

		initialize: function () {			
			this.$el = $('#ground');
			this.mouse = {x: 0, y: 0};
			UserEvent.on('resize', this.resize, this);
			this.d = 0;
			this.worldCenter = {y: -3500 + window.innerWidth / 2};			
			this.loadModels();
		},
		
		loadModels: function () {
			var i = 0,
				loader,
				loaded = 0;
				
			function handle_MODEL_LOADED(geometry, materials) {
				
				models[loaded].geometry = geometry;
				models[loaded].materials = materials;
				
				loaded += 1;
				
				if (loaded == models.length) {
					this.modelsLoaded();
				} else {
					loader = new THREE.JSONLoader();
					loader.load(models[loaded].url, handle_MODEL_LOADED.bind(this));
				}
			}
			
			loader = new THREE.JSONLoader();
			loader.load(models[loaded].url, handle_MODEL_LOADED.bind(this));
		},
		
		modelsLoaded: function () {
			this.addScene();
		},
		
		addScene: function () {
			
			this.sceneRenderTarget = new THREE.Scene();
			
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog(0x3d3248, 3000, 6000);
			
			this.scene.add(new THREE.AmbientLight(0xcccccc));
			
			this.spotLight = new THREE.SpotLight(0xcccccc, 3, 10000);
			this.spotLight.position.set(window.innerWidth, 0, 2000);
			this.spotLight.castShadow = true;
			this.spotLight.shadowMapWidth = 1024;
			this.spotLight.shadowMapHeight = 1024;
			this.spotLight.shadowCameraNear = 2;
			this.spotLight.shadowCameraFar = 20000;
			this.spotLight.shadowCameraFov = 35;
			this.scene.add( this.spotLight );
			
			this.projector = new THREE.Projector();
			this.mouse = new THREE.Vector2();
			
			this.addBg();
			this.addSky();
			//this.addStars();
			this.addTerrain();
			this.addWater();
			//this.addWater2();
			
			this.addMountains(2300, this.worldCenter.y + 3500, -1000);
			this.addMountains(1900, this.worldCenter.y + 3500, -2300);
			this.addMountains(1000, this.worldCenter.y + 3500, -2000);
			this.addMountains(-2000, this.worldCenter.y + 3500, -2000);
			this.addMountains(-2900, this.worldCenter.y + 3500, -3000);
			this.addMountains(-3000, this.worldCenter.y + 3500, -1000);
			
			this.clouds = [];
			for (var i = 0; i < 3; i += 1) {
				var x = -5000 + Math.random() * 10000, 
					y = 1300 + Math.random() * 500, 
					z = -3000 + Math.random() * -1000;
				
				this.addClouds(x, y, z);
			}
			
			for (var i = 0; i < 100; i += 1) {
				var x = -3000 + Math.random() * 6000, 
					y = this.worldCenter.y + 3500, 
					z = -3000 + Math.random() * 2500;
				
				x = x > 600 || x < -600 ? x : x + 1200;
				this.addTree(x, y, z);
			}
			
			//this.droplets = [];
			//this.addWaterfall();

			this.addShelves();

			// RENDERER
			this.renderer = new THREE.WebGLRenderer({canvas: this.$el[0], antialias: true});
			this.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
			//this.renderer.setClearColor( this.scene.fog.color, 1 );
			
			this.camera = new THREE.PerspectiveCamera(35, SCREEN_WIDTH / SCREEN_HEIGHT * 2, 2, 10000);
			//this.camera = new THREE.PerspectiveCamera(35, 1000 / 800 * 2, 2, 10000);
			this.camera.position.set(0, 850, 2000 );
			this.camera.rotation.set(0 * Math.PI / 180, 0, 0);
		},
		
		addWaterfall: function () {
			geometry = models[0].geometry;
			materials = models[0].materials;
			
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			var colorArray = [0x8d8c9e, 0xaaa8be, 0x92919e];
			
			for (var j = 0; j < geometry.faces.length; j += 1) {
				var face = geometry.faces[j];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			materials[0] = new THREE.MeshLambertMaterial({
				ambient: 0x000000, 
				color: 0x525162, 
				lights: true, 
				shadows: true, 
				vertexColors: THREE.FaceColors, 
				shading: THREE.FlatShading
			});
			
			var material = new THREE.MeshFaceMaterial(materials);
			
			this.waterfall = new THREE.Object3D();
			this.waterfall.position.set(0, 1000, -2500);	
			
			var rock = new THREE.Mesh(geometry, material);
			rock.scale.set(600, 300, 600);				
			rock.rotation.set(0, 2, 0);				
			
			this.waterfall.add(rock);
			this.scene.add(this.waterfall);
			
			this.addDroplets();
		},
		
		addDroplets: function () {
			
			var geometry,
				material,
				colorArray,
				face,
				i,
				drop,
				random;
				
			colorArray = [0x142c4c, 0x132a49, 0x1a3a65, 0x112541];
			geometry = new THREE.IcosahedronGeometry(180, 0);
			
			for (i = 0; i < geometry.faces.length; i += 1) {
				face = geometry.faces[i];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			material = new THREE.MeshPhongMaterial({
				vertexColors: THREE.FaceColors, 
				emissive: 0x999999, 
				specular: 0xcccccc, 
				color: 0xcccccc, 
				shading: THREE.FlatShading
			});
			
			drop = new THREE.Mesh(geometry, material);
			drop.position.set(-20, 0, 400);	
			drop.rotation.set(-0.7, 0, 0);	
			this.waterfall.add(drop);
			
			this.droplets.push(drop);
		},
		
		addClouds: function (x, y, z) {
			var cloud,
				material,
				geometry,
				scale = 0.4 + Math.random() * 0.3;
					
			var randCloud = 1 + Math.floor(Math.random() * 2);
			geometry = models[randCloud].geometry;
			
			material = new THREE.MeshLambertMaterial({
				ambient: 0x000000, 
				color: 0x7e559f, 
				opacity: 0.2, 
				transparent: true,
				side: THREE.DoubleSide,
				shading: THREE.FlatShading
			});
			cloud = new THREE.Mesh(geometry, material);
			cloud.position.set(x, y, z);
			cloud.scale.set(500 * (1 + Math.random()), 500 * (0.5 + Math.random() * 0.5), 500);
			
			this.clouds.push(cloud);
			this.scene.add(cloud);
		},
		
		addSky: function () {
			var sky,
				material,
				geometry;
					
			geometry = new THREE.PlaneGeometry(window.innerWidth * 50, 20000, 10, 10);
			
			skyUniforms = {
            	time: {
                	type: 'f',
                	value: 1.0
            	},
				delta: {
                	type: 'f',
                	value: 1.0
            	}
            };

            material = new THREE.ShaderMaterial({
                uniforms: skyUniforms,
                vertexShader: SkyVS,
                fragmentShader: SkyFS
            });
			
			sky = new THREE.Mesh(geometry, material);
			sky.position.set(0, -5000, -5000);
			
			this.scene.add(sky);
		},
		
		addBg: function () {
			var geometry,
			 	material,
				mountains;
				
			geometry= new THREE.CubeGeometry( 14000, 120, 2000, 10, 10, 10 );
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			for (var i = 0; i < geometry.vertices.length; i += 1) {
				var vertice = geometry.vertices[i];
                //vertice.z = vertice.z + Math.random() * 100;
                vertice.y = vertice.y + Math.random() * 200;
                vertice.x = vertice.x + Math.random() * 100;

				if (vertice.z > 0) {
					vertice.y -= 100;
				}
			}
			
			material = new THREE.MeshLambertMaterial({
				ambient: 0x000000, 
				color: 0x443053, 
				shading: THREE.FlatShading
			});
			
			mountains = new THREE.Mesh(geometry, material);
			mountains.position.set(0, this.worldCenter.y + 3500, -4000);
			this.scene.add(mountains);
			
		},
		
		addStars: function () {
			var particleCount,
				particles,
				pMaterial,
				pX, pY, pZ,
				particleSystem;
			
			particleCount = 100;
			particles = new THREE.Geometry();
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF, 
				size: 70, 
				map: THREE.ImageUtils.loadTexture("../assets/images/particle.png"),					
				fog: false,
				blending: THREE.AdditiveBlending,
				transparent: true,
				opacity: 0.7
			});

			for(p = 0; p < particleCount; p += 1) {
				pX = Math.random() * 12000 - 6000;
				pY = Math.random() * 1500 + 1000;
				pZ = -4000 + Math.random() * 1000;
				particle = new THREE.Vector3(pX, pY, pZ);

				particles.vertices.push(particle);
			}

			particleSystem = new THREE.ParticleSystem(particles, pMaterial);
			this.scene.add(particleSystem);
			
			particleCount = 100;
			particles = new THREE.Geometry();
			pMaterial = new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF, 
				size: 30, 
				map: THREE.ImageUtils.loadTexture("../assets/images/particle.png"),					
				fog: false,
				blending: THREE.AdditiveBlending,
				transparent: true,
				opacity: 0.7
			});

			for(p = 0; p < particleCount; p += 1) {
				pX = Math.random() * 12000 - 6000;
				pY = Math.random() * 1500 + 1000;
				pZ = -4000 + Math.random() * 500;
				particle = new THREE.Vector3(pX, pY, pZ);

				particles.vertices.push(particle);
			}

			particleSystem = new THREE.ParticleSystem(particles, pMaterial);
			this.scene.add(particleSystem);
		},
		
		addWater: function () {
			var material,
				geometry;
				
			//geometry = new THREE.CubeGeometry( 1000, 7010, 3010, 10, 60, 10 );
			geometry = new THREE.CubeGeometry( 3010, 7010, 1000, 10, 60, 10 );
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			var colorArray = [0x142c4c, 0x132a49, 0x1a3a65, 0x112541];
			
			for (var i = 0; i < geometry.faces.length; i += 1) {
				var face = geometry.faces[i];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			for (var i = 0; i < geometry.vertices.length; i += 1) {
				var vertice = geometry.vertices[i];
                vertice.z = vertice.z + Math.random() * 50; //connect at seam
                vertice.y = vertice.y + Math.random() * 50; //connect at seam
                //vertice.x = vertice.x + Math.random() * 50; //connect at seam
			}
			
			material = new THREE.MeshPhongMaterial({
				vertexColors: THREE.FaceColors, 
				emissive: 0x333333, 
				specular: 0xcccccc, 
				color: 0xcccccc, 
				opacity: 0.85, 
			//	blending: THREE.AdditiveBlending,
				transparent: true, 
				shading: THREE.FlatShading
			});
			this.water = new THREE.Mesh(geometry, material);
			this.water.position.x = 40;
			this.water.position.y = -3500 + window.innerWidth / 2;
			this.water.position.z = -1500;
			this.water.rotation.y = -90 * Math.PI / 180;
			
			this.scene.add(this.water);
		},
		
		addWater2: function () {	
			var material,
				geometry;
				
			//geometry = new THREE.CubeGeometry( 1000, 7010, 3010, 10, 60, 10 );
			geometry = new THREE.CubeGeometry( 3000, 6950, 1000, 10, 60, 10 );
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			var colorArray = [0x142c4c, 0x132a49, 0x1a3a65, 0x112541];
			
			for (var i = 0; i < geometry.faces.length; i += 1) {
				var face = geometry.faces[i];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			for (var i = 0; i < geometry.vertices.length; i += 1) {
				var vertice = geometry.vertices[i];
                vertice.z = vertice.z + Math.random() * 50; //connect at seam
                vertice.y = vertice.y + Math.random() * 50; //connect at seam
                //vertice.x = vertice.x + Math.random() * 50; //connect at seam
			}
			
			material = new THREE.MeshPhongMaterial({
				vertexColors: THREE.FaceColors, 
				emissive: 0x333333, 
				specular: 0xcccccc, 
				color: 0xcccccc, 
				opacity: 0.85, 
			//	blending: THREE.AdditiveBlending,
				transparent: true, 
				shading: THREE.FlatShading
			});
			var water = new THREE.Mesh(geometry, material);
			water.position.x = 40;
			water.position.y = -3500 + window.innerWidth / 2;
			water.position.z = -1500;
			water.rotation.y = -90 * Math.PI / 180;
			
			this.scene.add(water);
		},
		
		addTerrain: function () {
			// TERRAIN MESH
			var worldGeometry = new THREE.CubeGeometry( 14000, 7000, 3000, 100, 50, 50 );
			THREE.GeometryUtils.triangulateQuads(worldGeometry);
			
			var colorArray = [0x2c1914, 0x231410, 0x341e18, 0x39201a]
			
			for (var i = 0; i < worldGeometry.faces.length; i += 1) {
				var face = worldGeometry.faces[i];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			for (var i = 0; i < worldGeometry.vertices.length; i += 1) {
				var vertice = worldGeometry.vertices[i];
				if (vertice.x < -500 || vertice.x > 500) {
                	vertice.z = vertice.z + Math.random() * 50;
                	vertice.y = vertice.y + Math.random() * 50;
                	vertice.x = vertice.x + Math.random() * 50;
				} else if (vertice.y == 3500) {
					vertice.y -= 100;
				} else if (vertice.y == -3500) {
					vertice.y += 100;
				}
				
				if (vertice.z == 1500) {
					vertice.z -= 100;
				}
				
			}
			
			//var worldMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, shadows: true});
			var worldMaterial = new THREE.MeshLambertMaterial({
				ambient: 0xffffff, 
				color: 0xcccccc, 
				vertexColors: THREE.FaceColors, 
				shading: THREE.FlatShading, 
				shadows: true,
				receiveShadow: true
			});

			this.terrain = new THREE.Mesh( worldGeometry, worldMaterial );
			this.terrain.receiveShadow = true;
			this.terrain.position.y = -3500 + window.innerWidth / 2;
			this.terrain.position.z = -1500;		
			this.scene.add( this.terrain );
		},
		
		addMountains: function (x, y, z) {
			var tree,
				material,
				geometry,
				size,
				i,
				branch,
				scale = 3 + Math.random() * 1;
			
			tree = new THREE.Object3D();
			tree.receiveShadow = true;
		
			geometry = models[6].geometry;
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			materials = models[6].materials;			
			
			//white
			var colorArray = [0xcdced7, 0xdbdeef, 0xccd2ef];
			
			for (var j = 0; j < geometry.faces.length; j += 1) {
				var face = geometry.faces[j];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
						
			materials[1] = new THREE.MeshLambertMaterial({
				ambient: 0x000000, 
				color: 0xe6e7f3, 
				lights: true, 
				shadows: true, 
				receiveShadow: true,
				vertexColors: THREE.FaceColors, 
				shading: THREE.FlatShading
			});
			
			//gray
			var colorArray = [0x8d8c9e, 0xaaa8be, 0x92919e];
			
			for (var j = 0; j < geometry.faces.length; j += 1) {
				var face = geometry.faces[j];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			materials[0] = new THREE.MeshLambertMaterial({
				ambient: 0x000000, 
				color: 0x525162, 
				lights: true, 
				shadows: true, 
				receiveShadow: true,
				vertexColors: THREE.FaceColors, 
				shading: THREE.FlatShading
			});
			
			var material = new THREE.MeshFaceMaterial(materials);
			
			tree = new THREE.Mesh(geometry, material);
			
			tree.scale.set(200, 200, 200);
			tree.position.set(x, y, z);
			
			this.scene.add(tree);
		},
		
		addTree: function (x, y, z) {
			var tree,
				material,
				geometry,
				size,
				i,
				branch,
				scale = 1.0 + Math.random() * 0.5;
			
			var randTree = 3 + Math.floor(Math.random() * 3);
			geometry = models[randTree].geometry;			
			THREE.GeometryUtils.triangulateQuads(geometry);
			
			materials = models[randTree].materials;			
			
			var colorArray = [0x22520a, 0x2b4509]; //0x529b13
			for (i = 0; i < materials.length; i += 1) {
				materials[i] = new THREE.MeshLambertMaterial({
					ambient: 0x000000, 
					color: colorArray[Math.floor(Math.random() * colorArray.length)], 
					lights: true, 
					shadows: true, 
					receiveShadow: true,
					castShadow: true, 
					shading: THREE.FlatShading
				});
			}
			
			var material = new THREE.MeshFaceMaterial(materials);
			
			tree = new THREE.Mesh(geometry, material);
			tree.castShadow = true;
			tree.recieveShadow = true;
			tree.position.set(x, y, z);
			tree.rotation.y = Math.random() * 360;
			tree.scale.set(150 * scale, 100, 150 * scale);
			
			this.scene.add(tree);
		},
		
		addShelves: function () {
			//TODO:: add shelves
		},

		render: function () {
			this.d += 0.1;
			
			if (skyUniforms) {
				skyUniforms.delta.value += 0.1;
			}

			if (this.water) {

				for (var i = 0; i < this.water.geometry.vertices.length; i += 1) {
					var vertice = this.water.geometry.vertices[i];
					if (vertice.y > 3480) {
		                vertice.y = 3500 + Math.sin(this.d + i + vertice.z) * 10;
					} else if (vertice.x > 1450) {	
						vertice.x = 1500 + Math.sin(this.d + i + vertice.y) * 30;
					}
				}
				this.water.geometry.verticesNeedUpdate = true;
			}
			
			if (this.clouds) {
				for (var i = 0; i < this.clouds.length; i += 1) {
					this.clouds[i].position.x += 1;
				}
			}
			
			if (this.camera) {
				this.camera.position.y = 850 + this._camera.get('position').y;
				this.spotLight.position.y = this._camera.get('position').y + 2000;
				this.spotLight.target.position.y = this._camera.get('position').y + 1000;

				this.renderer.render( this.scene, this.camera );
			}			
			
		},
		
		mousemove: function (e) {

		},
		
		setCamera: function (camera) {
			this._camera = camera;
			this.resize();
		},
		
		resize: function () {
			if (this.renderer) {
				SCREEN_WIDTH = window.innerWidth;
				SCREEN_HEIGHT = window.innerHeight;
								
				this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				this.camera = new THREE.PerspectiveCamera(35, SCREEN_WIDTH / SCREEN_HEIGHT * 2, 2, 10000);
				this.camera.position.set(0, 850, 2000 );
				this.camera.rotation.set(0 * Math.PI / 180, 0, 0);
				this.renderer.render( this.scene, this.camera );
			}
			
		}
	});
		
	return BgView;
});
