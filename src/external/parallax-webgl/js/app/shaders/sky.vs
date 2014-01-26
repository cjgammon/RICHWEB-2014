varying vec2 vUv;
varying float time;
uniform float delta;

void main()
{
    vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix *  vec4(position,1.0);
}
