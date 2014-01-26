/*global define _*/
define(function (require) {
	
	var Backbone = require('backbone'),
		UserEvent; 
			
	UserEvent = _.clone(Backbone.Events);
	
	return UserEvent;
});
