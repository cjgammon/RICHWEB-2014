define(function (require) {
		
	var Backbone = require('backbone'),
		SlideView = require('pres/views/slide-view');
		
	var Slide = Backbone.Model.extend({
		defaults: {
			'number': 0,
			'title': "title",
			'url': "url",
			'view': null
		},
		
		initialize: function () {
			
		}
	});
	
	return Slide;
})