/*global define $*/

define(function (require) {

    var BushSprite,
        Sprite = require('app/sprites/sprite');

    BushSprite = Sprite.extend({

        initialize: function (options) {
            this.image = options.image;
            this.ctx = options.ctx;
            this.x = options.x;
            this.y = options.y;

            this.tex = {x: 73, y: 0, w: 35, h: 30};

            Sprite.prototype.initialize.call(this);
        }

    });

    return BushSprite;
});
