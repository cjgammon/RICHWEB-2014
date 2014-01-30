/*global define createjs TweenMax Savage requestAnimationFrame cancelAnimationFrame*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideBasicView = require('app/views/slide-basic-view'),
		WebglDynamicBtn = require('app/views/components/webgl-dynamic-btn'),
		WebglLightBtn = require('app/views/components/webgl-light-btn'),
		WebglShaderBtn = require('app/views/components/webgl-shader-btn'),
		UIView;

	require('tweenmax');
	
	UIView = SlideBasicView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');

			if (view == this) {
				this.active = true;

                this.dynamicBtn = new WebglDynamicBtn();
                this.lightBtn = new WebglLightBtn();
                this.shaderBtn = new WebglShaderBtn();

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
            this.lightBtn.render();
 			this.shaderBtn.render();
            this.interval = requestAnimationFrame(this.render.bind(this));
        },
		
		destroy: function () {
			this.dynamicBtn.destroy();
            this.lightBtn.destroy();
            this.shaderBtn.destroy();

            cancelAnimationFrame(this.interval);
            this.interval = null;
        }
		
	});
	
	return UIView;
});
