uniform float time;
varying vec2 vUv;

void main( void ) {
	vec2 position = vUv;

	float r = 1.0;
	float g = 0.0;
	float b = 0.0;
	gl_FragColor = vec4(r, g, b, 1.0);
}
