/*global define $ requestAnimationFrame*/

define([], function (require) {
	
	var App,
		Backbone = require('backbone'), 
		BgView = require('app/views/bg-view'),
		FigureView = require('app/views/figure-view'),
        AppBase = require('pres/views/app-base'),
		AppEvent = require('pres/events/app-event');

    App = AppBase.extend({		
	
        initialize: function () {
            AppBase.prototype.initialize.call(this);

			this.bg = new BgView();
			this.bg.setCamera(this.camera);
			
			this.$scrollBtn = $('#scroll-btn');
			
			$('figure').each(function () {
				new FigureView({el: this});
			});
			
			//requestAnimationFrame(this.animate.bind(this));	
			requestAnimationFrame(this.render.bind(this));
        },

		handle_MOUSEWHEEL: function (e) {
			
			if ($(window).scrollTop() > 0) {
				if (!this.$scrollBtn.hasClass('out')){
					this.$scrollBtn.addClass('out');
				}
			} else {
				if (this.$scrollBtn.hasClass('out')){
					this.$scrollBtn.removeClass('out');
				}
			}
			
			AppBase.prototype.handle_MOUSEWHEEL.call(this, e);
		},
		/*
		animate: function () {			
		    AppEvent.trigger('animate');
			requestAnimationFrame(this.animate.bind(this));	
		},
		*/
        render: function () {
            AppBase.prototype.render.call(this);
			this.bg.render();
			requestAnimationFrame(this.render.bind(this));	

        }
    });

	return new App();
});
