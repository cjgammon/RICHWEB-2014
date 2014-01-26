#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;
uniform float delta;

varying vec2 vUv;        

void main(void)
{
	vec2 position = vUv;

	float red = 0.1;
	float green = 0.0;
	float blue = 0.1;
	
	
	if (vUv.y < 0.85) {
		float offset = 0.1 + (0.85 - vUv.y) * (1.0 + sin(delta * 0.1) * 1.0);
	
		blue = offset;
		red = offset;
		
		//blue *= (1.1 + cos(vUv.x + delta * 0.3) * 0.05);
		blue *= 1.0 + cos(vUv.x + delta * 0.3) * 0.05;
		
	}
	
	if (vUv.y < 0.8) {
		blue += 0.0 + cos(vUv.x + delta * 0.2) * 0.01;
	
	}

    vec3 rgb = vec3(red, green, blue);
    vec4 color = vec4(rgb, 1.0);
    
	gl_FragColor = color;	
}

