
let game = document.getElementById("game");

let ctx = game.getContext("2d");
// Set canvas width and height
game.setAttribute("width", getComputedStyle(game)["width"]);
game.setAttribute("height", getComputedStyle(game)["height"]);

// Make canvas
function drawBox(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

document.querySelector("#restart-button").addEventListener("click", function() {
    window.location.reload();
})

// Make fish spawn at random locations
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

// Fisherwoman constructor
function Fisher(x, y, color, width, height, src) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.image = new Image();
        if (src) {
            this.image.src = src;
        }
    this.render = function() {
        if (this.image.src) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}
// Create a fish lady
let fisherwoman = new Fisher(280, 9, "brown", 80, 50, "img/boat.png");

let direction = -1;
// Fish constructor
class Fish {
    constructor(x, y, color, width, height, points, src) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.caught = false;
        this.points = points;
        this.initDirection = -1;
        this.image = new Image();
        if (src) {
            this.image.src = src;
        }
        this.findDirection = function() {
            if (Math.random() >= .5) {
                direction = 1; 
            } else {
                direction = 0;
            }
            this.initDirection = direction;
            return this.initDirection;
        };
        this.initDirection = this.findDirection();
        this.render = function() {
            if (this.image.src) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height, this.points);
            }
        };
        this.velocity = {
            x: Math.random() - 0.5, // Random x value from -0.5 to 0.5
        };
        this.update = function() {
            // move along x axis
            // check direction
            if (this.initDirection === 0) {
                // if not a hazard
                if (this.width !== 120 && this.width !== 30) {
                    if (this.x < 820) {
                        this.x++;
                        if (this.width === 21) {
                            this.image.src = "img/babyFish2.png";
                        }
                        else if (this.width === 41) {
                            this.image.src = "img/mediumFish2.png";
                        }
                        else if (this.width === 60) {
                            this.image.src = "img/largeFish2.png";
                        }
                    }
                    else {
                        // check fish
                        if (this.width === 21) {
                            // set new starting point and flip direction
                            this.y = getRandomInt(20, 379);                    
                            this.initDirection = 1;
                        }
                        else if (this.width === 41) {
                            this.y = getRandomInt(100, 339);                    
                            this.initDirection = 1;
                        }
                        else {
                            this.y = getRandomInt(200, 340);                    
                            this.initDirection = 1;
                        }
                    }
                }
                //if a hazard
                else {
                    if (this.x < 1000) {
                        this.x++;
                        this.image.src = "img/BigShark.png";
                    }
                    else {
                        this.y = getRandomInt(20, 400);                    
                        this.initDirection = 1;
                    }
                }
            } 
            else {
                // if not a hazard
                if (this.width !== 120 && this.width !== 30) {
                    if (this.x > -50) {
                        this.x--;
                        if (this.width === 21) {
                            this.image.src = "img/babyFish.png";
                        }
                        else if (this.width === 41) {
                            this.image.src = "img/mediumFish.png";
                        } 
                        else if (this.width === 60) {
                            this.image.src = "img/largeFish.png";
                        }
                    }
                    else {
                        if (this.width === 21) {
                            this.y = getRandomInt(40, 379);
                            this.initDirection = 0;
                        }
                        else if (this.width === 41) {
                            this.y = getRandomInt(100, 339);                    
                            this.initDirection = 0;
                        }
                        else {
                            this.y = getRandomInt(200, 340);                    
                            this.initDirection = 0;
                        }
                    }
                } 
                else {
                    if (this.x > -200) {
                        this.x--;
                        this.image.src = "img/BigShark2.png";
                    }
                    else {
                        this.y = getRandomInt(40, 390);
                        this.initDirection = 0;
                    }
                }
            };
            // make fish swim at different speeds
            this.x += this.velocity.x;
        };
    }
}


//Need to fill arraw with Fish to keep code DRY
fishArr = [];
function createFish() {
    fishArr.push(new Fish(getRandomInt(-100, 900), getRandomInt(40, 400), "black", 120, 60, 0, "img/BigShark.png"));
    fishArr.push(new Fish(getRandomInt(-20, 830), getRandomInt(40, 400), "black", 30, 15, -10, "img/BigShark.png"));
    for (let i = 0; i < 15; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(40, 390), "#FFA500", 21, 16, 1, 'img/babyFish.png'));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(100, 390), "#FF6347", 41, 30, 3, "img/mediumFish.png"));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(200, 390), "#FFD700", 60, 50, 8, "img/largeFish.png"));
    }
    
    for (let i = 0; i < fishArr.length; i++) {
        fishArr[i].render();
    }
}

// Fishing Line
let fishingLine = null;
let reelDemFish;
// Hook
let hook;
// Hook status
let hookIsSet = false;

// create fishing line
function createFishingLine(e) {
    if (!hookIsSet) {
        fishingLine = {
            start_x: 340,
            start_y: 20,
            end_x: e.offsetX,
            end_y: e.offsetY,
            color: "white"
            
            
        }
    } 
   hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 10, 15, "img/hook.png");
}

// draw the fishing line
function drawFishingLine() {
    ctx.beginPath();
    ctx.moveTo(fishingLine.start_x, fishingLine.start_y);
    ctx.lineTo(fishingLine.end_x + 7, fishingLine.end_y + 7);
    ctx.closePath();
    ctx.strokeStyle = fishingLine.color;
    ctx.stroke();
    ctx.beginPath();

    // Adding hook to end of fishing line
    hook.render();
    hook.image.src = "img/hook.png";
    
}

