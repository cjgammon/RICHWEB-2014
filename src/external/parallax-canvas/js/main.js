/*global require*/

require.config({
    shim: {
    },

    paths: {
	    tweenmax: 'vendor/greensock/TweenMax',
        jquery: 'vendor/jquery/jquery',
        underscore: 'vendor/underscore-amd/underscore',
	    backbone: 'vendor/backbone-amd/backbone',
        raf: 'vendor/RequestAnimationFrame'
    }
});

require(['raf', 'jquery', 'backbone', 'underscore', 'app']);
