/*global define THREE $ TweenMax*/
define(function (require) {
	
	var Backbone = require('backbone'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		blenderModel = require('text!app/data/scene3.js'),
		Camera = require('pres/models/camera'),
		CameraPath = require('app/models/camera-path'),
		BgView;
	
	require('tweenmax');
	require('three');
	
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
				
			var light = new THREE.DirectionalLight(0xff9966);
			light.position.set(1, 0, 1);
			this.scene.add(light);
			
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
			
			this.renderer.render(this.scene, Camera);
		},
		
		addModel: function () {
			var mesh,
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

			model.materials[4].transparent = true;
			model.materials[4].opacity = 0.5;
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
			var mesh,
				geo,
				mat,
				mat2,
				face,
				random,
				vertice,
				colorArray = [0x9CDCE7, 0x78B8E7],
				i;
			
			geo = new THREE.PlaneGeometry(5000, 5000, 300, 300);

			THREE.GeometryUtils.triangulateQuads(geo);

			for (i = 0; i < geo.vertices.length; i += 1) {
				vertice = geo.vertices[i];
				vertice.z = Math.sin(i * vertice.x * vertice.y) * 2;     
			}
			
			for (i = 0; i < geo.faces.length; i += 1) {
				face = geo.faces[i];
				random = Math.floor(Math.random() * colorArray.length - 1);
				face.color.setHex(colorArray[random]);
			}

			mat = new THREE.MeshLambertMaterial({
				specular: 0x78B8E7,
				color: 0x9CDCE7,
				emissive: 0x006063,
				transparent: true,
				opacity: 0.8
			});
			
			mat2 = new THREE.MeshLambertMaterial({
				vertexColors: THREE.FaceColors
			});
			
			mesh = new THREE.Mesh(geo, mat2);
			mesh.position.y = 4;
			mesh.rotation.x = -90 * Math.PI / 180;
			this.scene.add(mesh);
			
			mesh = new THREE.Mesh(geo, mat);
			mesh.position.y = 5;
			mesh.rotation.x = -90 * Math.PI / 180;
			this.scene.add(mesh);
		},
		
		render: function () {
			this.renderer.render(this.scene, Camera);
		},

		resize: function () {

		}
	});
		
	return BgView;
});
