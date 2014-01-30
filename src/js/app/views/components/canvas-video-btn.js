/*global define createjs TweenMax*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		UIView;

	require('tweenmax');

	UIView = Backbone.View.extend({
		
	    initialize: function () {
            this.el = document.getElementById('ui-button-canvas-video');
            this.ctx = this.el.getContext('2d');

            this.delta = 0;

            this.mouse = {x: 100, y: 100};
            this.mouseover = true;

            this.video = document.createElement('video');
            this.video.src = 'assets/videos/mocircshii_640x360.mp4';
			this.video.volume = 0;
            this.video.onload = function () {
                this.render();
                this.mouseover = false;
            }.bind(this);

            this.el.addEventListener('mousemove', this.handle_MOUSEMOVE.bind(this));
            this.el.addEventListener('mouseover', this.handle_MOUSEOVER.bind(this));
            this.el.addEventListener('mouseout', this.handle_MOUSEOUT.bind(this));
        },

        handle_MOUSEOVER: function (e) {
            if (this.video) {
                this.video.play();
            }
            this.mouseover = true;
        },

        handle_MOUSEOUT: function (e) {
            if (this.video) {
                this.video.pause();
            }
            this.mouseover = false;
        },

        handle_MOUSEMOVE: function (e) {
            this.mouse.x = Math.min(e.offsetX, 100 + 30);
            this.mouse.y = Math.min(e.offsetY, 100 + 30);
            this.mouse.x = Math.max(this.mouse.x, 100 - 30);
            this.mouse.y = Math.max(this.mouse.y, 100 - 30);
        },

		render: function () {
            
            if (!this.mouseover) {
                return;
            }

            this.delta += 0.1;

            this.ctx.clearRect(0, 0, 200, 200);
			
            this.ctx.globalCompositeOperation = "source-over";

            this.ctx.beginPath();
            this.ctx.fillStyle = "rgb(232, 97, 49)";
            this.ctx.rect(0, 0, 200, 200);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.drawImage(this.video, -220, -95, 640, 320);

            //mask
            this.ctx.globalCompositeOperation = "destination-atop";
            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.arc(100, 100, 100, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();

			/*
            this.ctx.globalCompositeOperation = "multiply";
            this.ctx.beginPath();
            this.ctx.fillStyle = "#08a0b8";
            this.ctx.arc((100 / 2) + this.mouse.x / 2, (100 / 2) + this.mouse.y / 2, 50 + Math.sin(this.delta) * 10, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.globalCompositeOperation = "color-burn";
            this.ctx.beginPath();
            this.ctx.fillStyle = "#ae57a1";
            this.ctx.arc(this.mouse.x, this.mouse.y, 60 + Math.cos(this.delta) * 10, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.closePath();
			*/
        },
		
		destroy: function () {
            this.video.pause();
            this.video.src = '';
            this.video = null;
            this.el.removeEventListener('mousemove');
            this.el.removeEventListener('mouseover');
            this.el.removeEventListener('mouseout');
        }
		
	});
	
	return UIView;
});
