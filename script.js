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

const bumpers = [
    { x: 100, y: 200, radius: 15 },
    { x: 300, y: 250, radius: 15 },
    { x: 200, y: 100, radius: 20 }
];

let paddles = {
    left: { x: 50, y: 500, width: 80, height: 10, angle: 0, rotate: false },
    right: { x: 270, y: 500, width: 80, height: 10, angle: 0, rotate: false }
};

const bounceSound = new Audio("https://www.fesliyanstudios.com/play-mp3/4388");

// **💡 Keyboard Controls**
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") paddles.left.rotate = true;
    if (event.key === "ArrowRight") paddles.right.rotate = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") paddles.left.rotate = false;
    if (event.key === "ArrowRight") paddles.right.rotate = false;
});

// **💡 Fully Fixed Mobile Touch Controls**
document.getElementById("leftBtn").addEventListener("touchstart", () => paddles.left.rotate = true);
document.getElementById("leftBtn").addEventListener("touchend", () => paddles.left.rotate = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => paddles.right.rotate = true);
document.getElementById("rightBtn").addEventListener("touchend", () => paddles.right.rotate = false);

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawBumpers() {
    bumpers.forEach(bumper => {
        ctx.beginPath();
        ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    });
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    ball.dy += 0.1;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
        playSound();
    }

    for (let key in paddles) {
        let paddle = paddles[key];
        if (
            ball.y + ball.radius > paddle.y &&
            ball.y + ball.radius < paddle.y + paddle.height &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy = -ball.speed;
            score += 10;
            updateScore();
            playSound();
        }
    }

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

function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

function playSound() {
    bounceSound.currentTime = 0;
    bounceSound.play();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawBumpers();
    updateBall();
    requestAnimationFrame(draw);
}

draw();
