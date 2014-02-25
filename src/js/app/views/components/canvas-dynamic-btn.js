/*global define createjs TweenMax Group Point Path paper project tool*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		UIView;

	require('tweenmax');

	UIView = Backbone.View.extend({
		
        initialize: function () {
            this.el = document.getElementById('ui-button-canvas');
            this.ctx = this.el.getContext('2d');

            this.colors = ['#939292', '#08a0b8', '#e86131', '#ffffff'];

            this.el.addEventListener('mousemove', this.handle_MOUSEMOVE.bind(this));

            this.drawDefault();
        },

        randomColor: function () {
            var color = Math.floor(Math.random() * this.colors.length);
            return this.colors[color];
        },

        handle_MOUSEMOVE: function (e) {

            this.ctx.beginPath();
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 10;
            this.ctx.fillStyle = this.randomColor();
            this.ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();

            this.drawPyramid(this.ctx, 100, 100, this.randomColor(), 1.7);
            this.drawPyramid(this.ctx, 100, 100, this.randomColor(), 1.2);
            this.drawPyramid(this.ctx, 100, 100, this.randomColor(), 0.8);

            this.mask(this.ctx);
        },

        drawDefault: function () {

            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();

            this.drawPyramid(this.ctx, 100, 100, '#939292', 1.7);
            this.drawPyramid(this.ctx, 100, 100, '#08a0b8', 1.2);
            this.drawPyramid(this.ctx, 100, 100, '#e86131', 0.8);
        },

        drawPyramid: function (ctx, x, y, color, scale) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x - (50 * scale), y + (20 * scale));
            ctx.lineTo(x, y - (50 * scale));
            ctx.lineTo(x + (50 * scale), y + (20 * scale));
            ctx.lineTo(x, y + (50 * scale));
            ctx.fill();
            ctx.closePath();
        },

        mask: function (ctx) {
            
            ctx.save();
            ctx.globalCompositeOperation = "destination-in";
            
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.restore();
        },

		render: function () {
             
        },

		destroy: function () {
            
        }
		
	});
	
	return UIView;
});
