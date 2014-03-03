define(function (require) {
	
	require('three');
	
	return new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 11000);
});
