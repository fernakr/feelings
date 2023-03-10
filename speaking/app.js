

let string = `Convert the following sentences into a json array of sentences. Each sentence has a words array where each item in the array is an object with a text property that's set to the word and a translation property that's set to the translation in tagalog but make sure to keep the commas and periods in the sentence with the word right before it: 
- I was a muse three times in my life
- Your grandpa was tall, dark, handsome, and once upon a time a millionaire
- I was born in the third house from the municipal building in front of the church
- Your grandpa was asked by President Ramos to lead the charge to get rid of corruption in Philippines and said no
- Your grandpa and I were never were boyfriend/girlfriend when we got married
`

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

function preload() {
  sound = loadSound('whoosh.mp3');
  // decrease volume by 50%
  sound.setVolume(0.2);

  // myFont = loadFont('./dist/paraaminobenzoic.ttf');
  myFont = loadFont('./dist/Retroica.ttf');
  // myFont = loadFont("./dist/Hyperspace.ttf");
}


let started = false;

let defaultColor, targetColor;

function setup() {
  reverb = new p5.Reverb();
  distortion = new p5.Distortion()
  panner = new p5.Panner3D();
  sound.disconnect();
  
  reverb.process(sound, 3, 2);
  defaultColor = color(242, 226, 208);
  targetColor = color(0, 20, 80);
  const canvas = createCanvas(900, 600);
  canvas.parent('content');
  morpher = new morphMaker();
  morpher.setup();
  morpher.calcTargets(0);  
  morpher.bgColorTarget = morpher.bgColor = lerpColor(defaultColor, targetColor, 0); 
  background(0, 255);

  sentences.forEach(sentence => {
    sentence.words.forEach(word => {
      word.x = random(padding, width - padding);
      word.y = random(padding, height - padding);
    })
  })
  const button = document.querySelector('button');
  button.addEventListener('click', function(e){
    
    let buttonText;
    soundOn = !soundOn;
    if (soundOn) {
      sound.play();                        

      buttonText = 'Sound Off';
    } else {
      sound.stop();
      buttonText = 'Sound On';
    }
    e.target.innerHTML = buttonText;

  }
  );

  
}

function mouseMoved(){
  hasMouseMoved = true;
}

function mousePressed(){
  started  = true;
  sound.loop();
 
}

function draw() {  
  
  if (!started){
    background(defaultColor);
    fill(targetColor);
    textFont(myFont);
    textSize(32);
    const padding = 20;
    translate(padding, height/5);
    textAlign(CENTER, TOP);
    text('This is my attempt to capture the frustration I can feel trying to understand tagalog. Some phrases are easier to find than others. Either way the struggle to understand can prevent me from fully grasping the story being told. Chronicled here are words from my lola.\r\n\r\nMove the cursor until you find the translation.\r\n\r\nClick to start', 0, 0, width - 2 * padding);
    //return;
  }else{    
    
    
    morpher.update();
    
    reverb.drywet(1);
  }
  
}

