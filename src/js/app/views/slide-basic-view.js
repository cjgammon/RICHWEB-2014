define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		SlideBasicView;
		
	require('tweenmax');
	
	SlideBasicView = SlideView.extend({
		
		initialize: function () {
			this.blur = {value: 0};
			
			SlideView.prototype.initialize.call(this);
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
		
		render: function () {
			if (this.in) {

			}
		},
		
		addTransitionIn: function (tl, offset) {
			var slideIn;
							
			slideIn = new TweenMax.set(this.$el, {
				opacity: 1,
				delay: (this.getTransitionTime() / 2)
			});

			tl.add(slideIn, offset);
		},
		
		addTransitionOut: function (tl, offset) {
			var slideOut;
									
			slideOut = new TweenMax.set(this.$el, {
				opacity: 0,
				delay: (this.getTransitionTime())
			});

			tl.add(slideOut, offset);
		}
		
	});
	
	return SlideBasicView;
});