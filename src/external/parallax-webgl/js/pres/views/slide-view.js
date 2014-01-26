define([], function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView;
		
	require('tweenmax');
	
	SlideView = Backbone.View.extend({
		
		initialize: function () {
			AppEvent.on('resolve', this.resolve, this);
			AppEvent.on('desolve', this.desolve, this);
		},
		
		render: function () {

		},
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
				
			if (view == this) {
				this.in = true;
			}
		},
		
		desolve: function () {
			if (this.in) {
				this.in = false;
			}
		},

        trigger: function () {
		    AppEvent.trigger('next');
        },

		addTransitionIn: function (tl, offset) {
			var slideIn;
							
			slideIn = new TweenMax.to(this.$el, this.getTransitionTime() / 2, {
				opacity: 1
			});

			tl.add(slideIn, offset);
		},
		
		addTransitionOut: function (tl, offset) {
			var slideOut;
									
			slideOut = new TweenMax.to(this.$el, this.getTransitionTime() / 2, {
				opacity: 0
			});

			tl.add(slideOut, offset);
		},
		
		getTransitionTime: function () {
			return Vars.get('transitionTime');
		},
		
		setPosition: function () {
			/*
			new TweenMax.set(this.$el, {
				x: this.$el.data('x'), 
				y: this.$el.data('y'), 
				z: this.$el.data('z'),
				scaleY: -1
			});
			*/
		},
		
		setApp: function (app) {
			this._app = app;
		}
		
	});
	
	return SlideView;
});
