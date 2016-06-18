uniform float _xc;
uniform float _yc;
uniform float _sz;
uniform float _huefreq;
uniform int _escape;
uniform int _maxiter;

vec4 HSVtoRGB( float h, float s, float v ){
   int i;
   float f, p, q, t;
   vec4 RGB;
   
   h = 360*h;
   /*if( s == 0 ) {
      // achromatic (grey)
      RGB = vec3(v,v,v);
      return RGB
   }*/
   
   h /= 60;         // sector 0 to 5
   i = int(floor( h ));
   f = h - i;         // factorial part of h
   p = v * ( 1 - s );
   q = v * ( 1 - s * f );
   t = v * ( 1 - s * ( 1 - f ) );
   
   switch( i ) {
      case 0:
         RGB.x = v;
         RGB.y = t;
         RGB.z = p;
         break;
      case 1:
         RGB.x = q;
         RGB.y = v;
         RGB.z = p;
         break;
      case 2:
         RGB.x = p;
         RGB.y = v;
         RGB.z = t;
         break;
      case 3:
         RGB.x = p;
         RGB.y = q;
         RGB.z = v;
         break;
      case 4:
         RGB.x = t;
         RGB.y = p;
         RGB.z = v;
         break;
      default:      // case 5:
         RGB.x = v;
         RGB.y = p;
         RGB.z = q;
         break;
   }
   
   RGB.w = 1.0;
   return RGB;
   
}


void main(void) {
	
	float xmin, ymin, x, y, a, b, n, aa, bb, twoab, h;
	vec4 Cmandel;
	
	//Convierte las coordenadas s, t a (x,y)
	xmin = _xc - 0.5 * _sz;
	ymin = _yc - 0.5 * _sz;
	x = xmin + _sz * gl_TexCoord[0].s;
	y = ymin + _sz * gl_TexCoord[0].t; 

	n = 0;
	a = x;
	b = y;

	while (n < _maxiter) {
		aa = a*a;
		bb = b*b;
		twoab = 2*a*b;

		if ((aa + bb) > _escape) 
			break;

		n = n + 1;
		a = aa - bb + x;
		b = twoab + y;
	}

	//Convierte n a color

	h = 0.5 * (1 + sin(_huefreq * n / _maxiter));
	Cmandel = HSVtoRGB(h,1.0,1.0);

	gl_FragColor = Cmandel;
}