/*global define THREE $ TweenMax*/
define(function (require) {
	
	var Backbone = require('backbone'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		blenderModel = require('text!app/data/island1.js'),
		Camera = require('pres/models/camera'),
		CameraPath = require('app/models/camera-path'),
		BgView,
        directionalLight,
        water;
	
	require('tweenmax');
	require('three');
	require('vendor/Mirror');
	require('vendor/WaterShader');

	BgView = Backbone.View.extend({

		initialize: function () {			
			this.$el = $('#ground');
						
			UserEvent.on('resize', this.resize, this);

			this.addScene();
		},
		
		addScene: function () {
			this.renderer = new THREE.WebGLRenderer({canvas: this.$el[0], antialias: true});
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(0x000000);
						
			this.scene = new THREE.Scene();
			
			
			//LIGHTS
				
			directionalLight = new THREE.DirectionalLight(0xff9966);
			directionalLight.position.set(1, 0, 1);
			this.scene.add(directionalLight);
			
			var light = new THREE.DirectionalLight(0xcc9966);
			light.position.set(1, 0, -1);
			this.scene.add(light);
			
			var light = new THREE.SpotLight(0xcc6633);
			light.position.set(1000, 0, 1000);
			this.scene.add(light);
			
			var light = new THREE.SpotLight(0x336699);
			light.position.set(-1000, 0, -1000);
			this.scene.add(light);
			
			var light = new THREE.SpotLight(0xcc9966);
			light.position.set(-1000, 0, 1000);
			this.scene.add(light);
			
			var light = new THREE.AmbientLight(0x333333);
			this.scene.add(light);
			
			this.addSky();
			this.addModel();
            this.addWater();
			
			this.renderer.render(this.scene, Camera);
		},
		
		addModel: function () {
			var i,
                mesh,
				content,
				loader,
				model;
			
			content = JSON.parse(blenderModel);
			loader = new THREE.JSONLoader();
			model = loader.parse(content);
			
			for (i = 0; i < model.materials.length; i += 1) {
				model.materials[i].shading = THREE.FlatShading;
				model.materials[i].side = THREE.DoubleSide;
			}

			//model.materials[4].transparent = true;
			//model.materials[4].opacity = 0.5;
			//model.materials[4].blending = THREE.AdditiveBlending;

			mesh = new THREE.Mesh(model.geometry, new THREE.MeshFaceMaterial(model.materials));
			mesh.scale.set(40, 40, 40);
			this.scene.add(mesh);
			
			this.terrain = mesh;
		},
		
		addSky: function () {
			var mesh,
				geo,
				mat;
			
			geo = new THREE.SphereGeometry(8000, 100, 100);
			mat = new THREE.MeshBasicMaterial({
                color: 0x3377ff, 
				side: THREE.BackSide
			});
			
			mesh = new THREE.Mesh(geo, mat);
			this.scene.add(mesh);
		},
		
		addWater: function () {
            var mirrorMesh,
                parameters = {
                    width: 7000,
                    height: 7000,
                    widthSegments: 250,
                    heightSegments: 250,
                    depth: 1500,
                    param: 4,
                    filterparam: 1
                },
                waterNormals = new THREE.ImageUtils.loadTexture('assets/images/textures/waternormals.jpg');
            
            waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

            water = new THREE.Water(this.renderer, Camera, this.scene, {
                textureWidth: 512, 
                textureHeight: 512,
                waterNormals: waterNormals,
                alpha: 1.0,
                sunDirection: directionalLight.position.normalize(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 50.0
            });

            mirrorMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(parameters.width * 500, parameters.height * 500, 50, 50),
                water.material
            );

            mirrorMesh.add(water);

            //mirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(8000, 8000), new THREE.MeshBasicMaterial());
            mirrorMesh.position.y = 7;
            mirrorMesh.rotation.x = - Math.PI * 0.5;
            
            this.scene.add(mirrorMesh);
		},
		
		render: function () {

            water.material.uniforms.time.value += 1.0 / 60.0;
            water.render();

			this.renderer.render(this.scene, Camera);
		},

		resize: function () {

		}
	});
		
	return BgView;
});
