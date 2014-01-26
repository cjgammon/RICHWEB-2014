/*global define $*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		SlideView = require('pres/views/slide-view'),
		IframeView;
		
	require('tweenmax');
	
	IframeView = SlideView.extend({
		
		resolve: function () {
			var slides = Vars.get('slides'),
				currentSlide = Vars.get('currentSlide'),
				view = slides.get(currentSlide).get('view');
			
			if (view == this) {	
				this.active = true;
				this.iframe = this.$el.find('iframe');
				this.iframe.attr('src', this.iframe.data('src'));

				$('.iframe-clickarea').remove();
				this.clickarea = $('<div>');
				this.clickarea.addClass('iframe-clickarea');
				this.clickarea.bind('click', this.handle_clickarea_CLICK.bind(this));
				this.$el.append(this.clickarea);

				AppEvent.trigger('stopanimation');
			}
		},
		
		handle_clickarea_CLICK: function (e) {
			e.stopPropagation();
			
			this.clickarea.addClass('focus');
			this.iframe.addClass('focus');
			this.iframe.focus();
			
			this.$el.bind('click', this.handle_el_CLICK.bind(this));
		},
		
		handle_el_CLICK: function (e) {
			this.clickarea.removeClass('focus');
			this.iframe.removeClass('focus');
			
			this.$el.unbind('click', this.handle_el_CLICK.bind(this));
		},
		
		desolve: function () {
			if (this.active) {
				this.active = false;
				this.clickarea.removeClass('focus');
				this.clickarea.remove();
				this.iframe.removeClass('focus');
				this.$el.unbind('click', this.handle_el_CLICK.bind(this));
				this.clickarea.remove();
				this.iframe.attr('src', 'about:blank');
				//AppEvent.trigger('startanimation');
			}
		}
		
	});
	
	return IframeView;
});
