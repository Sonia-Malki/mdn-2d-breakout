//Refernce to <canvas> Element to the canvas Variable
const canvas = document.getElementById("myCanvas");
//ctx Variable to store the 2D rendering context (the tool to use to paint on the Canvas)
const ctx = canvas.getContext("2d");

//Variable to move the ball

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

const ballRadius = 10;

// Variables for the Paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Variables for User to conrtol the Paddle
// Pressed Buttons (false because at the beginig Buttons are not pressed)
let rightPressed = false;
let leftPressed = false;

//Brick Wall Variables
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

//Score Variable
let score = 0;

//Lives Variable
let lives = 3;

// LOOP to craet new Bricks
const bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];

    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Key press Event listners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// Mouse movement Eveent Listner
document.addEventListener("mousemove", mouseMoveHandler, false);



// Key press functions
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Mouse move Function
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/ 2;
    }
}

//Collision Detection Function that loops through all the Bricks and compare every single brick's position 
//with the ball's coordinates as each frame is drawn.
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if ( 
                    x > b.x && 
                    x < b.x + brickWidth && 
                    y > b.y && 
                    y < b.y + brickHeight
                    ) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if ( score == brickRowCount * brickColumnCount ) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Draw Score Function
function drawScore() {
    ctx.font = "18px Courier New";
    ctx.fillStyle = "#EC994B";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

// Draw Lives Counter Function
function drawLives() {
    ctx.font = "18px Courier New";
    ctx.fillStyle = "#EC994B";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 95, 20); 
}

// Draw Ball Function
function drawBall() {
    //Code to draw a Circle
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#EC994B";
    ctx.fill();
    ctx.closePath();
}

// Draw Paddle Function
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#73777B";
    ctx.fill();
    ctx.closePath();
}

// Draw Bricks 
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // If the Brick Status is 1 Draw it if it is 0, then it was hit by the Ball 
            if (bricks[c][r].status === 1) {
                // Calculation to work the Position of X and Y for eaxh Brick for each Loop iteration
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#15133C";
                ctx.fill();
                ctx.closePath();
            } 
        }
    }
}


// Draw Function to be executed every 10 millisecons
function draw() {
    // to clear the canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Bricks
    drawBricks()
    // Draw Ball 
    drawBall()
    // Draw Paddle
    drawPaddle();
    // Call Collision Detection 
    collisionDetection();
    // Call Score
    drawScore();
    // Call Lives
    drawLives();

    //Collision detection
    // Bouncing off left and right
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // Bouncing off top // GAME OVER when Ball Collide with BOTTOM edge
    //Collison detectio between Ball and Paddle   
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) { 
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height -30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
            
        }
    }

    // Moving Paddle from right to left but keeping it inside the Canvas
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }

    // Circle moves
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();




