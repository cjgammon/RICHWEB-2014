/*global define*/
define(function (require) {
		
	var Backbone = require('backbone'),
		Vars;
		
	Vars = Backbone.Model.extend({
		initialize: function () {
		    this.set('transitionTime', 1);
        }
	});
	
	return new Vars();
});
