uniform float _R;
uniform float _calctype;
uniform float _hoff;
uniform float _freq;
uniform float _f;

uniform float _rv;
uniform float _b; 

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

float LCM(float R, float rv){
	float i  = 0;
	float cm = 1.0;

	if(mod(R,rv) == 0){
		cm = 1;
	} else {
		i = 1;

		while(mod(R*i,rv) != 0){
			i = i + 1;
		}
		cm = i;
	}
	return cm;
}


float calcspiro(float R, float rv, float b, float a){
	float rho;
	rho = (sqrt((R-rv)*(R-rv) + b*b + 2*(R-rv)*b*cos((1+R/rv)*a)));
	return rho;
}


vec4 spirofield (float R,float rv, float b, float hoff, float freq, 
                 float calctype, float f) {
	
	float i,theta,rho,nrev,a,rsp,ss,tt;
	vec4 Ci;

	ss = gl_TexCoord[0].s - 0.5;
	tt = gl_TexCoord[0].t - 0.5;
	theta = atan (tt,ss);
	theta += 3.1415;
	rho = 2*sqrt(ss*ss + tt*tt);
	
	if((rho>((R-rv+b)/R)) || (rho<((R-rv-b)/R))) {
		Ci = vec4(0.25,0.25,0.25,1);

	} else {
		float deltad;
		vec4  Ch,Cg;

		nrev = LCM(R,rv);

		if(0 == calctype) {
			float maxdist;
			maxdist = 2;

			for(i = 0; i<nrev;i+=1) {
				a = theta + i*2*3.14159265359;
				rsp = calcspiro(R,rv,b,a)/R;
				deltad = abs(rsp-rho);
				if(deltad>maxdist) {
					maxdist = deltad;
				}
			}
			maxdist *= (nrev*freq);
			maxdist = mod((maxdist + hoff),1.0);
			Ch = HSVtoRGB(maxdist,1,1);
			Cg = vec4(maxdist,maxdist,maxdist,1);

		} else if(1  == calctype) {		
			float mindist;
			mindist = 2;

			for (i=0; i<nrev; i+=1) {
				a= theta + i*2*3.14159265359;
				rsp = calcspiro(R,rv,b,a)/R;
				deltad = abs(rsp-rho);

				if(deltad<mindist) {
					mindist = deltad;
				}
			}

			mindist *= (nrev*freq);
			mindist = mod((mindist+hoff),1.0);
			Ch = HSVtoRGB(mindist,1,1);
			Cg = vec4(mindist,mindist,mindist,1);

		} else{
			float avdist = 0;

			for (i =0; i<nrev; i+=1) {
				a= theta + i*2*3.14159265359;
				rsp = calcspiro(R,rv,b,a)/R;
				avdist += abs(rsp-rho);
			}
			avdist *= freq;
			avdist = mod((avdist + hoff),1.0);
			Ch = HSVtoRGB(avdist,1,1);
			Cg = vec4(avdist,avdist,avdist,1);	
		}
		 Ci = mix(Cg,Ch,f);
	}
	return Ci;
}

void main(void) {

	gl_FragColor = spirofield(_R,_rv,_b,_hoff,_freq,_calctype,_f);
}