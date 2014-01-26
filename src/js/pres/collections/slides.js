define(function (require) {
	
	var Backbone = require('backbone'),
		Slide = require('pres/models/slide'),
		Slides = Backbone.Collection.extend({
			model: Slide
		});
	
	return Slides;
});
