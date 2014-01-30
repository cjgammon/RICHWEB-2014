/*global define createjs TweenMax Savage*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideBasicView = require('app/views/slide-basic-view'),
        SVGDynamicBtn = require('app/views/components/svg-dynamic-btn'),
		UIView,
        _width = window.innerWidth,
        _height = window.innerHeight;

	require('tweenmax');
	
	UIView = SlideBasicView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');

			if (view == this) {
				this.in = true;
				this.basicBtn = $('#ui-button-svg');
				this.animBtn = $('#ui-button-svg-1');
				this.basicBtn.css('display', 'block');
				this.animBtn.css('display', 'block');
				
                this.dynamicBtn = new SVGDynamicBtn();
            }
		},
		
		desolve: function () {
			if (this.in) {
				this.in = false;
				this.basicBtn.css('display', 'none');
				this.animBtn.css('display', 'none');
                this.destroy();
			}
		},

		render: function (e) {

        },
		
		destroy: function () {
            this.dynamicBtn.destroy();
            this.dynamicBtn = null;
        }
		
	});
	
	return UIView;
});
