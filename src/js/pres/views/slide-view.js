/*global define TweenMax*/
define(function (require) {
	
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
		
		setApp: function (app) {
			this._app = app;
		}
		
	});
	
	return SlideView;
});
