/*global require*/
require.config({
    shim: {
    },

    paths: {
	    tweenmax: 'vendor/greensock/TweenMax',
	    three: 'vendor/threejs/build/three',
        jquery: 'vendor/jquery/jquery',
        underscore: 'vendor/underscore-amd/underscore',
	    backbone: 'vendor/backbone-amd/backbone',
        raf: 'vendor/RequestAnimationFrame'
    }
});

require(['three', 'app']);
