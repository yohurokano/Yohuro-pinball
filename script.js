const canvas = document.getElementById("pinballCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let ball = {
    x: 200,
    y: 300,
    radius: 10,
    dx: 2,
    dy: -3,
    speed: 3,
    color: "white"
};

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = "High Score: " + highScore;

// **🔥 Added Paddles**
let paddles = {
    left: { x: 50, y: 500, width: 80, height: 10, angle: 0, moving: false },
    right: { x: 270, y: 500, width: 80, height: 10, angle: 0, moving: false }
};

// **🔥 Added Paddles Drawing Function**
function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// **💡 Keyboard Controls**
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") paddles.left.moving = true;
    if (event.key === "ArrowRight") paddles.right.moving = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") paddles.left.moving = false;
    if (event.key === "ArrowRight") paddles.right.moving = false;
});

// **💡 Fully Fixed Mobile Touch Controls**
document.getElementById("leftBtn").addEventListener("touchstart", () => paddles.left.moving = true);
document.getElementById("leftBtn").addEventListener("touchend", () => paddles.left.moving = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => paddles.right.moving = true);
document.getElementById("rightBtn").addEventListener("touchend", () => paddles.right.moving = false);

// **🔥 Update Ball Physics**
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.dy += 0.1; // Gravity Effect

    // Bounce off walls
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }

    // Bounce off paddles
    for (let key in paddles) {
        let paddle = paddles[key];
        if (
            ball.y + ball.radius > paddle.y &&
            ball.y + ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy = -ball.speed;
            ball.dx += Math.random() * 2 - 1; // Randomize bounce angle
            score += 10;
            updateScore();
        }
    }

    // Reset if ball falls
    if (ball.y > canvas.height) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        ball.x = 200;
        ball.y = 300;
        ball.dy = -3;
        ball.dx = 2;
        score = 0;
        updateScore();
    }
}

// **🔥 Update Paddle Movement**
function updatePaddles() {
    if (paddles.left.moving) paddles.left.angle = Math.min(Math.PI / 4, paddles.left.angle + 0.1);
    else paddles.left.angle = Math.max(0, paddles.left.angle - 0.1);

    if (paddles.right.moving) paddles.right.angle = Math.min(Math.PI / 4, paddles.right.angle + 0.1);
    else paddles.right.angle = Math.max(0, paddles.right.angle - 0.1);
}

// **🔥 Draw Everything**
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPaddle(paddles.left);
    drawPaddle(paddles.right);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    updateBall();
    updatePaddles();
    requestAnimationFrame(draw);
}

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

draw();
