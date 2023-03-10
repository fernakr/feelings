
let morpher;

let myFont;

let string = `Convert the following sentences into a json array of sentences. Each sentence has a words array where each item in the array is an object with a text property that's set to the word and a translation property that's set to the translation in tagalog but make sure to keep the commas and periods in the sentence with the word right before it: 
- I was a muse three times in my life
- Your grandpa was tall, dark, handsome, and once upon a time a millionaire
- I was born in the third house from the municipal building in front of the church
- Your grandpa was asked by President Ramos to lead the charge to get rid of corruption in Philippines and said no
- Your grandpa and I were never were boyfriend/girlfriend when we got married
`

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
let graphics;

function preload() {
  createVRCanvas();
  sound = loadSound('whoosh.mp3');
  // decrease volume by 50%
  sound.setVolume(0.2);

  // myFont = loadFont('./dist/paraaminobenzoic.ttf');
  myFont =  loadFont('./fonts/linarc.ttf', () => {
    
    morpher = new morphMaker();
    morpher.setup();
    morpher.calcTargets(0);  
    morpher.bgColorTarget = morpher.bgColor = graphics.lerpColor(defaultColor, targetColor, 0); 
    graphics.background(0, 255);
    sentences.forEach(sentence => {
      sentence.words.forEach(word => {
        word.x = graphics.random(padding, width - padding);
        word.y = graphics.random(padding, height - padding);
      })
    })
  }, () => {
    //console.log('error')
    });
  //console.log(myFont);
  
  // myFont = loadFont("./dist/Hyperspace.ttf");
}


let started = false;

let defaultColor, targetColor;

