const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let tileSize = 20;
let tileCountX = Math.floor(canvas.width / tileSize);
let tileCountY = Math.floor(canvas.height / tileSize);

let snake = [{ x: tileCountX / 2, y: tileCountY / 2 }];
let snakeDirection = { x: 0, y: 0 };
let ball = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('keydown', changeDirection);
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) {
                snakeDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) {
                snakeDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) {
                snakeDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) {
                snakeDirection = { x: 1, y: 0 };
            }
            break;
    }
}

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
}

function handleTouchMove(event) {
    if (!touchStartX || !touchStartY) {
        return;
    }

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            // Right swipe
            if (snakeDirection.x === 0) {
                snakeDirection = { x: 1, y: 0 };
            }
        } else {
            // Left swipe
            if (snakeDirection.x === 0) {
                snakeDirection = { x: -1, y: 0 };
            }
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            // Down swipe
            if (snakeDirection.y === 0) {
                snakeDirection = { x: 0, y: 1 };
            }
        } else {
            // Up swipe
            if (snakeDirection.y === 0) {
                snakeDirection = { x: 0, y: -1 };
            }
        }
    }

    touchStartX = 0;
    touchStartY = 0;
}

function update() {
    const head = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
    snake.unshift(head);

    if (head.x === ball.x && head.y === ball.y) {
        ball = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY || isSnake(head)) {
        resetGame();
    }
}

function isSnake(part) {
    return snake.some(segment => segment.x === part.x && segment.y === part.y);
}

function resetGame() {
    snake = [{ x: tileCountX / 2, y: tileCountY / 2 }];
    snakeDirection = { x: 0, y: 0 };
    ball = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    snake.forEach(part => {
        ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = '#f00';
    ctx.fillRect(ball.x * tileSize, ball.y * tileSize, tileSize, tileSize);
}

function gameLoop() {
    update();
    draw();
}

setInterval(gameLoop, 100);
