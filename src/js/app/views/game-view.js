/*global define*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		GameView;
		
	GameView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
                this.step = 0;
				this.iframe = this.$el.find('iframe');
                this.iframe.css('pointer-events', 'none');
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
		},

        trigger: function () {
            this.step += 1;
            
            if (this.step < this.$el.data('steps')) {
                this.iframe[0].contentWindow.trigger();
            } else {
		        AppEvent.trigger('next');
            }
        }
		
	});
	
	return GameView;
});

