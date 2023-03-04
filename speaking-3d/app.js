import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.138.3/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.138.3/examples/jsm/geometries/TextGeometry.js';
import * as BufferGeometryUtils from 'https://unpkg.com/three@0.138.3/examples/jsm/utils/BufferGeometryUtils.js';



let morpher;
let myFont;
let sentences = [
  {
  words: [
  { text: 'I', translation: 'Ako' },
  { text: 'was', translation: 'ay' },
  { text: 'a', translation: 'isang' },
  { text: 'muse', translation: 'muse' },
  { text: '3', translation: 'tatlong' },
  { text: 'times', translation: 'beses' },
  { text: 'in', translation: 'sa' },
  { text: 'my', translation: 'aking' },
  { text: 'life.', translation: 'buhay.' }
  ]
  },
  {
  words: [
  { text: 'Your', translation: 'Iyong' },
  { text: 'grandpa', translation: 'lolo' },
  { text: 'was', translation: 'ay' },
  { text: 'tall,', translation: 'matangkad,' },
  { text: 'dark,', translation: 'maitim,' },
  { text: 'handsome,', translation: 'maganda,' },
  { text: 'scholar,', translation: 'isipbata' },  
  { text: 'and', translation: 'at' },
  { text: 'once', translation: 'isa' },
  { text: 'upon', translation: 'noong' },
  { text: 'a', translation: 'isang' },
  { text: 'time,', translation: 'oras,' },
  { text: 'son', translation: 'anak' },
  { text: 'of', translation: 'ng' },
  { text: 'a', translation: 'isang' },
  { text: 'millionaire.', translation: 'milyonaryo.' }
  ]
  },
  {
    "sentence": "I was born in the third house from the municipal building in front of the church",
    "words": [
      { "text": "I", "translation": "ako" },
      { "text": "was", "translation": "ay" },
      { "text": "born", "translation": "ipinanganak" },
      { "text": "in", "translation": "sa" },
      { "text": "the", "translation": "ang" },
      { "text": "third", "translation": "ikalawa" },
      { "text": "house", "translation": "bahay" },
      { "text": "from", "translation": "mula sa" },
      { "text": "the", "translation": "ang" },
      { "text": "municipal", "translation": "munisipal" },
      { "text": "building", "translation": "gusali ng munisipyo" },
      { "text": "in", "translation": "sa" },
      { "text": "front", "translation": "harapan" },
      { "text": "of", "translation": "ng" },
      { "text": "the", "translation": "ang" },
      { "text": "church", "translation": "simbahan" }
    ]
  },
]


const padding = 20;

let sentenceIndex = 0;
let wordIndex = 0;

let hasMouseMoved = false;
let sound;
let soundOn = true;
let reverb, distortion, panner;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;

let text1Mesh, text2Mesh, mesh;
let clock;
const loader = new FontLoader();
loader.load( 'fonts/Linarc_Medium.json', function ( font ) {

    clock = new THREE.Clock();
    // Create text geometries
    const text1Geometry = new TextGeometry( 'Text 1'.toUpperCase(), {
        font: font,
        height: 1,
        size: 1,        
    } );
    const text2Geometry = new TextGeometry( 'Another Mesh'.toUpperCase(), {
      font: font,
      height: 1,
      size: 1,        
  } );    

    const material = new THREE.MeshNormalMaterial();
    
    
    // Merge the geometries into a single buffer geometry
    //const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries( text1Geometry );

    // Define the morph targets
  //  const morphTargets = [];    
  
    const positions1 = text1Geometry.getAttribute( 'position' ).array;
    const positions2 = text2Geometry.getAttribute( 'position' ).array;
  
    const data_rnd = [];
    for ( let i = 0; i < positions1.count; i ++ ) {
        data_rnd.push( -0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random() );
    }
    text1Geometry.morphAttributes.position = [];
    text1Geometry.morphAttributes.position[ 0 ] =  new THREE.Float32BufferAttribute( data_rnd, 3 );;
    console.log(positions1);
    console.log(positions2);
    //text1Geometry.morphAttributes.position = positions2;
    mesh = new THREE.Mesh( text2Geometry, material );    
    mesh.morphTargetInfluences = [];
    mesh.morphTargetInfluences[0] = [ 0 ]; // start with zero influence for both targets
    scene.add( mesh );

} );


