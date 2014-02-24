/*global define createjs TweenMax THREE*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		VShader = require('text!app/shaders/noise.vs'),
		FShader = require('text!app/shaders/noise.fs'),
		UIView;

	require('tweenmax');
	require('three');

	UIView = Backbone.View.extend({

        initialize: function () {
            var i,
                spotLight,
                ambientLight,
                vertice,
                circle,
                face,
                random,
				colorArray = [0xF1953C, 0xcccccc];

            this.el = document.getElementById('ui-button-webgl');
			this.el.style.opacity = '1';

			this.delta = 0;
			
            this.renderer = new THREE.WebGLRenderer({canvas: this.el, antialias: true});
			this.renderer.setClearColor(0xffffff);
			this.camera = new THREE.PerspectiveCamera(35, 200 / 200, 2, 10000);
            this.scene = new THREE.Scene();

			ambientLight = new THREE.AmbientLight(0x313e38);
			this.scene.add(ambientLight);

			spotLight = new THREE.SpotLight(0xcccccc, 2, 10000);
            spotLight.position.y = 100;
            this.scene.add(spotLight);

            this.geometry = new THREE.SphereGeometry(100, 30, 30, 30);
            THREE.GeometryUtils.triangulateQuads(this.geometry);
            
            for (i = 0; i < this.geometry.vertices.length; i += 1) {
                vertice = this.geometry.vertices[i];
                vertice.x += -10 + Math.random() * 20;
                vertice.y += -10 + Math.random() * 20;
                vertice.z += -10 + Math.random() * 20;
            }

			for (i = 0; i < this.geometry.faces.length; i += 1) {
				face = this.geometry.faces[i];
				random = Math.floor(Math.random() * colorArray.length);
				face.color.setHex(colorArray[random]);
			}
			
			/*
			this.uniforms = {
				offset: {type: 'f', value: 0.0},
				time: {type: 'f', value: 0.0},
				resolution: {type: 'v2', value: new THREE.Vector2(100, 100)}
			}
			
            this.material = new THREE.ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: VShader,
				fragmentShader: FShader
            });
			*/
			
            this.material = new THREE.MeshLambertMaterial({
                ambient: 0xffffff, 
                shading: THREE.FlatShading, 
                opacity: 0.9,
                transparent: true,
                vertexColors: THREE.FaceColors
            });

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.scale.set(0.4, 0.4, 0.4);
            this.mesh.position.z = -200;
            this.scene.add(this.mesh);
            spotLight.target = this.mesh;

            this.el.addEventListener('mouseover', this.handle_MOUSEOVER.bind(this));
            this.el.addEventListener('mouseout', this.handle_MOUSEOUT.bind(this));
        },

		handle_MOUSEOVER: function (e) {
			this.animating = true;
		},
		
		handle_MOUSEOUT: function (e) {
			this.animating = false;
		},
		
		render: function () {
			
			if (this.animating) {
				//this.uniforms.offset.value += 1;
				this.delta += 0.1;
				
				var scale = 0.4 + Math.sin(this.delta) * 0.05;
				this.mesh.rotation.x += 0.1;
				this.mesh.rotation.y += 0.1;
				this.mesh.rotation.z += 0.1;
	            this.mesh.scale.set(scale, scale, scale);
				
				this.geometry.verticesNeedUpdate = true;
			}
            
			this.renderer.render(this.scene, this.camera);
        },
		
		destroy: function () {
			this.el.removeEventListener('mouseover', this.handle_MOUSEOVER);
            this.el.removeEventListener('mouseout', this.handle_MOUSEOUT);
			this.el.style.opacity = '0';
        }
		
	});
	
	return UIView;
});
