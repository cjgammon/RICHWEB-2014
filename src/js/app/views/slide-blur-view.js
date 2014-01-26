define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		SlideBlurView;
		
	require('tweenmax');
	
	SlideBlurView = SlideView.extend({
		
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
			var slideBlurIn = new TweenMax.fromTo(this.blur, this.getTransitionTime() / 2, {value: 10}, {
				value: 0,
				onUpdateScope: this,
				onUpdate: function () {
					console.log('update')
					this.$el.css('webkitFilter', 'blur(' + this.blur.value + 'px)');
				}
			});
		
			tl.add(slideBlurIn, offset);

			SlideView.prototype.addTransitionIn.call(this, tl, offset);
		},
		
		addTransitionOut: function (tl, offset) {
			var slideBlurOut = new TweenMax.fromTo(this.blur, this.getTransitionTime() / 2, {value: 0}, {
				value: 10,
				onUpdateScope: this,
				onUpdate: function () {
					this.$el.css('webkitFilter', 'blur(' + this.blur.value + 'px)');
				}
			});
			
			tl.add(slideBlurOut, offset);	

			SlideView.prototype.addTransitionOut.call(this, tl, offset);
		}
		
	});
	
	return SlideBlurView;
});