function animate() {
	requestAnimationFrame( animate );


  if (mesh){
    //console.log(mesh);
    const time = clock.getElapsedTime();
    const influence1 = Math.sin( time ) * 0.5 + 0.5; // use sine wave to interpolate between 0 and 1
    //const influence2 = 1 - influence1; // inverse of influence1
  
    //console.log(influence1);
    mesh.morphTargetInfluences[ 0 ] = influence1;
    //mesh.morphTargetInfluences[ 1 ] = influence2;
    mesh.geometry.computeVertexNormals();

    //mesh.updateMorphTargets(); // update the mesh with the new morph target influences
  
  }
  

	renderer.render( scene, camera );
  //text1Mesh.rotation.y += 0.001;
  
}
animate();


// import p5 from 'p5';
// //window.p5 = p5;
// import 'p5/lib/addons/p5.sound';
// import song from './dist/whoosh.mp3';


// let morpher;

// let myFont;

// let string = `Convert the following sentences into a json array of sentences. Each sentence has a words array where each item in the array is an object with a text property that's set to the word and a translation property that's set to the translation in tagalog but make sure to keep the commas and periods in the sentence with the word right before it: 
// - I was a muse three times in my life
// - Your grandpa was tall, dark, handsome, and once upon a time a millionaire
// - I was born in the third house from the municipal building in front of the church
// - Your grandpa was asked by President Ramos to lead the charge to get rid of corruption in Philippines and said no
// - Your grandpa and I were never were boyfriend/girlfriend when we got married
// `

// let sentences = [
//   {
//   words: [
//   { text: 'I', translation: 'Ako' },
//   { text: 'was', translation: 'ay' },
//   { text: 'a', translation: 'isang' },
//   { text: 'muse', translation: 'muse' },
//   { text: '3', translation: 'tatlong' },
//   { text: 'times', translation: 'beses' },
//   { text: 'in', translation: 'sa' },
//   { text: 'my', translation: 'aking' },
//   { text: 'life.', translation: 'buhay.' }
//   ]
//   },
//   {
//   words: [
//   { text: 'Your', translation: 'Iyong' },
//   { text: 'grandpa', translation: 'lolo' },
//   { text: 'was', translation: 'ay' },
//   { text: 'tall,', translation: 'matangkad,' },
//   { text: 'dark,', translation: 'maitim,' },
//   { text: 'handsome,', translation: 'maganda,' },
//   { text: 'scholar,', translation: 'isipbata' },  
//   { text: 'and', translation: 'at' },
//   { text: 'once', translation: 'isa' },
//   { text: 'upon', translation: 'noong' },
//   { text: 'a', translation: 'isang' },
//   { text: 'time,', translation: 'oras,' },
//   { text: 'son', translation: 'anak' },
//   { text: 'of', translation: 'ng' },
//   { text: 'a', translation: 'isang' },
//   { text: 'millionaire.', translation: 'milyonaryo.' }
//   ]
//   },
//   {
//     "sentence": "I was born in the third house from the municipal building in front of the church",
//     "words": [
//       { "text": "I", "translation": "ako" },
//       { "text": "was", "translation": "ay" },
//       { "text": "born", "translation": "ipinanganak" },
//       { "text": "in", "translation": "sa" },
//       { "text": "the", "translation": "ang" },
//       { "text": "third", "translation": "ikalawa" },
//       { "text": "house", "translation": "bahay" },
//       { "text": "from", "translation": "mula sa" },
//       { "text": "the", "translation": "ang" },
//       { "text": "municipal", "translation": "munisipal" },
//       { "text": "building", "translation": "gusali ng munisipyo" },
//       { "text": "in", "translation": "sa" },
//       { "text": "front", "translation": "harapan" },
//       { "text": "of", "translation": "ng" },
//       { "text": "the", "translation": "ang" },
//       { "text": "church", "translation": "simbahan" }
//     ]
//   },
// ]

