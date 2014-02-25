varying float vDisplacement;
varying float vTime;
varying vec3 vNormal;

void main() {
	vec3 light = vec3(0.5, 0.2, 0.5);
	light = normalize(light);
  
	float dProd = max(0.0, dot(vNormal, light));
	
	float red = vDisplacement * vTime;
	float green = vDisplacement - vTime;
	float blue = vTime / 4.0;
	
	gl_FragColor = vec4(red * dProd, green * dProd, blue * dProd, 1.0);
}