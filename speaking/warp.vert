#ifdef GL_ES
precision mediump float;
#endif

  //vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;
 
void main() {
  //copy the texture coordinates
  vTexCoord = aTexCoord;

  //copy the position data into a vec4, adding 1.0 as the w parameter
  vec4 positionVec4 = vec4(aPosition, 1.0);

  //scale to make the output fit the canvas
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  //send the vertex information on to the fragment shader
  gl_Position = positionVec4;
}
