/*global define createjs TweenMax*/
define([], function (require) {
	
	var Backbone = require('backbone'),
		Vars = require('pres/models/vars'),
		AppEvent = require('pres/events/app-event'),
		UIView;

	require('tweenmax');

	UIView = Backbone.View.extend({
		
	
		render: function (e) {

        },
		
		destroy: function () {
        
        }
		
	});
	
	return UIView;
});
