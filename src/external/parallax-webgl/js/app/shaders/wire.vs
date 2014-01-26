uniform float amplitude;

attribute vec3 displacement;
attribute vec3 customColor;
attribute float customAlpha;

varying vec3 vColor;
varying float vAlpha;

void main() {

	vec3 newPosition = position + amplitude * displacement;

	vColor = customColor;
	vAlpha = customAlpha;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}