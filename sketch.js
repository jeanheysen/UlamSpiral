

const width = 10*1000+200;
const height = 10*1000+200;
let stepSize = 10;
let startStep = 0;
let step = startStep+1;
let turnState = 0;
let nextTurn = 1;
let turnCounter=0;
let nextPrimeNumberIdx=0;
let x,y;
let primeNumbers,itPrimeNumbers;
let backgroundColor = {r:0,g:0,b:0} 
// let colorsForCells = ["#0032FF","#004CFF","#0065FF","#007FFF","#0098FF","#00AEFF","#00C7FF","#00E1FF","#00FAFF","#00FFE9","#00FFD0","#00FFB6","#00FFA1","#00FF88",
//   "#00FF6E","#00FF55","#00FF3B","#00FF22","#00FF08","#0CFF00","#26FF00","#3FFF00","#59FF00","#72FF00","#8CFF00","#A5FF00","#BBFF00","#D4FF00","#EEFF00",
//   "#FFF600","#FFDC00","#FFC300","#FFAA00","#FF9400","#FF7B00","#FF6100","#FF4800","#FF2E00","#FF1500"];
//let colorsForCells = ["#0032FF","#00FFE9","#72FF00","#8CFF00","#A5FF00","#FF7B00","#FF6100","#FF4800","#FF2E00","#FF1500"];
// let colorsForCells = [{r:0,g:0,b:255},{r:72,g:72,b:184},{r:128,g:128,b:128},{r:204,g:204,b:51},{r:255,g:255,b:0},{r:255,g:205,b:19},{r:253,g:151,b:39},
// {r:253,g:112,b:53},{r:252,g:69,b:252}];

// let colorsForCells = [{r:12,g:0,b:255,},{r:129,g:75,b:187},{r:255,g:0,b:254},{r:255,g:0,b:0}];
let colorsForCells = [{r:50,g:50,b:50,},{r:100,g:100,b:100},{r:150,g:150,b:150},{r:200,g:200,b:200},{r:255,g:255,b:255}];
// let colorsForCells = [{r:200,g:200,b:200,},{r:150,g:150,b:150},{r:100,g:100,b:100},{r:50,g:50,b:50},{r:0,g:0,b:0}];
console.log(colorsForCells);
let diagos = {nw:[-1,-1],ne:[1,-1],sw:[-1,1],se:[1,1]};

function preload() {
  primeNumbers = loadStrings('ressources/1-1000000.txt');
}

function setup() {
  itPrimeNumbers = primeNumbers[Symbol.iterator]();
  let myCanvas = createCanvas(width, height);
  myCanvas.parent('myContainer');
  background(backgroundColor.r,backgroundColor.g,backgroundColor.b);

  [x,y] = [width/2,height/2];
  
  rectMode(CENTER);
  // textAlign(CENTER,CENTER);
  // textSize(stepSize/2);
  
  // frameRate(0)
  
  // let promise = fetch("/ressources/1-1000000.txt");
  // promise.then((response) => response.text())
  // .then((text) => {
  //   console.log(text);
  
  // });  
  
  
  
}

function draw() {
  let nbsteps=0;
  let actualPrim = itPrimeNumbers.next();
  while(nbsteps<4000&&!actualPrim.done){
    
    let actualState;
    
    while(step != actualPrim.value){

      actualState = turnState;                                                       
      
      switch (turnState) {
        case 0:
        x+=stepSize;
        break;
        case 1:
        y-=stepSize;
        break;
        case 2:
        x-=stepSize;
        break;
        case 3:
        y+=stepSize;
        break;
        default:
        throw "turnState = "+turnState+" n'est pas recconu";
      }
      
      
      
      if((step-startStep)%nextTurn == 0){
        turnState=(turnState+1)%4;
        turnCounter++;
        if(turnCounter%2)
        nextTurn++;
      }
      
      step++;
      nbsteps++;
    }

    let diagosCheck = [];
    actualState==0&&diagosCheck.push(diagos.nw,diagos.ne);
    actualState==1&&diagosCheck.push(diagos.sw,diagos.nw);
    actualState==2&&diagosCheck.push(diagos.se,diagos.sw);
    actualState==3&&diagosCheck.push(diagos.ne,diagos.se);

    if(actualState!=turnState) diagosCheck.pop();

    updateColor(x,y,diagosCheck);
    actualPrim = itPrimeNumbers.next();
  }
  if (actualPrim.done || step==1000000){
    noLoop();
    console.log(step);
  }

}


function updateColor(x,y,diagosCheck){

  let recursUpdataColor = (x,y,dirX,dirY,nbNeighbors)=>{
    let [r,g,b] = get(x+(dirX*stepSize),y+(dirY*stepSize));
    let c;
    
    if(r==backgroundColor.r && g==backgroundColor.g & b==backgroundColor.b){
      if(nbNeighbors>=colorsForCells.length) c = colorsForCells[colorsForCells.length-1];
      else c = colorsForCells[nbNeighbors];
    }
    else c = recursUpdataColor(x+dirX*stepSize,y+dirY*stepSize,dirX,dirY,nbNeighbors+1);
    
    [r,g,b] = get(x,y);
    
    if(r==backgroundColor.r && g==backgroundColor.g & b==backgroundColor.b || compareClr(c,{r,g,b})>0){
      fill(c.r,c.g,c.b);
      rect(x,y,stepSize);
    }
    
    return c;
  }
  
  for(diago of diagosCheck)
    recursUpdataColor(x,y,diago[0],diago[1],0);
    
  
}

//return -1 si c1<c2
//        0 si c1==c2
//       +1 si c1>c2
function compareClr(c1,c2){
  let findIdxFun = function ({r,g,b}){
    if(r==this.r && g==this.g && b==this.b) {
      return true;
    }
  }
  let idxC1 = colorsForCells.findIndex(findIdxFun,c1);
  let idxC2 = colorsForCells.findIndex(findIdxFun,c2);
  
  if(idxC1>idxC2) return 1;
  if(idxC1<idxC2) return -1;
  return 0;
}