let sharkCaught = false;
var totalPoints = 0;
// Function that pulls fishin line back in
function decreaseLineLength(currentX, currentY, endX, endY) {
    let xDecrementVal = 7;
    let yDecrementVal = 7;
    if (currentY < 20) {
        hookIsSet = false;
        if (caughtFishIndex > -1) {
            // update users points
            totalPoints += fishArr[caughtFishIndex].points;
            // BigShark is caught
            if (caughtFishIndex === 0) {
                totalPoints = -1000000;
                document.querySelector("#bottom-right h3").textContent = `Points: ${totalPoints}`;
                sharkCaught = true;
            }
            // LilShark is caught
            else if (caughtFishIndex === 1) {
                document.querySelector("#bottom-right h3").textContent = `Points: ${totalPoints}`;
                caughtFishIndex = -1;
            }
            // Fish is caught
            else {
                document.querySelector("#bottom-right h3").textContent = `Points: ${totalPoints}`;
                // remove caught fish from fishing array
                fishArr.splice(caughtFishIndex, 1);
                caughtFishIndex = -1;
            }
        }
        // make fish stop following fishing line / reset caughtFish
        caughtFish = null;   
    } 
    else {
        if (currentX < endX) {
            fishingLine.end_x += xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
            hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 15, 20, "img/hook.png");
            // Render hook to follow line
            hook.render();
            // Caught fish set to same coords as hook and line end, then rendered to follow
            caughtFish.y = fishingLine.end_y - 2;
            caughtFish.x = fishingLine.end_x - 2;
            caughtFish.render();
        } else {
            fishingLine.end_x -= xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
            hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 15, 20, "img/hook.png");
            hook.render();
            caughtFish.y = fishingLine.end_y - 2;
            caughtFish.x = fishingLine.end_x - 2;
            caughtFish.render();
        }
    }
}

// moved parameter e into the event listener in an anonymous functiona and then call this function 
function setHookStartPosition(e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    fishingLine.end_x = mouseX;
    fishingLine.end_y = mouseY;
    hookIsSet = true;

    reelDemFish = setInterval(function () {
        decreaseLineLength(fishingLine.end_x, fishingLine.end_y, fishingLine.start_x, fishingLine.start_y);
    }, 100);
}

var caughtFish;
var caughtFishIndex = -1;
//let caughtFish = [];
function detectHit() {

    for (let i = 0; i < fishArr.length; i++) {
        if (fishArr[i].x < hook.x + hook.width &&
            fishArr[i].x + fishArr[i].width > hook.x &&
            fishArr[i].y < hook.y + hook.height &&
            fishArr[i].y + fishArr[i].height > hook.y) {
            fishArr[i].caught = true;
                
            if (fishArr[i].caught === true) {
                caughtFish = fishArr[i];
                caughtFishIndex = i;
                console.log(caughtFish);
            }
        }
    }
}

// Event listener that will draw fishing line when mouse moves over screen
game.addEventListener('mousemove', createFishingLine);

// Event listener that will set the lineTo values as mouse position
game.addEventListener('click', setHookStartPosition);

const STARTING_TIME = 30;
let remainingTime = STARTING_TIME;
let countdown = null;

let updateClock = function() {
    // count down in miliseconds
    if (remainingTime > 0) {
        remainingTime--;
    } 
    document.querySelector("#bottom-left h3").textContent = `00:00:${remainingTime < 10 ? "0" + remainingTime : remainingTime}`;
};

function winGame() {
    clearInterval(reelDemFish);
    clearInterval(countdown);
    document.querySelector("#bottom-left h3").textContent = 'WINNER WINNER SUSHI DINNER';
}

let gameOverFish = new Fish(800, 125, "white", 150, 150, 0, 'img/game-over-fish.png');
let lose = false;
function gameOver() {
    
    clearInterval(reelDemFish);
    clearInterval(countdown);
    lose = true;
    document.querySelector("#bottom-left h3").textContent = 'Game Over';
    gameOverFish.render();
    // game over fish rolls by
    if (gameOverFish.x + gameOverFish.width > 0) {
        gameOverFish.x--;
    }
    else {
        gameOverFish.x = 800;
    }
}

// Initialize game
function initGame() {
    // Start timer
    let domTimer = document.querySelector("#bottom-left h3");
    countdown = setInterval(updateClock, 1000);
    //  create fish and board
    createFish();
}

let animationRequest = null;

initGame();



// Makes game animate via looping via requestAnimationFrame() function
function gameLoop() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, game.width, game.height);
    
    fishArr.forEach((fish, i) => {

        fishArr[i].update();
        fish.render();
    });
    

    fisherwoman.render();
    
    if (fishingLine && fishingLine.end_y > 20) {
        drawFishingLine();
    }

    if (hookIsSet) {
        detectHit();
        game.removeEventListener('mousemove', createFishingLine);
        game.removeEventListener('click', setHookStartPosition);
    }

    if (sharkCaught) {
        gameOver();
    }

    if (remainingTime === 0 && totalPoints < 30) {
        // End game as loser
            gameOver();
    } else if (remainingTime === 0 && totalPoints >= 24) {
        // End game as winner
            winGame();
    }

    // check if line has been reeled back in
    if (!hookIsSet && !lose) {
        clearInterval(reelDemFish);
        game.addEventListener('mousemove', createFishingLine);
        game.addEventListener('click', setHookStartPosition);
    }
    animationRequest = requestAnimationFrame(gameLoop);
}

gameLoop();