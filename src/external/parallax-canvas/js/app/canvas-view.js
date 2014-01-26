/*global define $ requestAnimationFrame*/

define(function (require) {

    var CanvasView,
        Backbone = require('backbone'),
        UserEvent = require('app/events/user-event'),
        TreeSprite = require('app/sprites/tree-sprite'),
        BushSprite = require('app/sprites/bush-sprite'),
        HillSprite = require('app/sprites/hill-sprite'),
        CloudSprite = require('app/sprites/cloud-sprite'),
        texture,
        snowflakes = [],
        elements = [],
        clouds = [],
        RETINA = window.devicePixelRatio > 1 ? true : false,
        ANIMATING,
        TIMEOUT,
        WINDOW_TOP,
        TREES = [
            [100, 100],
            [130, 130],
            [300, 200],
            [700, 100],
            [800, 150],
            [800, 450],
            [550, 850],
            [330, 1000],
            [300, 1050],
            [100, 1250],
            [200, 1400],
            [230, 1430],
            [180, 1450],
            [880, 1500],
            [680, 1600],
            [500, 1850],
            [300, 1900],
            [100, 2000],
            [130, 2030],
            [350, 2300],
            [850, 2500],
            [880, 2520],
            [840, 2530],
            [800, 2600],
            [700, 2800],
            [730, 2830],
            [330, 2900],
            [130, 3000],
            [330, 3220],
            [530, 3300],
            [670, 3400],
            [970, 3480],
            [800, 3700],
            [600, 3800],
            [570, 3840],
            [80, 3840],
            [150, 3970],
            [100, 4000],
            [150, 4200]
        ],
        BUSHES = [
            [60, 100],
            [300, 100],
            [320, 150],
            [650, 500],
            [600, 530],
            [850, 850],
            [800, 880],
            [340, 1200],
            [360, 1250],
            [300, 1250],
            [400, 1400],
            [430, 1430],
            [480, 1450],
            [680, 1500],
            [650, 1580],
            [800, 1850],
            [770, 1900],
            [100, 2400],
            [130, 2430],
            [350, 2400],
            [550, 2500],
            [680, 2520],
            [640, 2530],
            [900, 2700],
            [500, 2800],
            [430, 2830],
            [130, 2900],
            [140, 2930],
            [30, 3220],
            [50, 3300],
            [770, 3400],
            [800, 3450],
            [600, 3700],
            [400, 3800],
            [370, 3900],
            [30, 3840],
            [150, 4170],
            [100, 4150],
            [350, 4200]
        ],
        HILLS = [
            [100, 200],
            [400, 200],
            [850, 100],
            [250, 500],
            [200, 470],
            [400, 420]
        ],
        CLOUDS = [
            450,
            470,
            900,
            950,
            1500,
            1900,
            2400,
            2800,
            3300,
            3800,
            3850
        ];
        

    /**
     * CanvasView manages bg canvas content
     */
    CanvasView = Backbone.View.extend({

        initialize: function (options) {
            ANIMATING = options.animating || false;

            this.canvas = document.createElement('canvas');
            this.canvas.id = "bg-canvas";
            $('body').prepend($(this.canvas));

            this.ctx = this.canvas.getContext('2d');
            this.resize();

            WINDOW_TOP = $(window).scrollTop();

            texture = new Image();
            texture.src = RETINA ? 'assets/images/png/spritesheet@2x.png' : 'assets/images/png/spritesheet.png';
            texture.addEventListener('load', this.handle_texture_LOAD.bind(this));
        },

        addTrees: function () {
            var i,
                tree,
                bush,
                hill,
                cloud;
            
            for (i = 0; i < CLOUDS.length; i += 1) {
                cloud = new CloudSprite({x: Math.random() * window.innerWidth, y: CLOUDS[i], ctx: this.ctx, image: texture});
                clouds.push(cloud);
            }

            for (i = 0; i < TREES.length; i += 1) {
                tree = new TreeSprite({x: TREES[i][0], y: TREES[i][1], ctx: this.ctx, image: texture});
                elements.push(tree);
            }

            for (i = 0; i < BUSHES.length; i += 1) {
                bush = new BushSprite({x: BUSHES[i][0], y: BUSHES[i][1], ctx: this.ctx, image: texture});
                elements.push(bush);
            }

            for (i = 0; i < HILLS.length; i += 1) {
                hill = new HillSprite({x: HILLS[i][0], y: HILLS[i][1], ctx: this.ctx, image: texture});
                elements.push(hill);
            }
        },

        render: function () {
            var scrollPosition,
                element,
                cloud,
                i;

            scrollPosition = WINDOW_TOP < 0 ? scrollPosition = 0 : scrollPosition = -WINDOW_TOP;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.save();
            this.ctx.translate(0, scrollPosition);
            
            for (i = 0; i < elements.length; i += 1) {
                element = elements[i];
                element.render();
            }

            this.ctx.restore();

            this.ctx.save();
            this.ctx.translate(0, scrollPosition * 0.8);

            for (i = 0; i < clouds.length; i += 1) {
                cloud = clouds[i];
                cloud.render();
                if (ANIMATING !== false) {
                    cloud.x = cloud.x < window.innerWidth ? cloud.x + 1 : -100;
                }
            }

            this.ctx.restore();
            
            if (ANIMATING !== false) {
                requestAnimationFrame(this.render.bind(this));
            }
        },

        handle_SCROLL: function () {
            WINDOW_TOP = $(window).scrollTop() * window.devicePixelRatio;
            if (ANIMATING === false) {
                this.render();
            }
        },

        handle_RESIZE: function () {
            this.resize();
            if (ANIMATING === false) {
                this.render();
            }
        },

        handle_texture_LOAD: function () {
            this.addTrees();
            this.render();

            UserEvent.on('scroll', this.handle_SCROLL.bind(this));
            UserEvent.on('resize', this.handle_RESIZE.bind(this));
        },

        resize: function () {
            this.canvas.width = RETINA ? window.innerWidth * 2 : window.innerWidth;
            this.canvas.height = RETINA ? window.innerHeight * 2 : window.innerHeight;
        }
    });

    return CanvasView;
}); 