// const padding = 20;

// let sentenceIndex = 0;
// let wordIndex = 0;

// let hasMouseMoved = false;
// let sound;
// let soundOn = true;
// let reverb, distortion, panner;


// let sketch = function(p) {
// p.preload = function() {
//   sound = p.loadSound(song);
//   // decrease volume by 50%
//   sound.setVolume(0.2);

//   // myFont = loadFont('./dist/paraaminobenzoic.ttf');
//   myFont = p.loadFont('./dist/Retroica.ttf');
//   // myFont = loadFont("./dist/Hyperspace.ttf");
// }




// let started = false;

// let defaultColor, targetColor;

// p.setup = function() {
//   reverb = new p5.Reverb();
//   distortion = new p5.Distortion()
//   panner = new p5.Panner3D();
//   //sound.disconnect();
  
//   reverb.process(sound, 3, 2);
//   defaultColor = p.color(242, 226, 208);
//   targetColor = p.color(0, 20, 80);
//   const canvas = p.createCanvas(900, 600);
//   canvas.parent('content');
//   morpher = new morphMaker();
//   morpher.setup();
//   morpher.calcTargets(0);  
//   morpher.bgColorTarget = morpher.bgColor = p.lerpColor(defaultColor, targetColor, 0); 
//   p.background(0, 255);
//   sentences.forEach(sentence => {
//     sentence.words.forEach(word => {
//       word.x = p.random(padding, width - padding);
//       word.y = p.random(padding, height - padding);
//     })
//   })
//   const button = document.querySelector('button');
//   button.addEventListener('click', function(e){
    
//     let buttonText;
//     soundOn = !soundOn;
//     if (soundOn) {
//       sound.play();                        

//       buttonText = 'Sound Off';
//     } else {
//       sound.stop();
//       buttonText = 'Sound On';
//     }
//     e.target.innerHTML = buttonText;

//   }
//   );

  
// }

// p5.mouseMoved = function(){
//   hasMouseMoved = true;
// }

// p5.mousePressed = function(){
//   started  = true;
//   sound.loop();
 
// }

// p5.draw = function() {  
  
//   if (!started){
//     p.background(defaultColor);
//     p.fill(targetColor);
//     p.textFont(myFont);
//     p.textSize(32);
//     const padding = 20;
//     p.translate(padding, height/5);
//     p.textAlign(CENTER, TOP);
//     p.text('This is my attempt to capture the frustration I can feel trying to understand tagalog. Some phrases are easier to find than others. Either way the struggle to understand can prevent me from fully grasping the story being told. Chronicled here are words from my lola.\r\n\r\nMove the cursor until you find the translation.\r\n\r\nClick to start', 0, 0, width - 2 * padding);
//     //return;
//   }else{    
    
    
//     morpher.update();
    
//     reverb.drywet(1);
//   }
  
// }

// function morphMaker() {

//   this.fadeDuration = 100;
//   this.fadeTimer = 0;
//   this.sentence = [];
//   this.allSentences = [];
//   this.state = null;
//   this.stateTimer = 0;
//   this.easingTimer = 0;
  
//   this.setup = function() {        
    
//     this.particles = [];
//     this.word = sentences[sentenceIndex].words[wordIndex];
//     this.translationDistance = 300;
//     this.progressionDistance = 40;
    

//     const options = {
//       sampleFactor: 1,
//       simplifyThreshold: 0.0,
//     }

