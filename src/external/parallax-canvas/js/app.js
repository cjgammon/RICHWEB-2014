/*global define $ Modernizr*/

define(function (require) {
    var App,
        Backbone = require('backbone'),
        UserEvent = require('app/events/user-event'),
        InView = require('app/in-view'),
        CanvasView = require('app/canvas-view');

    App = Backbone.View.extend({
        initialize: function () {
            var animate = false;

            if (!Modernizr.touch) {
                InView.init();
            } 

            //canvas performance is better in webkit
            if (navigator.userAgent.toLowerCase().indexOf('webkit') > -1) {
                animate = true;
            }

            //use webgl to weed out non modern browsers
            if (Modernizr.touch !== true && Modernizr.webgl !== false) {
                this.canvasView = new CanvasView({animating: animate});
            } else {
                $('html').addClass('no-webgl');
            }

            window.addEventListener('scroll', this.handle_SCROLL);
            window.addEventListener('resize', this.handle_RESIZE);
        },

        handle_SCROLL: function () {
            UserEvent.trigger('scroll');
        },

        handle_RESIZE: function () {
            UserEvent.trigger('resize');
        }
    });

    return new App();
});
