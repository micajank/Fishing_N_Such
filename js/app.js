
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

// Fishing Line
let fishingLine = null;
let reelDemFish;



// Fisherwoman constructor
function Fisher(x, y, color, width, height) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.render = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
// Create a fish lady
let fisherwoman = new Fisher(300, 20, "brown", 50, 15);

let direction = -1;
// Fish constructor
class Fish {
    constructor(x, y, color, width, height, points) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.caught = false;
        this.points = points;
        this.initDirection = -1;
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
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height, this.points);
        };
        this.velocity = {
            x: Math.random() - 0.5, // Random x value from -0.5 to 0.5
        };
        this.update = function() {
            // move along x axis
            // check direction
            if (this.initDirection === 0) {
                if (this.x < 820) {
                    this.x++;
                }
                else {
                    // check fish
                    if (this.width === 10) {
                        // set new starting point and flip direction
                        this.y = getRandomInt(20, 390);                    
                        this.initDirection = 1;
                    }
                    else if (this.width === 20) {
                        this.y = getRandomInt(100, 380);                    
                        this.initDirection = 1;
                    }
                    else {
                        this.y = getRandomInt(200, 360);                    
                        this.initDirection = 1;
                    }
                }
            } 
            else {
                if (this.x > -50) {
                    this.x--;
                }
                else {
                    if (this.width === 10) {
                        this.y = getRandomInt(40, 390);
                        this.initDirection = 0;
                    }
                    else if (this.width === 20) {
                        this.y = getRandomInt(100, 380);                    
                        this.initDirection = 0;
                    }
                    else {
                        this.y = getRandomInt(200, 360);                    
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
    for (let i = 0; i < 15; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(40, 390), "#FFA500", 10, 10, 1));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(100, 390), "#FF6347", 20, 20, 3));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(200, 390), "#FFD700", 40, 40, 8));
    }
    
    for (let i = 0; i < fishArr.length; i++) {
        fishArr[i].render();
    }
}

// Hook
let hook;

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
   hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 5, 5);
}

// draw the fishing line
function drawFishingLine() {
    ctx.beginPath();
    ctx.moveTo(fishingLine.start_x, fishingLine.start_y);
    ctx.lineTo(fishingLine.end_x, fishingLine.end_y);
    ctx.closePath();
    ctx.strokeStyle = fishingLine.color;
    ctx.stroke();
    ctx.beginPath();

    // Adding hook to end of fishing line
    hook.render();
    
}

var totalPoints = 0;
// Function that pulls fishin line back in
function decreaseLineLength(currentX, currentY, endX, endY) {
    let xDecrementVal = 7;
    let yDecrementVal = 7;
    if (currentY < 20) {
        hookIsSet = false;
        // MAYBE CALL FUNCTION THAT DOES ALL THIS

        // remove caught fish from fishing array
        if (caughtFishIndex > -1) {
            // update users points
            totalPoints += fishArr[caughtFishIndex].points;
            document.querySelector("#bottom-right h3").textContent = `Points: ${totalPoints}`;
            fishArr.splice(caughtFishIndex, 1);
            caughtFishIndex = -1;
        }
        // make fish stop following fishing line
            // reset caughtFish
            caughtFish = null;
        // checkwin -  maybe should do this in my gameLoop??  
        
        
    } 
    else {
        if (currentX < endX) {
            fishingLine.end_x += xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
            hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 5, 5);
            // Render hook to follow line
            hook.render();
            // Caught fish set to same coords as hook and line end, then rendered to follow
            caughtFish.y = fishingLine.end_y;
            caughtFish.x = fishingLine.end_x;
            caughtFish.render();
        } else {
            fishingLine.end_x -= xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
            hook = new Fisher(fishingLine.end_x, fishingLine.end_y, "black", 5, 5);
            hook.render();
            caughtFish.y = fishingLine.end_y;
            caughtFish.x = fishingLine.end_x;
            caughtFish.render();
        }
    }
}

let hookIsSet = false;

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
        if (fishArr[i].x <= hook.x + hook.width &&
            fishArr[i].x + fishArr[i].width >= hook.x &&
            fishArr[i].y <= hook.y + hook.height &&
            fishArr[i].y + fishArr[i].height >= hook.y) {
                
                fishArr[i].caught = true;
                if (fishArr[i].caught === true) {
                    caughtFish = fishArr[i];
                    caughtFishIndex = i;
                    console.log(caughtFish);
                }
                console.log("caught");
                console.log(i);
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
    //TODO: count down in miliseconds
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

let gameOverFish = new Fish(800, 175, "white", 70, 70, 0);
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
    // tell user to click start to play again
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

    if (remainingTime === 0 && totalPoints < 30) {
        // End game as loser
            gameOver();
    } else if (remainingTime === 0 && totalPoints >= 24) {
        // End game as winner
            winGame();
    }

    // check if line has been reeled back in
    if (!hookIsSet && !lose) {
        console.log("Helllllllo");
        clearInterval(reelDemFish);
        game.addEventListener('mousemove', createFishingLine);
        game.addEventListener('click', setHookStartPosition);
    }

    animationRequest = requestAnimationFrame(gameLoop);
    
}

gameLoop();

// reset game
    // reset points
    // reset fish array