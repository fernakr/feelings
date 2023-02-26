/// Text Morpher
/// Version 9
/// Tutorial Version
/// by Ed Cavett
/// November 2021

/// Using two lines of text,
/// move the points from one
/// line to describe the other
/// using interpolated collation.
/// Include methods for displaying the
/// current date and time.


let morpher;

let myFont;

let sentences = [
  {
    words: [
      {
        text: 'Here',
        x: 400,
        y: 400,
        translation: 'Dito'
      }
    ]
  }
]

let sentenceIndex = 0;
let wordIndex = 0;

function preload() {
  // myFont = loadFont('./dist/paraaminobenzoic.ttf');
  myFont = loadFont('./dist/Retroica.ttf');
  // myFont = loadFont("./dist/Hyperspace.ttf");
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('content');
  morpher = new morphMaker();
  strokeCap(SQUARE);
  background(0, 255);
}

function draw() {
  background(0, 255);
  morpher.update();
}

function morphMaker() {
  this.word = sentences[sentenceIndex].words[wordIndex];
  this.word.animated = false;
  this.size = 8;
  
  this.close = 0.5;
  this.translationDistance = 300;
  this.percentage = 0;
  
  this.offset = random(1000);
  
  this.particles = [];
  
  this.translating = false;
  let dartSize = 550;

  
  /// Setup the moving points, increase their scale,
  /// and set to center.
  let centerX = 0;
  let centerWidth = width / 2;
  for (let i = 0; i < dartSize; i++) {
    this.particles.push(createVector(this.size,this.size));
    this.particles[i].x += centerWidth;
    this.particles[i].y += height / 2;
  }

  this.current = [...this.particles];
  /// Setup the target points, increase their scale,
  /// and center-justify locations.

  this.target = myFont.textToPoints(this.word.translation, 0, 0, 10, {
    sampleFactor: 2,
    simplifyThreshold: 0.0,
  });
  
  /// Scale up the target points.
  /// Find the width of the target output.
  centerX = 0;
  for (let i = 0; i < this.target.length; i++) {
    this.target[i].x *= this.size;
    this.target[i].y *= this.size;
    if (centerX < this.target[i].x) {
      centerX = this.target[i].x;
    }
  }
  /// Center-justify the target output.
  centerWidth = width / 2 - centerX / 2;
  for (let i = 0; i < this.target.length; i++) {
    this.target[i].x += centerWidth;
    this.target[i].y += height / 2;
  }

  
  /// Animate the morphing object.
  /// Switch text and cycle through messages.
  /// Repeat processes.
  this.update = function () {
    this.offset += 0.05;

    const distance = abs(dist(mouseX, mouseY, this.word.x, this.word.y));
        
    
    // console.log(distance)
    if (distance < this.translationDistance){      
      //console.log('translating')
      this.percentage = 1 - distance/ this.translationDistance; 
      
      this.translating = true;
    }else{
      if (this.word.animated === false ){
        this.percentage += .15;
      }
    }
    for (let i = 0; i < this.particles.length; i++) {
      let findi = floor(
        map(i, 0, this.particles.length - 1, 0, this.target.length - 1)
      );

      if (i > 0) {
        let dlen = dist(
          this.particles[i].x,
          this.particles[i].y,
          this.particles[i - 1].x,
          this.particles[i - 1].y
        );
        if (dlen < this.size * 1.5) {
          let colr = map(
            noise((i + 500) * 0.01, frameCount * 0.05),
            0,
            1,
            -50,
            305
          );
          stroke(colr, 0, 255, 255);
          strokeWeight(2);
          if (noise(i * 0.02, this.offset) < 0.5) {
            stroke(0, colr, 255, 255);
            strokeWeight(5);
          }

          line(
            this.particles[i].x,
            this.particles[i].y,
            this.particles[i - 1].x,
            this.particles[i - 1].y
          );
        }
      }
      

      if (this.word.animated === false || this.translating === true) {
     

        console.log(this.percentage);
        this.particles[i].x = lerp(
          this.current[i].x,
          this.target[findi].x,
          this.percentage
        );
        this.particles[i].y = lerp(
          this.current[i].y,
          this.target[findi].y,
          this.percentage
        );
        let dlen = dist(
          this.current[i].x,
          this.current[i].y,
          this.target[findi].x,
          this.target[findi].y
        );
        if (i === this.particles.length - 1) {
          
          if (dlen < this.close) {
            if (this.word.animated === false){              
              this.percentage = 0;
              this.word.animated = true;
              this.translate();
            }
            
          }
        }
      }
      

      if (noise((i + 200) * 0.05, this.offset) < 0.5) {
        if (random() < 0.001) {
          let sparkz = random(1, 2);
          for (n = 0; n < 10; n++) {
            push();
            translate(this.particles[i].x, this.particles[i].y);
            let Lrnd = random(-this.size * sparkz, 0);
            let Rrnd = random(0, this.size * sparkz);
            let rotrnd = random(-PI, PI);
            rotate(rotrnd);
            stroke(255, 255);
            strokeWeight(1);
            line(Lrnd, 0, Rrnd, 0);
            pop();
          }
        }
      }
    }
  };

  /// Switch text lines in the message list.
  /// Test for date, time display message.
  /// Get date/time, if needed.
  /// Setup target points with new text.
  /// Return to update method with new target locations.
  this.translate = function () {
  
    let m = this.word.text;
    
    this.target = myFont.textToPoints(m, 0, 0, 10, {
      sampleFactor: 2,
      simplifyThreshold: 0.0,
    });
    
    let centerX = 0;
    let centerY = 0;
    for (let i = 0; i < this.target.length; i++) {
      this.target[i].x *= this.size;
      this.target[i].y *= this.size;
      if (centerX < this.target[i].x) {
        centerX = this.target[i].x;
      }
      if (centerY > this.target[i].y) {
        centerY = this.target[i].y;
      }
    }

    let centerWidth = width / 2 - centerX / 2; //random(0,width-centertext);
    let centerHeight = random(centerY * -2, height + centerY);
    for (let i = 0; i < this.target.length; i++) {
      this.target[i].x += centerWidth;
      this.target[i].y += height / 2; //centerHeight;
    }
  };
}

// /// Provide a way to view the output in full screen
// /// mode.  Click the canvas to switch modes.
// function mousePressed() {
//   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//     let fs = fullscreen();
//     fullscreen(!fs);
//   }
// }
