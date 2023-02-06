window.s1 =  function ($_p)  {
    let duration = 0;
    let keyPressed = false;
    let start = true;
    let items = [];
    let dead = false;
    
    var bullets = [];
    var currBlue = 96;
    
    
    var fireRotation = 0;
    var startValues = {      
      happiness: 100, 
      energy: 100, 
      mental: 100, 
      money: 50
    };

    let stats = Object.assign({}, startValues);

    
    
    function Bullet(fireRotation, i) {
      this.path = 0;
      var initX = $_p.width / 2;
      var initY = $_p.height;
      this.x = initX;
      this.y = initY;
      this.display = function (i) {
        this.path += 5;
        this.y = initY - this.path * $_p.sin($_p.radians(90 - fireRotation));
        this.x = initX + this.path * $_p.cos($_p.radians(fireRotation - 90));
        $_p.stroke(255, 0, 0);
        $_p.strokeWeight(2);
        $_p.fill(255);
        $_p.ellipse(this.x, this.y, 20, 20);
        if (this.x > $_p.width || this.x < 0 || this.y < 0) {
          bullets.splice(i, 1)
        }
      }
    }

    const itemTypes = [
      {
        name: 'Cleaning',
        color: 'green',
        probability: 3,
        values: {
          happiness: 2,
          
          energy: -2,
          mental: 1,
          money: 0
        }        
      },
      {
        name: 'Work',
        color: 'blue',
        probability: 20,
        values: {
          happiness: -2,          
          energy: -8,
          mental: -2,
          money: 4 
        }        
      },
      {
        name: 'Cooking',
        color: 'yellow',
        probability: 3,
        values: {
          happiness: 1,          
          energy: -1,
          mental: 0,
          money: -2
        }
      },      
      {
        name: 'Sleeping',
        color: 'cyan',   
        probability: 10,
        values: {
          happiness: 0,
          energy: 4,
          mental: 1,
          money: 0
        }
      },      
      {
        name: 'Eating',
        color: 'limegreen',        
        probability: 25,
        values: {
          happiness: 1,
          energy: 2,
          mental: 1,
          money: -2
        }
      },      
      {
        name: 'Drink H20',
        color: 'turquoise',        
        probability: 30,        
        values: {
          happiness: 0,
          energy: 1,
          mental: 1,
          money: 0
        }
      },      
      {
        name: 'Doomscroll',
        color: 'red',        
        probability: 30,      
        values: {  
          happiness: -3,
          energy: -2,
          mental: -1,
          money: 0
        }
      }
    ];
    // create array of min/max values based off probability index
    

    let probabilityMax = 0;
    let probabilityRanges = [];
    for (let i = 0; i < itemTypes.length; i++) {
      const item = itemTypes[i];
      const min = probabilityMax;
      const max = probabilityMax + item.probability;
      probabilityRanges.push({
        min,
        max,
        item
      });
      probabilityMax = max;
    }

    function CurrItem(item){
      this.life = 0;
      this.lifeSpan = 100;
      this.name = item.name;
      this.y = 0;
      this.opacity = 255;
      this.color = item.color;
      this.values = item.values;

      this.display = function (itemIndex) {
        this.opacity = 255 - (this.life / this.lifeSpan) * 255;
        this.life++;
        this.y+=1;
        if (this.life > this.lifeSpan) {
          currItems.splice(itemIndex)
        }
        $_p.textAlign($_p.CENTER);
        $_p.noStroke();
        $_p.fill($_p.color('navy'),100  - (this.life / this.lifeSpan) * 100);
        $_p.rect($_p.width / 2 , $_p.height / 2  - this.y + 40, 130, 130);
        
        $_p.textSize(15);        
        $_p.fill(255, this.opacity);        
        
        $_p.text(`${this.name}`, $_p.width / 2, $_p.height / 2 - this.y);        

        for (let i = 0; i < Object.keys(this.values).length; i++) {          
          $_p.text(Object.keys(this.values)[i] + ': ' + Object.values(this.values)[i],  $_p.width / 2,  $_p.height / 2 + 30 - this.y +  i * 20);
        }
      }
    }

    
    function Item() {

      const random = $_p.random(0, probabilityMax);
      const item = probabilityRanges.find((range) => {
        return random >= range.min && random < range.max;
      }).item;
      this.values = item.values;
      this.name = item.name;
      this.color = item.color;

      // this.happiness = item.happiness;
      // this.energy = item.energy;
      // this.mental = item.mental;
      // this.money = item.money;

                  
      this.weight = 2;
      
      this.x = $_p.random(-$_p.width / 2, $_p.width);
      this.y = 0;
      this.rotation = $_p.random(5, 8);
      this.gravity = $_p.random(0.4, 1.5);
      this.fall = function () {
        this.y += this.gravity;
      };
      this.display = function (ItemIndex) {
        this.size = 20;
        if (this.deathCount !== undefined) {
          this.deathCount++;
          if (this.deathCount >= 4) {
            items.splice(ItemIndex, 1)
          }
        }
        for (var j = 0; j < bullets.length; j++) {
          if ($_p.abs($_p.dist(bullets[j].x, bullets[j].y, this.x, this.y)) < 20) {
            this.color = 'yellow';
            this.deathCount = 0;

            currItems.push(new CurrItem(this));
            if (!start) {
              stats.energy += this.values.energy;
              stats.happiness += this.values.happiness;
              stats.mental += this.values.mental;
              stats.money += this.values.money;
              
              
            }
          }
          ;
        }

        if (this.x > $_p.width + 10 || this.y < -10 || this.y > $_p.height + 10) {
          items.splice(ItemIndex, 1);
        }
        if (items.length < itemMax && $_p.frameCount % 10 == 1) {
          items.push(new Item());
        }
        $_p.fill(255);
        $_p.stroke(this.color);
        $_p.textSize(25);
        $_p.textAlign($_p.LEFT);
        $_p.text(this.name, this.x, this.y - 10);
        $_p.strokeWeight(this.weight);
        $_p.push();
        $_p.translate(this.x, this.y);
        $_p.rotate(this.rotation * ($_p.sin($_p.frameCount / 70 + 90 * ItemIndex) + $_p.cos($_p.frameCount / 100 + 20 * ItemIndex)));
        $_p.ellipse(0, 0, 3, 3);
        $_p.noFill();
        $_p.strokeWeight(1);
        $_p.ellipse(0, 0, this.size, this.size);
        $_p.line(0, 0, 8, 0);
        $_p.triangle(8, 1, 8, -1, 9, 0);
        $_p.pop()
      }
    }

    const itemMax = 15;
    
    $_p.setup = function () {
      const canvas = $_p.createCanvas(1000, 600);
      canvas.parent('content');
      for (var i = 0; i < itemMax; i++) {
        items.push(new Item())
      }
    };

    let currItems = [];
    
    $_p.draw = function () {
      if (keyPressed === 'left' && fireRotation > -90) {
        fireRotation -= 3
      }

      if (keyPressed === 'right' && fireRotation < 90) {
        fireRotation += 3
      }
      $_p.background(12, 12, currBlue, 90);
      $_p.fill(255);
      $_p.stroke(255, 0, 0);
      if (stats.energy <= 0) {

        dead = true;
        $_p.textAlign($_p.CENTER);
        $_p.text('GAME OVER', $_p.width / 2, $_p.height / 2);
        $_p.text('You lasted for ' + (duration/24).toFixed(1) + ' days', $_p.width / 2, $_p.height / 2 + 30);
        $_p.textSize(15);
        $_p.text('Hit ENTER to restart', $_p.width / 2, $_p.height / 2 + 60)
      }
      $_p.textAlign($_p.LEFT);
      $_p.textSize(25);
      
      for (let i = 0; i < Object.values(stats).length; i++){
        const value = Math.round(Object.values(stats)[i]);
        $_p.fill(value > 25 ? 'white' : 'red');
        $_p.text(Object.keys(stats)[i] + ': ' + value, 10,  $_p.height - 10 -  i * 30);        
        $_p.textAlign($_p.LEFT);
      }      

      for (let i = 0; i < currItems.length; i++) {
        currItems[i].display(i);
      }

      const decrement = 0.01;

      
      if (stats.happiness <= 25){
        stats.energy -= decrement;
        stats.mental -= decrement;
      }

      if (stats.energy <= 25){
        stats.mental -= decrement;
      }

      if (stats.mental <= 25){
        stats.energy -= decrement;
      }

      if (stats.money <= 25){
        stats.mental -= decrement;
        stats.energy -= decrement;
      }
      if (stats.energy > 100) {
        stats.energy = 100
      }
      if (stats.happiness > 100) {
        stats.happiness = 100
      }
      if (stats.mental > 100) {
        stats.mental = 100
      }
      if (stats.energy < 0) {
        stats.energy = 0
      }
      if (stats.happiness < 0) {
        stats.happiness = 0
      }
      if (stats.mental < 0) {
        stats.mental = 0
      }

      
      for (var i = 0; i < items.length; i++) {
        items[i].fall();
        items[i].display(i)
      }
      if (start) {
        
        $_p.background(12, 12, currBlue, 150);
        $_p.textAlign($_p.CENTER);
        $_p.rectMode($_p.CENTER);
        $_p.strokeWeight(1);
        $_p.keyStroke = $_p.color(255, 0, 0);
        $_p.keyFill = $_p.color(255);
        $_p.keyStrokePressed = $_p.color(255);
        $_p.keyFillPressed = $_p.color(255, 0, 0);
        let spaceStroke = $_p.keyStroke;
        let spaceFill = $_p.keyFill;
        if ($_p.keyIsPressed && $_p.keyCode == 32) {
          spaceStroke = $_p.keyFill;
          spaceFill = $_p.keyStroke
        }
        $_p.fill(spaceFill);
        $_p.rect($_p.width / 2, $_p.height / 2 - 30, 120, 40);
        Key($_p.width / 2 - 40, $_p.height / 2 - 95);
        Key($_p.width / 2 + 40, $_p.height / 2 - 95, true);
        $_p.noStroke();
        $_p.textSize(15);
        $_p.fill(spaceStroke);
        $_p.text('SPACE', $_p.width / 2, $_p.height / 2 - 25);
        $_p.fill(spaceFill);
        $_p.stroke(spaceStroke);
        $_p.stroke(spaceStroke);
        $_p.fill(spaceFill);
        $_p.stroke(spaceStroke);
        $_p.push();
        $_p.noStroke();        
      
        $_p.text('ENTER TO start', $_p.width / 2, $_p.height / 2 + 75)
      }else{
        $_p.textSize(15);
        $_p.noStroke();
        $_p.textAlign($_p.LEFT);
        $_p.text('Duration: ' + (duration/ 24).toFixed(1) + ' days', 10, 30);
        if (!dead) duration += .025;
      }      
      $_p.fill(255);
      $_p.strokeWeight(2);
      $_p.stroke(255);
      $_p.push();
      $_p.translate($_p.width / 2, $_p.height);
      $_p.rotate($_p.radians(fireRotation));
      $_p.line(0, 0, 0, -20);
      $_p.pop();
      
      for (var i = 0; i < bullets.length; i++) {
        bullets[i].display(i)
      }
    };
    
    function Key(x, y, flipped) {
      let arrowkeyFill = $_p.keyFill;
      let arrowkeyStroke = $_p.keyStroke;
      if ($_p.keyIsPressed) {
        if (flipped && $_p.keyCode == $_p.RIGHT_ARROW || !flipped && $_p.keyCode == $_p.LEFT_ARROW) {
          arrowkeyFill = $_p.keyStroke;
          arrowkeyStroke = $_p.keyFill
        }
      }
      $_p.fill(arrowkeyFill);
      $_p.rect(x, y, 40, 35);
      $_p.fill(arrowkeyStroke);
      var xOffset = 4;
      if (flipped)
        xOffset = -1 * xOffset;
      $_p.triangle(x - xOffset, y, x + xOffset, y + 4, x + xOffset, y - 4)
    }
    
    
    function fire() {
      bullets.push(new Bullet(fireRotation));
      currBlue = 130;
      if (!start) {        
        stats.energy -= 1
      }
    }

    
    
    $_p.keyReleased = function () {
      currBlue = 96
      if (!$_p.keyIsPressed){
        keyPressed = false
      }      

    }

    $_p.keyPressed = function () {
      if ($_p.keyCode === $_p.ENTER) {
        if (stats.energy == 0) {
          duration = 0;
          dead = false;
          stats = Object.assign({}, startValues);
        }
        start = false
      } else if ($_p.keyCode === 32 && stats.energy > 0) {
        fire()
      } else if ($_p.keyCode === $_p.LEFT_ARROW) {
        keyPressed = 'left';
        
      } else if ($_p.keyCode === $_p.RIGHT_ARROW) {
        keyPressed = 'right';
        
      }
    };
  }
  if (window.p5instance) window.p5instance.remove();
  window.p5instance = new p5(window.s1);