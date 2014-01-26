/*global define $*/

define(function (require) {

    var TreeSprite,
        Sprite = require('app/sprites/sprite');

    TreeSprite = Sprite.extend({

        initialize: function (options) {
            this.image = options.image;
            this.ctx = options.ctx;
            this.x = options.x;
            this.y = options.y;

            this.tex = {x: 0, y: 0, w: 72, h: 108};

            Sprite.prototype.initialize.call(this);
        }

    });

    return TreeSprite;
});