//     const translationValue = this.word.translation.toUpperCase();
//     this.word.translation = {
//       value: this.word.translation,
//       points: myFont.textToPoints(translationValue, 0, 0, 100, options),
//       bounds: myFont.textBounds(translationValue, 0, 0, 100)
//     }

//     const textValue = this.word.text.toUpperCase();

//     this.word.text = {
//       value: this.word.text,
//       points: myFont.textToPoints(textValue, 0, 0, 100, options),
//       bounds: myFont.textBounds(textValue, 0, 0, 100)
//     }

//     this.word.translation.points.forEach((point, index) => {
//       this.particles[index] = p.createVector(point.x, point.y);
//     });
//   }

//   this.calcTargets = function(percentage){
//     this.targets = [];
//     for (let i = 0; i < this.particles.length; i++){     
//       this.targets[i] = {};   
//       let findi = p.floor(
//         p.map(i, 0, this.particles.length - 1, 0, this.word.text.points.length - 1)
//       );          
      
//       this.targets[i].x = p.lerp(this.word.translation.points[i].x - this.word.translation.bounds.w/2, this.word.text.points[findi].x  - this.word.text.bounds.w/2, percentage);
//       this.targets[i].y = p.lerp(this.word.translation.points[i].y - this.word.translation.bounds.h/2, this.word.text.points[findi].y - this.word.text.bounds.h/2, percentage);
      
//     } 
//     this.bgColorTarget = p.lerpColor(defaultColor, targetColor, percentage); 
//   }

//   this.moveParticles = function(){
//     if (this.targets.length !== this.particles.length) return;
//     for (let i = 0; i < this.particles.length; i++){        
      
//       const xOffset = 0.75 * p.sin(frameCount * .01 + 2 * p.noise(this.targets[i].x, this.targets[i].y));
//       const yOffset =  0.75 * p.cos(frameCount * .01 + 2 * p.noise(this.targets[i].x, this.targets[i].y))

//       const lerpFactor = p.map(i, 0, this.particles.length - 1, .05, .25, true);

//       this.particles[i].x = p.lerp(this.particles[i].x + xOffset, this.targets[i].x + xOffset, lerpFactor);
//       this.particles[i].y = p.lerp(this.particles[i].y + yOffset, this.targets[i].y + yOffset, lerpFactor * 3);
      
//       for (let j = -1; j <= 1; j+=2){
//         for (let k = -1; k <= 1; k+=2){

//           p.circle(this.particles[i].x + k, this.particles[i].y + j, 1, 1);
//         }
//       }      
//     }    
//   }

//   this.sun = function(radius, x, y, rotation) {    
//     let numPoints = 8;
//     let angle = TWO_PI / numPoints;
   
//     let array = [
//       {x: radius / 10, y: 0},
//       {x: radius / 4.5, y: radius - radius/6},
//       {x: radius / 6.5, y: radius - radius/15},
//       {x: radius / 23, y: 0},
//       {x: radius / 25, y: 0},
//       {x: radius / 10, y: radius - radius/30},
//       {x: 0, y: radius + radius / 12},
//     ]

//     let mirrorArray = [...array];    
//     mirrorArray = mirrorArray.map(point => Object.assign({}, point, {
//        x: -point.x
//       })
//     );
//     mirrorArray.splice(-1,1);
//     mirrorArray.reverse();
//     array = [...array, ...mirrorArray];
    
//     const circleRadius = radius * 1.05;    
//     p.push();
//     p.circle(x, y, circleRadius, circleRadius);
//     p.translate(x, y);
//     p.rotate(rotation);
//     p.push();
//     for (let i = 0; i < numPoints; i++) {            
//       //fill('red');
//       p.rotate(angle * i);
//       p.push();
//       p.beginShape();      
            
//       for (let i = 0; i < array.length; i++){
//         p.vertex(array[i].x, array[i].y);
//       }

      
      
//       p.endShape(CLOSE);
//       p.pop();      
//     }
//     p.pop();
//     p.pop();
    
