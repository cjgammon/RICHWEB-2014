/*global define createjs TweenMax Savage*/
define(function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
        UIView;

	require('tweenmax');
    //require('vendors/eve'); //does not work with modules, in DOM
	require('vendor/snap/snap.svg');

	UIView = Backbone.View.extend({
		
        initialize: function () {
            var bg,
                i,
                circle,
                radius,
                stroke;

            this.el = document.getElementById("ui-button-svg-2");

            this.s = Snap('200', '200');
            this.el.appendChild(this.s.node);

            bg = this.s.circle(100, 100, 100);
            bg.attr({fill: '#ffffff'});

            this.circles = [];

            for (i = 0; i < 20; i += 1) {
                radius = 90 / (1 + i / 3);
                stroke = 10 / (1 + i / 1.1);
                circle = this.s.circle(100, 100, radius);
                circle.attr({fill: 'none', stroke: '#e96233', "stroke-width": stroke});
                this.circles.push(circle);
            }

            this.el.addEventListener('mousemove', this.handle_MOUSEMOVE.bind(this));
            this.el.addEventListener('mouseout', this.handle_MOUSEOUT.bind(this));
        },

        handle_MOUSEMOVE: function (e) {
            var i,
                circle,
                _x, _y;

            for (i = this.circles.length - 1; i > -1; i -= 1) {
                circle = this.circles[i];
                _x = 100 + (e.offsetX - 100) * (i * 0.05);
                _y = 100 + (e.offsetY - 100) * (i * 0.05);

                if (!isNaN(_y) && !isNaN(_x)) {
                    try {
                        circle.attr({cx: _x, cy: _y});
                    } catch (error) { 
                    
                    }
                }
            }
        },

        handle_MOUSEOUT: function (e) {
            var i,
                circle;

            for (i = 1; i < this.circles.length; i += 1) {
                circle = this.circles[i];
                try {
                    circle.animate({cx: 100, cy: 100}, 200);
                } catch (error) { 
                    circle.attr({cx: 100, cy: 100});
                }
            }
        },

		destroy: function () {
            this.el.innerHTML = "";
            this.el.removeEventListener('mousemove');
            this.el.removeEventListener('mouseout');
        }
		
	});
	
	return UIView;
});
