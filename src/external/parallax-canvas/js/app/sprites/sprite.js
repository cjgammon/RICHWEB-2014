/*global define $*/

define(function (require) {

    var Sprite,
        Backbone = require('backbone');

    Sprite = Backbone.View.extend({

        initialize: function () {
            this.scale = 0.5 + Math.random() * 0.5;
        },

        render: function () {
            this.ctx.drawImage(this.image, this.tex.x * window.devicePixelRatio, this.tex.y * window.devicePixelRatio, this.tex.w * window.devicePixelRatio, this.tex.h * window.devicePixelRatio, this.x * window.devicePixelRatio, this.y * window.devicePixelRatio, this.tex.w * this.scale * window.devicePixelRatio, this.tex.h * this.scale * window.devicePixelRatio);
        }

    });

    return Sprite;
});