function morphMaker() {

  this.fadeDuration = 100;
  this.fadeTimer = 0;
  this.sentence = [];
  this.allSentences = [];
  this.state = null;
  //this.stateTimer = 0;
  this.easingTimer = 0;
  
  this.setup = function() {        
    
    this.particles = [];
    this.word = sentences[sentenceIndex].words[wordIndex];
    this.translationDistance = 300;
    this.progressionDistance = 40;
    

    const options = {
      sampleFactor: 1,
      simplifyThreshold: 0.0,
    }

    const translationValue = this.word.translation.toUpperCase();
    this.word.translation = {
      value: this.word.translation,
      points: myFont.textToPoints(translationValue, 0, 0, 100, options),
      bounds: myFont.textBounds(translationValue, 0, 0, 100)
    }

    const textValue = this.word.text.toUpperCase();

    this.word.text = {
      value: this.word.text,
      points: myFont.textToPoints(textValue, 0, 0, 100, options),
      bounds: myFont.textBounds(textValue, 0, 0, 100)
    }

    this.word.translation.points.forEach((point, index) => {
      this.particles[index] = createVector(point.x, point.y);
    });
  }

  this.calcTargets = function(percentage){
    this.targets = [];
    for (let i = 0; i < this.particles.length; i++){     
      this.targets[i] = {};   
      let findi = floor(
        map(i, 0, this.particles.length - 1, 0, this.word.text.points.length - 1)
      );          
      
      this.targets[i].x = lerp(this.word.translation.points[i].x - this.word.translation.bounds.w/2, this.word.text.points[findi].x  - this.word.text.bounds.w/2, percentage);
      this.targets[i].y = lerp(this.word.translation.points[i].y - this.word.translation.bounds.h/2, this.word.text.points[findi].y - this.word.text.bounds.h/2, percentage);
      
    } 
    this.bgColorTarget = lerpColor(defaultColor, targetColor, percentage); 
  }

  this.moveParticles = function(){
    if (this.targets.length !== this.particles.length) return;
    for (let i = 0; i < this.particles.length; i++){        
      
      const xOffset = 0.75 * sin(frameCount * .01 + 2 * noise(this.targets[i].x, this.targets[i].y));
      const yOffset =  0.75 * cos(frameCount * .01 + 2 * noise(this.targets[i].x, this.targets[i].y))

      const lerpFactor = map(i, 0, this.particles.length - 1, .05, .25, true);

      this.particles[i].x = lerp(this.particles[i].x + xOffset, this.targets[i].x + xOffset, lerpFactor);
      this.particles[i].y = lerp(this.particles[i].y + yOffset, this.targets[i].y + yOffset, lerpFactor * 3);
      
      for (let j = -1; j <= 1; j+=2){
        for (let k = -1; k <= 1; k+=2){

          circle(this.particles[i].x + k, this.particles[i].y + j, 1, 1);
        }
      }      
    }    
  }

  this.sun = function(radius, x, y, rotation) {    
    let numPoints = 8;
    let angle = TWO_PI / numPoints;
   
    let array = [
      {x: radius / 10, y: 0},
      {x: radius / 4.5, y: radius - radius/6},
      {x: radius / 6.5, y: radius - radius/15},
      {x: radius / 23, y: 0},
      {x: radius / 25, y: 0},
      {x: radius / 10, y: radius - radius/30},
      {x: 0, y: radius + radius / 12},
    ]

    let mirrorArray = [...array];    
    mirrorArray = mirrorArray.map(point => Object.assign({}, point, {
       x: -point.x
      })
    );
    mirrorArray.splice(-1,1);
    mirrorArray.reverse();
    array = [...array, ...mirrorArray];
    
    const circleRadius = radius * 1.05;    
    push();
    circle(x, y, circleRadius, circleRadius);
    translate(x, y);
    rotate(rotation);
    push();
    for (let i = 0; i < numPoints; i++) {            
      //fill('red');
      rotate(angle * i);
      push();
      beginShape();      
            
      for (let i = 0; i < array.length; i++){
        vertex(array[i].x, array[i].y);
      }

      
      
      endShape(CLOSE);
      pop();      
    }
    pop();
    pop();
    
  }

  let sunRotation = 0;
  
  this.update = function() {       


    noStroke();
    
    const distance = abs(dist(this.word.x, this.word.y, mouseX, mouseY));
    const percentage = map(distance, 0, this.translationDistance, 1, 0, true);
    const percentageX = map(dist(this.word.x, 0, mouseX, 0), 0, this.translationDistance, 1, 0, true);
    const percentageY = map(dist(0, this.word.y, 0, mouseY), 0, this.translationDistance, 1, 0, true);
    
    distortion.process(sound, lerp(0.01, 0, percentageY), 'none');
    panner.process(distortion);
    panner.set(dist(this.word.x, 0, mouseX, 0), dist(this.word.y, 0, mouseY, 0));
    this.bgColor = lerpColor(this.bgColor, this.bgColorTarget, .1);
    if (this.state === 'progressing'){
      background(color(this.bgColor), 0);
      //this.stateTimer/this.stateDuration
    }else{
      
      background(this.bgColor);
    }
   

    textAlign(LEFT, TOP);
    textFont(myFont);
    textWrap(WORD);
    const textPadding = 30;
    sunRotation += lerp(0.008, 0.003, percentage);
    push();
    translate(0, 20);
    for (let i = 0; i < this.allSentences.length; i++){
      
      fill(lerpColor(color('yellow'), color('black'), distance/this.translationDistance));
      const sunSize = 30;
      this.sun(15, 30 + (10 + sunSize) * i, height - sunSize -  20, 0);
    }
    pop();
    if (this.state !== 'done') {
      // cursor

      if (hasMouseMoved){
        fill(lerpColor(color('yellow'), color('black'), distance/this.translationDistance));
        this.sun(this.progressionDistance, mouseX, mouseY, sunRotation);
      }    
    

    
      // target
      cursor(ARROW);
      fill(this.bgColor);        
      if (this.state !== 'progressing'){
        this.sun(this.progressionDistance + 3, this.word.x, this.word.y, sunRotation)
        fill(lerpColor(color('black'), color('white'), percentage));
      }else{
        fill(lerpColor(color('black'), color('white'), this.stateTimer/this.stateDuration));
      }
      textSize(80);
      textLeading(70);
          
      text(this.sentence.join(' '), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
    }else{
      textSize(40);
      textLeading(35);
      
      text(this.sentence.join('\r\n'), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
    }
    
    
    if (this.stateDuration && this.stateTimer < this.stateDuration) {
      this.stateTimer++;
      
    }


    if (this.stateTimer === this.stateDuration) {
      this.stateDuration = null;
      this.stateTimer = 0;
      if (this.state === 'progressing') {


        this.state = null;
        wordIndex++;
                  
        if (wordIndex >= sentences[sentenceIndex].words.length) {
          this.state = null;
          wordIndex = 0;
          sentenceIndex++;
          this.allSentences.push(this.sentence.join(' '));
          this.sentence = [];
          if (sentenceIndex >= sentences.length) {
            sentenceIndex = 0;            
            this.sentence = this.allSentences;            
            this.state = 'done';
          }
        }
        if (this.state !== 'done') this.setup();
      }
    }
    
    
     
    if (this.state !== 'done' && this.state !== 'progressing') {
                
      if (distance <= this.progressionDistance/2 && this.state !== 'progressing') {                

        cursor(CROSS);    
        
        if (mouseIsPressed || distance < 10) {
          this.state = 'progressing';
          this.sentence.push(this.word.text.value);       

          this.stateDuration = 100;
          this.stateTimer = 0;
          
        }        
      }


 



      translate(width/2, height/2);
      

            
      noStroke();          

      // text + translation
      // const textColor = lerpColor(color('black'), color('white'), percentage);
      // fill(textColor);
      
      this.easingTimer++;

      if (this.easingTimer > 4) {
        this.easingTimer = 0;
        this.calcTargets(percentage);          
      }
      

      this.moveParticles();
    }
    
  }
}

