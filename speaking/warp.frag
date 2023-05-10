//Author: Madelaine Fischer-Bernhut
//Title: Mirror Warp Flow

#ifdef GL_ES
precision mediump float;
#endif

//get texture coordinates from vert shader
varying vec2 vTexCoord;
  
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//texture coming from p5.js
uniform sampler2D camtext;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float map (float value, float min1, float max1, float min2, float max2){
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
  
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

float drawRect(vec2 st, vec2 pos, vec2 size){
    float result = 1.0;
    
    //Invert size so the size variables will controle the size based on the white dimensions
    vec2 border = (1.0-size)/2.0;
    
    result = step(border.x + pos.x, st.x);
    result *= step(border.x - pos.x, 1.0-st.x);
    result *= step(border.y + pos.y, st.y);
    result *= step(border.y - pos.y, 1.0-st.y);
    
    return result;
}

void main() {
  
    //Position of the pixel divided by resolution, to get normalized positions on the canvas
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 1.5;
    st -= 0.5;

    vec2 uv = vTexCoord;

    //Texture is loaded upside down and backwards by default, so flip it
    uv.y = 1.0 - uv.y;

    //Flip vertically for mirrored image
    uv.x = 1.0 - uv.x;

    vec2 mousePos = u_mouse.xy/u_resolution.xy;

    vec3 color = vec3(0.0); 
    vec3 bg = vec3(0.0);
  

    //Brownian Motion Setup - Reference @patriciogov Book of Shaders
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    //Control direction of flow with mouse interaction  
    mousePos.x = map(mousePos.x, 0.0, 1.0, -0.5, 0.5);
    mousePos.y = map(mousePos.y, 0.0, 1.0, -0.5, 0.5);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2) + mousePos.y*0.5*u_time);
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8) + mousePos.x*0.5*u_time);
  
    float f = fbm(st+r);
  
    //Gradient overlay for rectangular masks
    float gradOverlay1 = smoothstep(-0.2+sin(u_time*0.2)*0.25, 0.3+sin(u_time*0.2)*0.25,st.y*2.0*f);
    float gradOverlay2 = smoothstep(-0.7+sin(u_time*0.2)*0.25, -0.1+sin(u_time*0.2)*0.25,-st.y*2.0*f);

  
    //Create Shape Mask 0
    float rectangle0 = drawRect(st, vec2(-0.77,-0.250+sin(u_time*0.2)*0.25), vec2(0.350,0.9));
    vec3 colorMask0 = vec3(0.0); 
    colorMask0 = vec3(mix(color, vec3(gradOverlay1), rectangle0));

    //Create Shape Mask 1
    float rectangle1 = drawRect(st, vec2(-0.51,-0.250-sin(u_time*0.2)*0.25), vec2(0.350,0.9));
    vec3 colorMask1 = vec3(0.0); 
    colorMask1 = vec3(mix(color, vec3(gradOverlay2), rectangle1));

    //Create Shape Mask 2
    float rectangle2 = drawRect(st, vec2(-0.25,-0.250+sin(u_time*0.2)*0.25), vec2(0.350,0.9));
    vec3 colorMask2 = vec3(0.0); 
    colorMask2 = vec3(mix(color, vec3(gradOverlay1), rectangle2));

      //Create Shape Mask 3
    float rectangle3 = drawRect(st, vec2(0.01,-0.250-sin(u_time*0.2)*0.25), vec2(0.350,0.9));
    vec3 colorMask3 = vec3(0.0); 
    colorMask3 = vec3(mix(color, vec3(gradOverlay2), rectangle3));

     //Create Shape Mask 4
    float rectangle4 = drawRect(st, vec2(0.27,-0.250+sin(u_time*0.2)*0.25), vec2(0.350,0.9));
    vec3 colorMask4 = vec3(0.0); 
    colorMask4 = vec3(mix(color, vec3(gradOverlay1), rectangle4));

    vec3 bgMask = bg - colorMask0 - colorMask1 - colorMask2 - colorMask3 - colorMask4;
  

    //Color wave overlay filter
    vec3 color1 = vec3(0.0);
    color1 = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.4,0.1,0.5),
                clamp((f*f)*4.0,0.0,1.0));

    color1 = mix(color1,
                vec3(0.6,0.3, 0.3),
                clamp(length(q),0.0,1.0));

    color1 = mix(color1,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));
  
    vec3 bgTexture = color1 + bgMask; 
  
    //Zoom in and out of image by multiplying the "UV" value, use fract to tile zoomed out cam texture 
    //Cam texture
    vec4 camTextFeed = texture2D(camtext, fract(uv));

    //Distort cam texture with brownian motion (same as wave overlay)
    vec4 camTextDistort = texture2D(camtext, fract(uv*f*2.0));

    //Distort Texture Coordinates of tiled (50x50) camera feed with brownian motion
    vec4 camTextTile = texture2D(camtext, fract(uv*30.0)*f*f*f+.6*f*f+.5*f);


    color1 = mix(color1*f, vec3(0.75), vec3(camTextDistort.r,camTextDistort.g, camTextDistort.b));

    vec3 color2 = mix(color1*f, vec3(0.75), vec3(camTextFeed.r, camTextFeed.g, camTextFeed.b));

    vec3 maskedShape0 = colorMask0 * color2;  
    vec3 maskedShape1 = colorMask1 * color1*1.2;  
    vec3 maskedShape2 = colorMask2 * color2*1.4;
    vec3 maskedShape3 = colorMask3 * color1*1.2;
    vec3 maskedShape4 = colorMask4 * color2;


    color = mix(maskedShape0, vec3(1.0), maskedShape1);
    color = mix(color, vec3(1.0) , maskedShape2);
    color = mix(color, vec3(1.0) , maskedShape3);
    color = mix(color, vec3(1.0) , maskedShape4);



    color = (mix(color, vec3(1.0), bgTexture));

    //Overlay brownian motion distortion of tiled camera feed 
    // bgTexture = mix(bgTexture, vec3(.75), vec3(camTextTile.r,camTextTile.g, camTextTile.b));

    //Tiles masked inside shader
    // bgTexture = mix(color, bgTexture, vec3(camTextTile.r,camTextTile.g, camTextTile.b));

    //Tiles masked outside of shader
    bgTexture *= mix(color, bgTexture/2.0, vec3(camTextTile.r,camTextTile.g, camTextTile.b));
    bgTexture *= mix(color, bgTexture, vec3(camTextTile.r,camTextTile.g, camTextTile.b));

    gl_FragColor = vec4(color.rgb, 1.0-bgTexture.rgb);
    // gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.0-bgTexture.rgb);

}