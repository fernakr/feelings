
let morpher;

let myFont;

let sentences = [
  {
    words: [
      {
        text: 'Here',        
        translation: 'Narito'
      },
      {
        text: 'is the',        
        translation: 'ang'
      },
      {
        text: 'story',        
        translation: 'kwento'
      },
      {
        text: 'of',        
        translation: 'kung'
      },
      {
        text: 'how',        
        translation: 'paano'
      },
      {
        text: 'I',        
        translation: 'ako'
      },
      {
        text: 'came',        
        translation: 'nakarating'
      },
      {
        text: 'to',        
        translation: 'sa'
      },
      {
        text: 'America',        
        translation: 'Amerika'
      }
    ]
  }
]

const padding = 20;

let sentenceIndex = 0;
let wordIndex = 0;

let hasMouseMoved = false;

function preload() {
  // myFont = loadFont('./dist/paraaminobenzoic.ttf');
  myFont = loadFont('./dist/Retroica.ttf');
  // myFont = loadFont("./dist/Hyperspace.ttf");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight - 200);
  canvas.parent('content');
  morpher = new morphMaker();
  morpher.setup();
  morpher.calcTargets(0);  
  morpher.bgColorTarget = morpher.bgColor = lerpColor(color(0, 255), color(0,0,200), 0);
 // strokeCap(SQUARE);
  background(0, 255);
  sentences.forEach(sentence => {
    sentence.words.forEach(word => {
      word.x = random(padding, width - padding);
      word.y = random(padding, height - padding);
    })
  })
  
  
}

function mouseMoved(){
  hasMouseMoved = true;
}

function draw() {
  
  morpher.update();
}

function morphMaker() {

  this.sentence = [];
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

//    console.log(this.word.translation.bounds);


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
    this.bgColorTarget = lerpColor(color(0, 255), color(0,0,200), percentage); 
  }

  this.moveParticles = function(){
    if (this.targets.length !== this.particles.length) return;
    for (let i = 0; i < this.particles.length; i++){        
      
      const xOffset = 0.5 * sin(frameCount * .01 + 2 * noise(this.targets[i].x, this.targets[i].y));
      const yOffset =  0.5 * cos(frameCount * .01 + 2 * noise(this.targets[i].x, this.targets[i].y))

      this.particles[i].x = lerp(this.particles[i].x + xOffset, this.targets[i].x + xOffset, .05);
      this.particles[i].y = lerp(this.particles[i].y + yOffset, this.targets[i].y + yOffset, .05);
      
      for (let j = -1; j <= 1; j+=2){
        for (let k = -1; k <= 1; k+=2){

          circle(this.particles[i].x + k, this.particles[i].y + j, 1, 1);
        }
      }      
    }    
  }

  
  this.update = function() {       
    

    
    
    const distance = abs(dist(this.word.x, this.word.y, mouseX, mouseY));
    const percentage = map(distance, 0, this.translationDistance, 1, 0, true);
    this.bgColor = lerpColor(this.bgColor, this.bgColorTarget, .1);
    background(this.bgColor);
    fill(255);
    stroke(255);
    textSize(100);
    textAlign(LEFT, TOP);
    const textPadding = 30;
    textWrap(WORD);
    //textWidth(width - textPadding * 2);
    text(this.sentence.join(' '), textPadding, textPadding, width - textPadding * 2, height - textPadding * 2);


    noStroke();
     
    if (this.state !== 'done') {
      

      // cursor

      if (hasMouseMoved){
        fill(255);
        circle(mouseX, mouseY, this.progressionDistance);
      }    
      // target

      cursor(ARROW);
      fill(this.bgColor);    

      
      circle(this.word.x, this.word.y, this.progressionDistance + 1);
      this.state = null;
      if (distance <= this.progressionDistance/2 && this.state !== 'progressing') {                

        cursor(CROSS);    
        this.state = 'ready';
        if (mouseIsPressed) {
          this.state = 'progressing';
          this.sentence.push(this.word.text.value); 
          //console.log(this.sentence);
          background(this.bgColor);
          wordIndex++;
          
          this.state = null
          if (wordIndex >= sentences[sentenceIndex].words.length) {
            wordIndex = 0;
            sentenceIndex++;
            if (sentenceIndex >= sentences.length) {
              sentenceIndex = 0;
              alert('done');
              this.state = 'done';
            }
          }
          if (this.state !== 'done') this.setup();
        }else{
          circle(this.word.x, this.word.y, this.progressionDistance);
        }        
      }
      


      translate(width/2, height/2);
      

            
      noStroke();
      
      
      
      fill(255 * percentage,255,255 );
      if (this.state === 'ready') {
        fill('yellow');
      }
      
      this.easingTimer++;

      if (this.easingTimer > 10) {
        this.easingTimer = 0;
        this.calcTargets(percentage);          
      }
      

      this.moveParticles();
    }
    
  }
}
