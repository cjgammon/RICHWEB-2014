attribute float displacement;
uniform float time;

varying float vDisplacement;
varying float vTime;
varying vec3 vNormal;

void main() {

	vDisplacement = displacement;
	vTime = time;
	vNormal = normal;
	
	vec3 newPosition = position + normal;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}