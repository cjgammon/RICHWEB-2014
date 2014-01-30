/*global define $*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		GamificationView;
		
	GamificationView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
                setTimeout(function () {
                    $('#achievement').addClass('in');
                }, 100);
			}
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
                $('#achievement').removeClass('in');
			}
		}

	});
	
	return GamificationView;
});

