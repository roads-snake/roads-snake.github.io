const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let xDirection = 0;
let yDirection = 0;
let gameRunning = false;
let gameInterval;

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  snake = [{x: 10, y: 10}];
  generateFood();
  xDirection = 0;
  yDirection = 0;
  gameInterval = setInterval(updateGame, 150);
}

function updateGame() {
  if (collision()) {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('Game Over!');
    return;
  }

  moveSnake();
  if (eatFood()) {
    generateFood();
    increaseSnakeSize();
  }
  drawGame();
}

function moveSnake() {
  const head = {x: snake[0].x + xDirection, y: snake[0].y + yDirection};
  snake.unshift(head);
  if (!eatFood()) {
    snake.pop();
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = 'green';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function increaseSnakeSize() {
  const tail = {x: snake[snake.length - 1].x, y: snake[snake.length - 1].y};
  snake.push(tail);
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function eatFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

function collision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= tileCount ||
    snake[0].y < 0 ||
    snake[0].y >= tileCount
  ) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      if (yDirection !== 1) {
        xDirection = 0;
        yDirection = -1;
      }
      break;
    case 'ArrowDown':
      if (yDirection !== -1) {
        xDirection = 0;
        yDirection = 1;
      }
      break;
    case 'ArrowLeft':
      if (xDirection !== 1) {
        xDirection = -1;
        yDirection = 0;
      }
      break;
    case 'ArrowRight':
      if (xDirection !== -1) {
        xDirection = 1;
        yDirection = 0;
      }
      break;
    case 'Enter':
      startGame();
      break;
    default:
      break;
  }
});
