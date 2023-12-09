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
let score;

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  snake = [{x: 10, y: 10}];
  generateFood();
  xDirection = 0;
  yDirection = 0;
  score = 0;
  document.getElementById('score').innerText = score;
  gameInterval = setInterval(updateGame, 150);
}

function updateGame() {
  if (collision()) {
    clearInterval(gameInterval);
    gameRunning = false;
    alert('Game Over! Your score: ' + score);
    return;
  }

  moveSnake();
  if (eatFood()) {
    generateFood();
    score += 10;
    document.getElementById('score').innerText = score;
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
  const cornerRadius = 5; // Adjust the corner radius as needed

  snake.forEach((segment, index) => {
    if (index === 0) {
      // Draw head as a square with rounded corners and a white border
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.moveTo(segment.x * gridSize + cornerRadius, segment.y * gridSize);
      ctx.arcTo(
        (segment.x + 1) * gridSize, segment.y * gridSize,
        (segment.x + 1) * gridSize, (segment.y + 1) * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        (segment.x + 1) * gridSize, (segment.y + 1) * gridSize,
        segment.x * gridSize, (segment.y + 1) * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        segment.x * gridSize, (segment.y + 1) * gridSize,
        segment.x * gridSize, segment.y * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        segment.x * gridSize, segment.y * gridSize,
        (segment.x + 1) * gridSize, segment.y * gridSize,
        cornerRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    } else if (index === snake.length - 1) {
      // Draw tail as a triangle
      ctx.fillStyle = 'green';
      drawTriangle(
        segment.x * gridSize + gridSize / 2,
        segment.y * gridSize + gridSize / 2,
        gridSize / 2,
        snake[index - 1]
      );
    } else {
      // Draw body segments as rectangles with rounded corners and a white border
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.moveTo(segment.x * gridSize + cornerRadius, segment.y * gridSize);
      ctx.arcTo(
        (segment.x + 1) * gridSize, segment.y * gridSize,
        (segment.x + 1) * gridSize, (segment.y + 1) * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        (segment.x + 1) * gridSize, (segment.y + 1) * gridSize,
        segment.x * gridSize, (segment.y + 1) * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        segment.x * gridSize, (segment.y + 1) * gridSize,
        segment.x * gridSize, segment.y * gridSize,
        cornerRadius
      );
      ctx.arcTo(
        segment.x * gridSize, segment.y * gridSize,
        (segment.x + 1) * gridSize, segment.y * gridSize,
        cornerRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
  });
}

function drawTriangle(x, y, size, prevSegment) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  const directionX = prevSegment.x - snake[snake.length - 1].x;
  const directionY = prevSegment.y - snake[snake.length - 1].y;
  const angle = Math.atan2(directionY, directionX);
  const point1X = x + size * Math.cos(angle - Math.PI / 2);
  const point1Y = y + size * Math.sin(angle - Math.PI / 2);
  const point2X = x + size * Math.cos(angle + Math.PI / 2);
  const point2Y = y + size * Math.sin(angle + Math.PI / 2);
  ctx.lineTo(point1X, point1Y);
  ctx.lineTo(point2X, point2Y);
  ctx.closePath();
  ctx.fill();
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(
    (food.x * gridSize) + (gridSize / 2),
    (food.y * gridSize) + (gridSize / 2),
    gridSize / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Draw white border for the food
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    (food.x * gridSize) + (gridSize / 2),
    (food.y * gridSize) + (gridSize / 2),
    gridSize / 2,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.lineWidth = 1; // Reset line width
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

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('startButton').addEventListener('touchstart', startGame);

document.getElementById('upButton').addEventListener('touchstart', () => {
  if (yDirection !== 1) {
    xDirection = 0;
    yDirection = -1;
  }
});

document.getElementById('downButton').addEventListener('touchstart', () => {
  if (yDirection !== -1) {
    xDirection = 0;
    yDirection = 1;
  }
});

document.getElementById('leftButton').addEventListener('touchstart', () => {
  if (xDirection !== 1) {
    xDirection = -1;
    yDirection = 0;
  }
});

document.getElementById('rightButton').addEventListener('touchstart', () => {
  if (xDirection !== -1) {
    xDirection = 1;
    yDirection = 0;
  }
});

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
    default:
      break;
  }
});
