/*global define createjs TweenMax THREE*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		VShader = require('text!app/shaders/sin.vs'),
		FShader = require('text!app/shaders/sin.fs'),
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
				colorArray = [0x9bc9a8, 0x7e4b83];

            this.el = document.getElementById('ui-button-vert-shader');
			this.el.style.opacity = '1';
			this.delta = 0;

            this.renderer = new THREE.WebGLRenderer({canvas: this.el, antialias: true});
			this.renderer.setClearColor(0xffffff);
			this.camera = new THREE.PerspectiveCamera(35, 200 / 200, 2, 10000);
            this.scene = new THREE.Scene();

			ambientLight = new THREE.AmbientLight(0xffffff);
			this.scene.add(ambientLight);           

            this.geometry = new THREE.SphereGeometry(50, 10, 10);

			this.uniforms = {
				time: {type: 'f', value: 0.0},
				resolution: {type: 'v2', value: new THREE.Vector2(100, 100)},
				displacement: {type: 'v3', value: new THREE.Vector3(100, 100, 100)},
				customColor: {type: 'v3', value: new THREE.Vector3(100, 100, 100)},
				customAlpha: {type: 'f', value: 1.0}
			}
			
            this.material = new THREE.ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: VShader,
				fragmentShader: FShader
            });
			
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.z = -200;
            this.scene.add(this.mesh);

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
				this.delta += .01;
				this.uniforms.time.value = Math.sin(this.delta) * 20;
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
