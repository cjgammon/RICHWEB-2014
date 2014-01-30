/*global define createjs TweenMax requestAnimationFrame cancelAnimationFrame*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideBasicView = require('app/views/slide-basic-view'),
		CanvasDynamicBtn = require('app/views/components/canvas-dynamic-btn'),
		CanvasBlendBtn = require('app/views/components/canvas-blend-btn'),
		CanvasVideoBtn = require('app/views/components/canvas-video-btn'),
		UIView;

	require('tweenmax');
	
	UIView = SlideBasicView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');

			if (view == this) {
				this.active = true;

                this.dynamicBtn = new CanvasDynamicBtn();
                this.blendBtn = new CanvasBlendBtn();
                this.videoBtn = new CanvasVideoBtn();

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
            this.dynamicBtn.render();
            this.blendBtn.render();
            this.videoBtn.render();
			
			this.dynamicBtn.el.style.opacity = 1;
			this.blendBtn.el.style.opacity = 1;
			this.videoBtn.el.style.opacity = 1;
            this.interval = requestAnimationFrame(this.render.bind(this));
        },
		
		destroy: function () {
            cancelAnimationFrame(this.interval);
            this.interval = null;

			this.dynamicBtn.el.style.opacity = 0;
			this.blendBtn.el.style.opacity = 0;
			this.videoBtn.el.style.opacity = 0;

            this.dynamicBtn.destroy();
            this.dynamicBtn = null;
        
            this.blendBtn.destroy();
            this.blendBtn = null;

            this.videoBtn.destroy();
            this.videoBtn = null;

        }
		
	});
	
	return UIView;
});
