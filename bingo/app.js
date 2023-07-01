
class Bingo{
  constructor({ options, size }){
    this.size = size;
    this.options = options;
    
    this.boardElem = document.getElementById("board");
    //this.generateBoard();
  }
  shuffle(array){
    return Array(array.length).fill(null)
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => array[i])
  }

  generateBoard(){
    this.board = [];
    this.options = this.shuffle(this.options);
    //console.log(this.options);
    let optionIndex = 0;
    for(let i = 0; i < this.size; i++){
      this.board.push([]);
      for(let j = 0; j < this.size; j++){
        if(i === Math.floor(this.size/2) && j === Math.floor(this.size/2)){
          this.board[i].push("FREE");
        }else{
          this.board[i].push(this.options[optionIndex]);
          optionIndex++;
        }
      }
    }
  }
  bindCell(){
    const cells = document.getElementsByClassName("cell");
    for(let i = 0; i < cells.length; i++){
      cells[i].addEventListener("click", function(e){
        if (e.target.classList.contains("free")) return;
        e.target.classList.toggle("selected");        
        this.calculateScore();
      }.bind(this));
    }
  }

  calculateScore(){
    const cells = document.getElementsByClassName("cell");
    this.score = '';
    for(let i = 0; i < cells.length; i++){      
      const cellScore = cells[i].classList.contains("selected") ? 'X' : 'O';
      if (i % this.size === 0) this.score += '\n';
      this.score += cellScore;
    }    
    let winCount = 0;
    const lines = this.score.split('\n').filter(line => line.length > 0);
    for(let i = 0; i < lines.length; i++){
    
      if (lines[i].indexOf('O') === -1) winCount++;
    }  
    
    for(let i = 0; i < this.size; i++){
      let col = '';
      for(let j = 0; j < this.size; j++){
        col += lines[j][i];
      }
      if (col.indexOf('O') === -1) winCount++;
    }
    
    let diag1 = '';
    let diag2 = '';
    for(let i = 0; i < this.size; i++){
      diag1 += lines[i][i];
      diag2 += lines[i][this.size - i - 1];
    }
    
    if (diag1.indexOf('O') === -1) winCount++;
    
    if (diag2.indexOf('O') === -1) winCount++;
    
    if (winCount === 1 && !this.boardElem.classList.contains('win')) alert("You win?");
    this.boardElem.classList.toggle('win', winCount > 0);
    
  }


  
  bindEvents(reset){    
    this.bindCell();
    const reloadElem = document.getElementById("reload");
    if (reset) return false;
    reloadElem.addEventListener("click", function(){
      this.generateBoard();
      this.printBoard();
      this.bindEvents(true);
    }.bind(this));

  }
  start(){
    this.generateBoard();
    this.printBoard();
    this.bindEvents();    
  }
  printBoard(){    
    
    this.boardElem.innerHTML = "";
    for(let i = 0; i < this.size; i++){
      const row = document.createElement("div");
      row.classList.add("row");
      for(let j = 0; j <  this.size; j++){
        const cell = document.createElement("div");
        if(i === Math.floor(this.size/2) && j === Math.floor(this.size/2)) cell.classList.add("free", "selected");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.classList.add("cell");
        cell.innerText = this.board[i][j];
        row.appendChild(cell);
      }
      this.boardElem.appendChild(row);
    }
  } 
}

const options = [
  "You’ve been called exotic/oriental",
  "Your food has been called smelly/gross/weird",
  "You’ve been told you’re too quiet",  
  "You were assumed to be good at math",
  "A relative has called you fat / commented on your weight",
  "You never saw anything resembling yourself on TV or in the movies in your childhood or portrayals were problematic caricatures",
  "Your family back home thinks you are too westernized",  
  "You have been the only asian kid in your class",
  "Someone has said a racial slur to your face",
  "You often find labels with “Made in [home country]” on goods that you buy",
  "You wished you were white growing up",
  "Your parents wanted you to become an engineer, doctor, lawyer",
  "You went to school to become an engineer, doctor, lawyer because of guilt",
  "You considered getting eyelid surgery or some other cosmetic procedure because of a beauty ideal in your culture",
  "You’ve been made fun of for your eye shape",
  "You have heard a joke about your race in a TV or movie",
  "Your parents or grandparents risked everything to come to America",
  "You were disciplined for getting less than an A",
  "You were told that you are too dark / your family associated being dark with being dirty and/or poor",
  "When non-asian people start eating food from your culture, you have complicated feelings about it",
  "Someone has called you the name of another asian person",
  "Someone has said they were into you because of “yellow fever”",
  "Someone has assumed you like Hello Kitty or “anime”",
  "You have been told that you are “too asian” or “not asian enough”",


];

const bingo = new Bingo({ options, size: 5 });
bingo.start();