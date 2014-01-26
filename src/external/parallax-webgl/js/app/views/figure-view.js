/*global define THREE $ TweenMax*/
define([], function (require) {
	
	var Backbone = require('backbone'),
		UserEvent = require('pres/events/user-event'),
		AppEvent = require('pres/events/app-event'),
		POL = require('app/utils/pol'),
		FigureView,
		width = window.innerWidth,
		height = window.innerHeight;
		
	FigureView = Backbone.View.extend({
		initialize: function () {
			this.el = this.options.el;
			
			this.figcaption = this.$el.find('figcaption')[0];
			
			this.canvas = document.createElement('canvas');
			this.canvas.width = 500;
			this.canvas.height = 300;
			
			this.ctx = this.canvas.getContext('2d');
			
			this.$el.prepend(this.canvas);
			
			var vertices1 = '176.507,26.975 270.11,0 399.519,6.939 457.684,61.974 443.204,138.881 469.982,213.852 331.876,235.904 196.589,209.441 61.302,236.454 0,158.726 42.279,99.191 66.587,28.076';
			this.polygon1 = new POL(vertices1);
			this.polygon1.setContext(this.ctx);
			
			var vertices2 = '61.985,79.344 47.188,135.573 87.351,198.417 182.475,198.417 273.37,188.494 309.306,208.34 404.43,191.802 404.43,120.689 423.454,69.233 326.217,33.038 253.289,69.233 205.727,33.038 123.287,69.233';
			this.polygon2 = new POL(vertices2);
			this.polygon2.setContext(this.ctx);
			
			var vertices3 = '180.758,85.892 180.128,88.285 181.837,90.958 185.885,90.958 189.752,90.536 191.281,91.381 195.329,90.677 195.329,87.651 196.138,85.462 192.001,83.922 188.898,85.462 186.874,83.922 183.366,85.462';
			this.clip1 = new POL(vertices3);
			
			var vertices4 = '-105.931,17.51 -131.035,112.902 -62.898,219.517 98.479,219.517 252.684,202.683 313.649,236.351 475.026,208.295 475.026,87.651 507.301,0.356 342.338,-61.049 218.616,0.356 137.927,-61.049 -1.933,0.356';
			this.clip2 = new POL(vertices4);
			
			this.clip1.setClip(this.figcaption);
			this.clip2.setClip(this.figcaption);
			//this.clip1.clipPolygon();
			
			setTimeout(function () {
			//	this.figcaption.style.webkitTransition = "-webkit-clip-path 1s";
			}.bind(this), 1000);
			
			UserEvent.on('mousewheel', this.handle_MOUSEWEHEEL.bind(this));
			
			this.render();
		},
		
		handle_MOUSEWEHEEL: function () {

			if (this.$el.offset().top >= window.pageYOffset
				&& this.$el.offset().top + (this.$el.height() / 2) <= window.pageYOffset + height) 
			{
				if (!this.$el.hasClass('in')) {
					this.$el.addClass('in');
				}
			} else {
				if (this.$el.hasClass('in')) {
					this.$el.removeClass('in');
				}
			}
		},
		
		render: function () {
			this.ctx.fillStyle = "rgba(38, 14, 10, 0.7)";
			this.polygon1.canvasPolygon();	
			this.ctx.fill();
			
			this.ctx.fillStyle = "rgba(38, 14, 10, 0.7)";
			this.polygon2.canvasPolygon();	
			this.ctx.fill();
		},
		
		resize: function () {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	});
	
	return FigureView;
});