/*global define createjs TweenMax Savage requestAnimationFrame cancelAnimationFrame*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideBasicView = require('app/views/slide-basic-view'),
		ShaderVertBtn = require('app/views/components/shader-vert-btn'),
		ShaderFragBtn = require('app/views/components/shader-frag-btn'),
		UIView;

	require('tweenmax');
	
	UIView = SlideBasicView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');

			if (view == this) {
				this.active = true;
				this.vertBtn = new ShaderVertBtn();
				this.fragBtn = new ShaderFragBtn();
                this.render();
            }
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
                this.destroy();
			}
		},

		render: function (e) {
			this.vertBtn.render();
			this.fragBtn.render();
			this.interval = requestAnimationFrame(this.render.bind(this));
        },
		
		destroy: function () {
			this.vertBtn.destroy();
			this.fragBtn.destroy();
			
            cancelAnimationFrame(this.interval);
            this.interval = null;
        }
		
	});
	
	return UIView;
});
