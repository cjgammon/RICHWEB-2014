/*global define TimelineMax TweenMax $ Quad THREE*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		CameraPath = require('app/models/camera-path'),
		Camera = require('pres/models/camera'),
		DeckView; 
		
	require('tweenmax');
	require('three');
	require('vendor/CSS3DRenderer');
	
	DeckView = Backbone.View.extend({
		
		initialize: function () {
			this.$el = $('#deck');	
			UserEvent.on('resize', this.resize, this);		
		},
		
		render: function () {
			this.renderer.render(this.scene, Camera);
		},
		
		resolve: function () {
			AppEvent.trigger('resolve');
		},
		
		desolve: function () {
			AppEvent.trigger('desolve');	
		},
		
		setCamera: function (camera) {
			this._camera = camera;
		},

		getSlides: function () {
			return this._slides;
		},

		setSlides: function () {
			var slides = Vars.get('slides'),
				slideElement,
				view,
				pos,
				pathLength,	
				point,
				i;
			
			this._slides = slides;
			
			CameraPath.initialize();
			
			//create scene
			this.renderer = new THREE.CSS3DRenderer();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.domElement.id = "css-renderer";
			document.body.appendChild(this.renderer.domElement);
			
			this.scene = new THREE.Scene();			
			
			//add slides
			for (i = 0; i < this._slides.length; i += 1) {
				
				view = this._slides.at(i).get('view');
								
				if (typeof(view.$el.data('pos')) !== 'undefined') {
					slideElement = new THREE.CSS3DObject(view.el);
					
					pos = view.$el.data('pos');
					CameraPath.positionElement(slideElement, pos);
					
					slideElement.scale.set(0.04, 0.04, 0.04);
					
					this._slides.at(i).set('pos', pos);
					this._slides.at(i).set('sceneObject', slideElement);
					this.scene.add(slideElement);
				}

			}
			
		},
		
		resize: function () {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.render(this.scene, Camera);
		}
	});
	
	return DeckView;
});
