/*global define $*/

define(function (require) {

    var CloudSprite,
        Sprite = require('app/sprites/sprite');

    CloudSprite = Sprite.extend({

        initialize: function (options) {
            this.image = options.image;
            this.ctx = options.ctx;
            this.x = options.x;
            this.y = options.y;

            this.tex = {x: 136, y: 0, w: 96, h: 67};

            Sprite.prototype.initialize.call(this);
        }

    });

    return CloudSprite;
});
