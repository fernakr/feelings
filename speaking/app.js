
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

    console.log(this.word.translation.bounds);


    this.word.translation.points.forEach((point, index) => {
      this.particles[index] = createVector(point.x, point.y);
    });
  }

  
  this.update = function() {       
    

    
    this.state = null;
    const distance = abs(dist(this.word.x, this.word.y, mouseX, mouseY));
    const percentage = map(distance, 0, this.translationDistance, 1, 0, true);
    const bgColor = lerpColor(color(0, 255), color(0,0,200), percentage);
    background(bgColor);
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
      fill(bgColor);    

      
      if (distance <= this.progressionDistance/2 && this.state !== 'progressing') {
        fill('red');
        cursor(CROSS);    
        this.state = 'ready';
        if (mouseIsPressed) {
          this.state = 'progressing';
          this.sentence.push(this.word.text.value); 
          //console.log(this.sentence);
          wordIndex++;
          
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
        }
      }
      circle(this.word.x, this.word.y, this.progressionDistance/2);


      translate(width/2, height/2);
      

            
      noStroke();
      
      
      
      fill(255 * percentage,255,255 );
      for (let i = 0; i < this.particles.length; i++){        
        let findi = floor(
          map(i, 0, this.particles.length - 1, 0, this.word.text.points.length - 1)
        );          
        
        this.particles[i].x = lerp(this.word.translation.points[i].x - this.word.translation.bounds.w/2, this.word.text.points[findi].x  - this.word.text.bounds.w/2, percentage);
        this.particles[i].y = lerp(this.word.translation.points[i].y - this.word.translation.bounds.h/2, this.word.text.points[findi].y - this.word.text.bounds.h/2, percentage);
        for (let j = -2; j <= 2; j+=4){
          for (let k = -2; k <= 2; k+=4){
            rect(this.particles[i].x + k, this.particles[i].y + j, 1, 1);
          }
        }      
      }    
    }
    
  }
}
// function morphMaker() {
//   this.word = sentences[sentenceIndex].words[wordIndex];
//   this.word.animated = false;
//   this.size = 8;
  
//   this.close = 0.5;
//   this.translationDistance = 300;
//   this.percentage = 0;
  
//   this.offset = random(1000);
  
//   this.particles = [];
  
//   this.translating = false;
//   let dartSize = 550;

  
//   /// Setup the moving points, increase their scale,
//   /// and set to center.
//   let centerX = 0;
//   let centerWidth = width / 2;
//   for (let i = 0; i < dartSize; i++) {
//     this.particles.push(createVector(this.size,this.size));
//     this.particles[i].x += centerWidth;
//     this.particles[i].y += height / 2;
//   }

//   this.current = [...this.particles];
//   /// Setup the target points, increase their scale,
//   /// and center-justify locations.

//   this.target = myFont.textToPoints(this.word.translation, 0, 0, 10, {
//     sampleFactor: 2,
//     simplifyThreshold: 0.0,
//   });
  
//   /// Scale up the target points.
//   /// Find the width of the target output.
//   centerX = 0;
//   for (let i = 0; i < this.target.length; i++) {
//     this.target[i].x *= this.size;
//     this.target[i].y *= this.size;
//     if (centerX < this.target[i].x) {
//       centerX = this.target[i].x;
//     }
//   }
//   /// Center-justify the target output.
//   centerWidth = width / 2 - centerX / 2;
//   for (let i = 0; i < this.target.length; i++) {
//     this.target[i].x += centerWidth;
//     this.target[i].y += height / 2;
//   }

  
//   /// Animate the morphing object.
//   /// Switch text and cycle through messages.
//   /// Repeat processes.
//   this.update = function () {
//     this.offset += 0.05;

//     const distance = abs(dist(mouseX, mouseY, this.word.x, this.word.y));
        
    
//     // console.log(distance)
//     if (distance < this.translationDistance){      
//       //console.log('translating')
//       this.percentage = 1 - distance/ this.translationDistance; 
      