function setup() {
  graphics = createGraphics(800,800);

  reverb = new p5.Reverb();
  distortion = new p5.Distortion()
  panner = new p5.Panner3D();
  sound.disconnect();
  
  reverb.process(sound, 3, 2);
  defaultColor = graphics.color(242, 226, 208);
  targetColor = graphics.color(0, 20, 80);
  
  
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
    graphics.background(defaultColor);
    graphics.fill(targetColor);
    //graphics.textFont(myFont);
    graphics.textFont(32);
    const padding = 20;
    graphics.translate(padding, height/5);
    graphics.textFont(CENTER, TOP);
    graphics.textFont('This is my attempt to capture the frustration I can feel trying to understand tagalog. Some phrases are easier to find than others. Either way the struggle to understand can prevent me from fully grasping the story being told. Chronicled here are words from my lola.\r\n\r\nMove the cursor until you find the translation.\r\n\r\nClick to start', 0, 0, width - 2 * padding);
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
  this.stateTimer = 0;
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
      let findi = graphics.floor(
        graphics.map(i, 0, this.particles.length - 1, 0, this.word.text.points.length - 1)
      );          
      
      this.targets[i].x = graphics.lerp(this.word.translation.points[i].x - this.word.translation.bounds.w/2, this.word.text.points[findi].x  - this.word.text.bounds.w/2, percentage);
      this.targets[i].y = graphics.lerp(this.word.translation.points[i].y - this.word.translation.bounds.h/2, this.word.text.points[findi].y - this.word.text.bounds.h/2, percentage);
      
    } 
    this.bgColorTarget = graphics.lerpColor(defaultColor, targetColor, percentage); 
  }

  this.moveParticles = function(){
    if (this.targets.length !== this.particles.length) return;
    for (let i = 0; i < this.particles.length; i++){        
      
      const xOffset = 0.75 * graphics.sin(frameCount * .01 + 2 * graphics.noise(this.targets[i].x, this.targets[i].y));
      const yOffset =  0.75 * graphics.cos(frameCount * .01 + 2 * graphics.noise(this.targets[i].x, this.targets[i].y))

      const lerpFactor = graphics.map(i, 0, this.particles.length - 1, .05, .25, true);

      this.particles[i].x = graphics.lerp(this.particles[i].x + xOffset, this.targets[i].x + xOffset, lerpFactor);
      this.particles[i].y = graphics.lerp(this.particles[i].y + yOffset, this.targets[i].y + yOffset, lerpFactor * 3);
      
      for (let j = -1; j <= 1; j+=2){
        for (let k = -1; k <= 1; k+=2){

          graphics.push();
          graphics.translate(this.particles[i].x + k, this.particles[i].y + j);
          graphics.circle(this.particles[i].x + k, this.particles[i].y + j, 1, 1);

          graphics.pop();
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
    graphics.push();
    graphics.circle(x, y, circleRadius, circleRadius);
    graphics.translate(x, y);
    graphics.rotate(rotation);
    graphics.push();
    for (let i = 0; i < numPoints; i++) {            
      //graphics.fill('red');
      graphics.rotate(angle * i);
      graphics.push();
      graphics.beginShape();      
            
      for (let i = 0; i < array.length; i++){
        vertex(array[i].x, array[i].y);
      }

      
      
      graphics.endShape(CLOSE);
      graphics.pop();      
    }
    graphics.pop();
    graphics.pop();
    
  }

  let sunRotation = 0;
  
  this.update = function() {       


    noStroke();
    
    const distance = abs(dist(this.word.x, this.word.y, mouseX, mouseY));
    const percentage = graphics.map(distance, 0, this.translationDistance, 1, 0, true);
    const percentageX = graphics.map(dist(this.word.x, 0, mouseX, 0), 0, this.translationDistance, 1, 0, true);
    const percentageY = graphics.map(dist(0, this.word.y, 0, mouseY), 0, this.translationDistance, 1, 0, true);
    
    distortion.process(sound, graphics.lerp(0.01, 0, percentageY), 'none');
    panner.process(distortion);
    panner.set(dist(this.word.x, 0, mouseX, 0), dist(this.word.y, 0, mouseY, 0));
  
    this.bgColor = graphics.lerpColor(this.bgColor, this.bgColorTarget, .1);
    graphics.background(this.bgColor);

    graphics.textFont(LEFT, TOP);
    //graphics.textFont(myFont);
    graphics.textWrap(WORD);
    const textPadding = 30;
    sunRotation += graphics.lerp(0.008, 0.003, percentage);
    graphics.push();
    graphics.translate(0, 20);
    for (let i = 0; i < this.allSentences.length; i++){
      
      graphics.fill(graphics.lerpColor(graphics.color('yellow'), graphics.color('black'), distance/this.translationDistance));
      const sunSize = 30;
      this.sun(15, 30 + (10 + sunSize) * i, height - sunSize -  20, 0);
    }
    graphics.pop();
    if (this.state !== 'done') {
      // cursor

      if (hasMouseMoved){
        graphics.fill(graphics.lerpColor(graphics.color('yellow'), graphics.color('black'), distance/this.translationDistance));
        this.sun(this.progressionDistance, mouseX, mouseY, sunRotation);
      }    
    

    
      // target
      //graphics.cursor(ARROW);
      graphics.fill(this.bgColor);        
      this.sun(this.progressionDistance + 3, this.word.x, this.word.y, sunRotation)
      graphics.fill(graphics.lerpColor(graphics.color('black'), graphics.color('white'), percentage));
      graphics.textFont(80);
      graphics.textLeading(70);
          
      graphics.text(this.sentence.join(' '), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
    }else{
      graphics.textFont(40);
      graphics.textLeading(35);
      
      graphics.text(this.sentence.join('\r\n'), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);
    }
    
    
    


    
     
    if (this.state !== 'done') {
      

      
      this.state = null;
      if (distance <= this.progressionDistance/2 && this.state !== 'progressing') {                

        graphics.cursor(CROSS);    
        this.state = 'ready';
        if (mouseIsPressed || distance < 10) {
          this.state = 'progressing';
          this.sentence.graphics.push(this.word.text.value);       
          graphics.background(this.bgColor);
          wordIndex++;
                    
          if (wordIndex >= sentences[sentenceIndex].words.length) {
            wordIndex = 0;
            sentenceIndex++;
            this.allSentences.graphics.push(this.sentence.join(' '));
            this.sentence = [];
            if (sentenceIndex >= sentences.length) {
              sentenceIndex = 0;
              //alert('done');
              this.sentence = this.allSentences;
              graphics.background(this.bgColor);
              this.state = 'done';
            }
          }
          if (this.state !== 'done') this.setup();
        }        
      }
      


      graphics.translate(width/2, height/2);
      

            
      graphics.noStroke();          

      // text + translation
      // const textColor = graphics.lerpColor(graphics.color('black'), graphics.color('white'), percentage);
      // graphics.fill(textColor);
      
      this.easingTimer++;

      if (this.easingTimer > 4) {
        this.easingTimer = 0;
        this.calcTargets(percentage);          
      }
      

      this.moveParticles();
    }
    
  }
}

