uniform vec3 color;
uniform float opacity;

varying vec3 vColor;
varying float vAlpha;

void main() {

	gl_FragColor = vec4( vColor * color, vAlpha * opacity );

}