//   }

//   let sunRotation = 0;
  
//   this.update = function() {       


//     p.noStroke();
    
//     const distance = p.abs(p.dist(this.word.x, this.word.y, mouseX, mouseY));
//     const percentage = p.map(distance, 0, this.translationDistance, 1, 0, true);
//     const percentageX = p.map(p.dist(this.word.x, 0, mouseX, 0), 0, this.translationDistance, 1, 0, true);
//     const percentageY = p.map(p.dist(0, this.word.y, 0, mouseY), 0, this.translationDistance, 1, 0, true);
    
//     distortion.process(sound, p.lerp(0.01, 0, percentageY), 'none');
//     panner.process(distortion);
//     panner.set(p.dist(this.word.x, 0, mouseX, 0), p.dist(this.word.y, 0, mouseY, 0));
  
//     this.bgColor = p.lerpColor(this.bgColor, this.bgColorTarget, .1);
//     p.background(this.bgColor);

//     p.textAlign(LEFT, TOP);
//     p.textFont(myFont);
//     p.textWrap(WORD);
//     const textPadding = 30;
//     sunRotation += p.lerp(0.008, 0.003, percentage);
//     p.push();
//     p.translate(0, 20);
//     for (let i = 0; i < this.allSentences.length; i++){
      
//       p.fill(p.lerpColor(p.color('yellow'), p.color('black'), distance/this.translationDistance));
//       const sunSize = 30;
//       this.sun(15, 30 + (10 + sunSize) * i, height - sunSize -  20, 0);
//     }
//     p.pop();
//     if (this.state !== 'done') {
//       // cursor

//       if (hasMouseMoved){
//         p.fill(p.lerpColor(p.color('yellow'), p.color('black'), distance/this.translationDistance));
//         this.sun(this.progressionDistance, mouseX, mouseY, sunRotation);
//       }    
    

    
//       // target
//       p.cursor(ARROW);
//       p.fill(this.bgColor);        
//       this.sun(this.progressionDistance + 3, this.word.x, this.word.y, sunRotation)
//       p.fill(p.lerpColor(p.color('black'), p.color('white'), percentage));
//       p.textSize(80);
//       p.textLeading(70);
          
//       p.text(this.sentence.join(' '), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
//     }else{
//       p.textSize(40);
//       p.textLeading(35);
      
//       p.text(this.sentence.join('\r\n'), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
//     }
    
    
    


    
     
//     if (this.state !== 'done') {
      

      
//       this.state = null;
//       if (distance <= this.progressionDistance/2 && this.state !== 'progressing') {                

//         p.cursor(CROSS);    
//         this.state = 'ready';
//         if (mouseIsPressed || distance < 10) {
//           this.state = 'progressing';
//           this.sentence.push(this.word.text.value);       
//           p.background(this.bgColor);
//           wordIndex++;
                    
//           if (wordIndex >= sentences[sentenceIndex].words.length) {
//             wordIndex = 0;
//             sentenceIndex++;
//             this.allSentences.push(this.sentence.join(' '));
//             this.sentence = [];
//             if (sentenceIndex >= sentences.length) {
//               sentenceIndex = 0;
//               //alert('done');
//               this.sentence = this.allSentences;
//               p.background(this.bgColor);
//               this.state = 'done';
//             }
//           }
//           if (this.state !== 'done') this.setup();
//         }        
//       }
      


//       p.translate(width/2, height/2);
      

            
//       p.noStroke();          

//       // text + translation
//       // const textColor = lerpColor(color('black'), color('white'), percentage);
//       // fill(textColor);
      
//       this.easingTimer++;

//       if (this.easingTimer > 4) {
//         this.easingTimer = 0;
//         this.calcTargets(percentage);          
//       }
      

//       this.moveParticles();
//     }
    
//   }
// }
// }

// let p5instance = new p5(sketch);


// //alert('test');
