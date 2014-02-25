attribute float displacement;
uniform float time;

void main() {

	vec3 newPosition = position + normal * vec3(displacement + time) * (time / 2.0);
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}