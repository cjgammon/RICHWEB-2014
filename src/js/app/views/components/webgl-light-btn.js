/*global define createjs TweenMax THREE Bounce Quad*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
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

            this.el = document.getElementById('ui-button-webgl-light');
			this.el.style.opacity = '1';

            this.renderer = new THREE.WebGLRenderer({canvas: this.el, antialias: true});
            this.renderer.setSize(200, 200);

			//this.camera = new THREE.PerspectiveCamera(35, 200 / 200, 2, 10000);
			this.camera = new THREE.OrthographicCamera(200 / - 2, 200 / 2, 200 / 2, 200 / - 2, 2, 10000);
            this.camera.position.z = 200;
            this.scene = new THREE.Scene();

			ambientLight = new THREE.AmbientLight(0x999999);
			this.scene.add(ambientLight);

			spotLight = new THREE.DirectionalLight(0xffffff, 0.55, 10000);
            spotLight.position.x = 300;
            spotLight.position.y = 100;
            spotLight.position.z = 300;
            this.scene.add(spotLight);

            circle = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshLambertMaterial({
                ambient: 0xffffff,
                color: 0xffffff
            }));
            circle.position.y = -50;
            circle.position.z = -100;
            circle.rotation.x = -60 * Math.PI / 180;
            this.scene.add(circle);

            //mesh
            this.geometry = new THREE.SphereGeometry(100, 30, 30, 30);
            THREE.GeometryUtils.triangulateQuads(this.geometry);
            
            this.material = new THREE.MeshPhongMaterial({
                ambient: 0xffffff, 
                vertexColors: THREE.FaceColors
            });
            
            this.obj = new THREE.Object3D();
            this.obj.position.y = -100;
            this.scene.add(this.obj);

            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.scale.set(0.4, 0.4, 0.4);
            this.mesh.position.y = 100;
            this.mesh.position.z = -100;
            this.obj.add(this.mesh);
            spotLight.target = this.mesh;

            this.renderer.shadowMapEnabled = true;
            this.renderer.shadowMapSoft = true;
            this.renderer.shadowCameraNear = 3;
            this.renderer.shadowCameraFar = this.camera.far;
            this.renderer.shadowCameraFov = 20;
            this.renderer.shadowMapBias = 0.0039;
            this.renderer.shadowMapDarkness = 0.5;
            this.renderer.shadowMapWidth = 2048;
            this.renderer.shadowMapHeight = 2048;

            spotLight.castShadow = true;
            this.mesh.castShadow = true;
            circle.receiveShadow = true;

            this.el.addEventListener('mouseover', this.handle_MOUSEOVER.bind(this));
            this.el.addEventListener('mouseout', this.handle_MOUSEOUT.bind(this));
        },

        handle_MOUSEOVER: function (e) {
            new TweenMax.to(this.obj.position, 1, {y: -50});
        },

        handle_MOUSEOUT: function (e) {
            new TweenMax.to(this.obj.position, 1, {y: -100, ease: Bounce.easeOut});
            new TweenMax.to(this.obj.scale, 0.2, {y: 0.8, delay: 0.3, ease: Quad.easeOut, onComplete: function () {
                new TweenMax.to(this.obj.scale, 0.2, {y: 1, ease: Quad.easeOut});
            }.bind(this)});
        },
	
		render: function (e) {
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
