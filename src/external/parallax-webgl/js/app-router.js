define([], function (require) {
	
	var Backbone = require('backbone'),
		AppRouter = Backbone.Router.extend({
		routes: {
			'': 'cover',
			'slide/:number': 'slide'
		}
	});
	
	return AppRouter;
})