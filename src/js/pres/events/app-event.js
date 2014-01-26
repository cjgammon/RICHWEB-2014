/*global define _*/
define(function (require) {
	
	var Backbone = require('backbone'),
		AppEvent; 
			
	AppEvent = _.clone(Backbone.Events);
	
	return AppEvent;
});