//       this.translating = true;
//     }else{
//       if (this.word.animated === false ){
//         this.percentage += .15;
//       }
//     }
//     for (let i = 0; i < this.particles.length; i++) {
//       let findi = floor(
//         map(i, 0, this.particles.length - 1, 0, this.target.length - 1)
//       );

//       if (i > 0) {
//         let dlen = dist(
//           this.particles[i].x,
//           this.particles[i].y,
//           this.particles[i - 1].x,
//           this.particles[i - 1].y
//         );
//         if (dlen < this.size * 1.5) {
//           let colr = map(
//             noise((i + 500) * 0.01, frameCount * 0.05),
//             0,
//             1,
//             -50,
//             305
//           );
//           stroke(colr, 0, 255, 255);
//           strokeWeight(2);
//           if (noise(i * 0.02, this.offset) < 0.5) {
//             stroke(0, colr, 255, 255);
//             strokeWeight(5);
//           }

//           line(
//             this.particles[i].x,
//             this.particles[i].y,
//             this.particles[i - 1].x,
//             this.particles[i - 1].y
//           );
//         }
//       }
      

//       if (this.word.animated === false || this.translating === true) {
     

//         console.log(this.percentage);
//         this.particles[i].x = lerp(
//           this.current[i].x,
//           this.target[findi].x,
//           this.percentage
//         );
//         this.particles[i].y = lerp(
//           this.current[i].y,
//           this.target[findi].y,
//           this.percentage
//         );
//         let dlen = dist(
//           this.current[i].x,
//           this.current[i].y,
//           this.target[findi].x,
//           this.target[findi].y
//         );
//         if (i === this.particles.length - 1) {
          
//           if (dlen < this.close) {
//             if (this.word.animated === false){              
//               this.percentage = 0;
//               this.word.animated = true;
//               this.translate();
//             }
            
//           }
//         }
//       }
      

//       if (noise((i + 200) * 0.05, this.offset) < 0.5) {
//         if (random() < 0.001) {
//           let sparkz = random(1, 2);
//           for (n = 0; n < 10; n++) {
//             push();
//             translate(this.particles[i].x, this.particles[i].y);
//             let Lrnd = random(-this.size * sparkz, 0);
//             let Rrnd = random(0, this.size * sparkz);
//             let rotrnd = random(-PI, PI);
//             rotate(rotrnd);
//             stroke(255, 255);
//             strokeWeight(1);
//             line(Lrnd, 0, Rrnd, 0);
//             pop();
//           }
//         }
//       }
//     }
//   };

//   /// Switch text lines in the message list.
//   /// Test for date, time display message.
//   /// Get date/time, if needed.
//   /// Setup target points with new text.
//   /// Return to update method with new target locations.
//   this.translate = function () {
  
//     let m = this.word.text;
    
//     this.target = myFont.textToPoints(m, 0, 0, 10, {
//       sampleFactor: 2,
//       simplifyThreshold: 0.0,
//     });
    
//     let centerX = 0;
//     let centerY = 0;
//     for (let i = 0; i < this.target.length; i++) {
//       this.target[i].x *= this.size;
//       this.target[i].y *= this.size;
//       if (centerX < this.target[i].x) {
//         centerX = this.target[i].x;
//       }
//       if (centerY > this.target[i].y) {
//         centerY = this.target[i].y;
//       }
//     }

//     let centerWidth = width / 2 - centerX / 2; //random(0,width-centertext);
//     let centerHeight = random(centerY * -2, height + centerY);
//     for (let i = 0; i < this.target.length; i++) {
//       this.target[i].x += centerWidth;
//       this.target[i].y += height / 2; //centerHeight;
//     }
//   };
// }

// // /// Provide a way to view the output in full screen
// // /// mode.  Click the canvas to switch modes.
// // function mousePressed() {
// //   if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
// //     let fs = fullscreen();
// //     fullscreen(!fs);
// //   }
// // }
