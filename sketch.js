let _pipe = [];
let _bird;
let _cw, _ch;
let _pipeGap = 120; // bigger is wider pipes
let _screenCollision;
let _pipeCollision;
let _fontSize;
let _fontColor;


const _LV_SPEED = [2,3,4,5,6,7,8,9,10,11]; // bigger is faster pipe
const _LV_FREQ = [140,100,70,50,30,25,24,23,22,21]; // smaller is more pipes
const _LV_SCORE = [4,8,12,16,25,35,50,70,90,110];
// const _LV_SCORE = [1,2,3,4,5,6,7,8,9,10];


let _lv;
let _speed;
let _freq;
let _score;
let _scorePrevPipe;

function setup() {
  initCanvas();
  createCanvas(_cw, _ch);
  initGame();
  startGame();
}

function draw() {
  background(0);
  
  if(frameCount % _freq == 0) {
    _pipe.push(new Pipe(_cw, _ch, _speed));
  }  
  
  // draw pipes
  for(let i=_pipe.length-1;i>0;i--) {
    _pipe[i].update();
    _pipeCollision = _pipe[i].checkCollisionAndScore(_bird);
    checkGameEnd(_pipeCollision);
    _pipe[i].draw();
    
    // remove a pipe when it's out of screen
    if(_pipe[i].offScreen() == true) {
      _pipe.splice(i,1);
    }
  }
  
  // draw bird
  _bird.update();
  _screenCollision = _bird.checkCollision();
  checkGameEnd(_screenCollision);
  _bird.draw();
  
  
  
  drawStatus();
  checkNextLv();
  
}

function checkNextLv() {
  // console.log('lv, pipe, freq', _lv, _pipe.length, _freq);
  if(_lv == _LV_SCORE.length-1) return;
  
  if(_score >= _LV_SCORE[_lv]) {
    _lv++;
    
    _speed = _LV_SPEED[_lv];
    _freq = _LV_FREQ[_lv];
  
    // set speed for exist pipes
    for(let i=_pipe.length-1;i>0;i--) {
      _pipe[i].setSpeed(_speed);
    }
  }
}


function drawStatus() {
  fill(_fontColor);
  textSize(_fontSize/2);
  textAlign(CENTER, CENTER);
  let str = 'Lv : ' + (_lv + 1) + '  Score : ' + _score;
  text(str, _cw/2, _fontSize);
  
  // console.log(_pipe.length);
  if(_screenCollision == false && _pipeCollision == false && _pipe.length <= 1) {
    textSize(_fontSize);
    text('Go Flappy Circle!!', _cw/2, _ch/2);
    text('Press Space Bar to jump!!', _cw/2, _ch/2 + _fontSize* 2);
  }
}

function checkGameEnd(end) {
  if(end == true) {
    fill(_fontColor);
    textSize(_fontSize);
    textAlign(CENTER);
    text('You wanna try again? (y)',_cw/2, _ch/2);
    
    noLoop();
  }
}


function keyPressed() {
  // console.log('key', _screenCollision, _pipeCollision);
  if( keyCode == 32) {
    if(_screenCollision == true || _pipeCollision == true ) {
      initGame();
      startGame();
    }
    else {
      _bird.up();  
    }
  }
  else if( keyCode == 89 || keyCode == 121) { // pressed 'y' 'Y'
    if(_screenCollision == true || _pipeCollision == true ) {
      initGame();
      startGame();
    }
  }
}

function mousePressed() {
  // console.log('mouse', _screenCollision, _pipeCollision);
  if(_screenCollision == true || _pipeCollision == true ) {
    initGame();
    startGame();
  }
  else {
    _bird.up();  
  }
}


function initCanvas() {
  if(windowWidth > windowHeight) {
    _cw = windowHeight * 0.9;
    _ch = _cw;
  }
  else {
    _cw = windowWidth * 0.9;
    _ch = _cw;
  }
  
  _fontSize = _cw/20;
  _fontColor = color(255,255,255);
}

function initGame() {
  _bird = new Bird(_cw, _ch);
  _pipe = [];
  _pipe.push(new Pipe(_cw, _ch));
  _screenCollision = false;
  _pipeCollision = false;
  
  
  _lv = 0;
  _speed = _LV_SPEED[_lv];
  _freq = _LV_FREQ[_lv];
  _score = 0;
  _scorePrevPipe = '';
    
}

function startGame() {
  loop();
  // console.log('pipelength', _pipe.length);
}

class Bird {
  constructor(w, h) {
    this.x = w * 0.2;
    this.y = h * 0.4;
    this.s = 20;  // size of circle
    this.g = 0.4;  // gravity
    this.v = 0;    // velocity
    this.f = 11;   // force
    this.collision = false;    
  }
  
  up() {
    // console.log('up');
    this.v -= this.f;
  }
  
  update() {
    this.v += this.g;
    this.y += this.v;
    
    if(this.y > _ch) {
      this.y = _ch;
      this.v = 0;
    }
    
    if(this.y < 0) {
      this.y = 0;
      this.v = 0;
    }
  }

  draw() {
    if( this.collision == true) {
      fill(255,0,0);
    }
    else {
      fill(255);  
    }
    ellipse(this.x, this.y, this.s, this.s);
  }
  
  checkCollision() {
    this.collision = false;

    if( this.y <= 0 || this.y >= _ch) {
      this.collision = true;  
    }
    
    return this.collision;
  }  
}

class Pipe {
  constructor(w, h, speed) {
    this.speed = speed;
    this.width = 20;
    this.x = w;
    this.h = h;
    this.top = random(height*0.45);
    this.bottom = random(height*0.45);
    this.collision = false;
    this.name = hour() + '' +  minute() + '' + second() + '' + millis();
  }
  
  setSpeed(speed) {
    this.speed = speed;
  }
 
  update() {
    this.x -= this.speed;
  }
  
  draw() {
    if( this.collision == true) {
      fill(255,0,0);
    }
    else {
      fill(255);  
    }
    rect(this.x, 0, this.width, this.top);
    rect(this.x, this.h - this.bottom, this.width, this.h);
  }
  
  offScreen() {
    if( this.x < -this.width ) {
      return true;
    }
    else {
      return false;
    }
  }
  
  checkCollisionAndScore(bird) {
    this.collision = false;

    if( bird.x >= this.x && bird.x <= this.x + this.width) {
      if(bird.y <= this.top || bird.y >= this.h - this.bottom) {
        this.collision = true;  
      }
    }
    
    if( bird.x >= (this.x + this.width) ) {
      if( _scorePrevPipe != this.name) {
        _scorePrevPipe = this.name
        _score++;
      }
    }
    
    return this.collision;
  }
}