define([], 
	function (require) {
		
	var Backbone = require('backbone'),
        Camera;
		
	Camera = Backbone.Model.extend({
		defaults: {
			'position': {x: 0, y: 0, z: 0},
			'rotation': {x: 0, y: 0, z: 0},
			'fov': 50
		},
		
		initialize: function () {
			
		},
		
		getFovValue: function () {
			return 0.5 / Math.tan(this.get('fov') * Math.PI / 360) * window.innerHeight;
		}
	});
	
	return Camera;
});
