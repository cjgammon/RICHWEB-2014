/*global define $*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		IframeFullView;
		
	IframeFullView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
				this.iframe = this.$el.find('iframe');
				this.iframe.attr('src', this.iframe.data('src'));

				AppEvent.trigger('stopanimation');
			}
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
			    this.iframe.attr('src', 'about:blank');
				AppEvent.trigger('startanimation');
			}
		}
		
	});
	
	return IframeFullView;
});
