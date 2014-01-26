define(['backbone', 'pres/models/slide'], function (Backbone, Slide) {
	var Slides = Backbone.Collection.extend({
		model: Slide
	});
	
	return Slides;
});
