// Variáveis do jogo
let player1, player2;
let ball;
let player1Score = 0;
let player2Score = 0;
let raquetadaSound, pontoSound, trilhaSound;

function preload() {
  // Carregar os sons
  raquetadaSound = loadSound('raquetada.mp3');
  pontoSound = loadSound('ponto.mp3');
  trilhaSound = loadSound('trilha.mp3');
}

function setup() {
  createCanvas(600, 400);

  // Inicialização dos jogadores e da bola
  player1 = new Player(20, height / 2 - 50, UP_ARROW, DOWN_ARROW);
  player2 = new Player(width - 40, height / 2 - 50, 87, 83); // W e S
  ball = new Ball(width / 2, height / 2);

  // Iniciar trilha sonora
  trilhaSound.loop();
}

function draw() {
  background(0);

  // Desenhar jogadores e bola
  player1.show();
  player2.show();
  ball.show();
  
  // Mover jogadores
  player1.move();
  player2.move();

  // Verificar colisões e pontuação
  ball.checkCollision(player1);
  ball.checkCollision(player2);
  let score = ball.update();
  if (score === 1) {
    player1Score++;
    pontoSound.play();
  } else if (score === 2) {
    player2Score++;
    pontoSound.play();
  }

  // Mostrar pontuação
  textSize(32);
  textAlign(CENTER);
  fill(255);
  text(player1Score, width / 4, 50);
  text(player2Score, width * 3 / 4, 50);
}

// Classe para jogador
class Player {
  constructor(x, y, upKey, downKey) {
    this.x = x;
    this.y = y;
    this.w = 10; // Reduzi o tamanho da raquete
    this.h = 80; // Reduzi o tamanho da raquete
    this.speed = 5;
    this.upKey = upKey;
    this.downKey = downKey;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  move() {
    if (keyIsDown(this.upKey) && this.y > 0) {
      this.y -= this.speed;
    } else if (keyIsDown(this.downKey) && this.y < height - this.h) {
      this.y += this.speed;
    }
  }
}

// Classe para bola
class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 10; // Reduzi o tamanho da bola
    this.xSpeed = 5;
    this.ySpeed = 5;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Verificar colisão com as paredes
    if (this.y < 0 || this.y > height) {
      this.ySpeed *= -1;
    }

    // Verificar se a bola marcou um ponto
    if (this.x < 0) {
      this.reset();
      return 2; // Jogador 2 marcou ponto
    } else if (this.x > width) {
      this.reset();
      return 1; // Jogador 1 marcou ponto
    }

    return 0; // Nenhum ponto marcado
  }

  checkCollision(player) {
    if (
      this.x - this.r < player.x + player.w &&
      this.x + this.r > player.x &&
      this.y - this.r < player.y + player.h &&
      this.y + this.r > player.y
    ) {
      this.xSpeed *= -1;
      raquetadaSound.play();
    }
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed *= -1;
    this.ySpeed = random(-5, 5);
  }
}
