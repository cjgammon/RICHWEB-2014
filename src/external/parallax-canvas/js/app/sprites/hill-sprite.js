/*global define $*/

define(function (require) {

    var HillSprite,
        Sprite = require('app/sprites/sprite');

    HillSprite = Sprite.extend({

        initialize: function (options) {
            this.image = options.image;
            this.ctx = options.ctx;
            this.x = options.x;
            this.y = options.y;

            this.tex = {x: 73, y: 40, w: 65, h: 65};

            Sprite.prototype.initialize.call(this);
        }

    });

    return HillSprite;
});
