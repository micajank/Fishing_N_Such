
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
// create a fish lady
let fisherwoman = new Fisher(300, 20, "brown", 50, 15);

let direction = -1;
// Fish constructor
class Fish {
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.caught = false;
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
            ctx.fillRect(this.x, this.y, this.width, this.height);
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
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(40, 390), "#FFA500", 10, 10));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(100, 390), "#FF6347", 20, 20));
    }
    for (let i = 0; i < 6; i++) {
        fishArr.push(new Fish(getRandomInt(-10, 800), getRandomInt(200, 390), "#FFD700", 40, 40));
    }
    
    for (let i = 0; i < fishArr.length; i++) {
        fishArr[i].render();
    }
}

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
}

// Function that pulls fishin line back in
function decreaseLineLength(currentX, currentY, endX, endY) {
    let xDecrementVal = (Math.abs(currentX - endX)) / 10;
    let yDecrementVal = (Math.abs(currentY - endY)) / 10;
    if (currentY > endY) {
        if (currentX < endX) {
            fishingLine.end_x += xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
        } else {
            fishingLine.end_x -= xDecrementVal;
            fishingLine.end_y -= yDecrementVal;
        }
    } else {
        console.log('AGAIN')
        hookIsSet = false;
    }
}

let hookIsSet = false;
// moved parameter e into the event listener in an anonymous functiona and then call this function 
function setHookStartPosition(e) {
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;
    fishingLine.end_x = mouseX;
    fishingLine.end_y = mouseY;
    console.log(fishingLine.end_x);
    console.log(fishingLine.end_y);
    // game.removeEventListener('mousemove', createFishingLine);
    // game.removeEventListener('click', setHookStartPosition);
    hookIsSet = true;

    reelDemFish = setInterval(function () {
        decreaseLineLength(fishingLine.end_x, fishingLine.end_y, fishingLine.start_x, fishingLine.start_y);
    }, 100);
}

// Event listener that will draw fishing line when mouse moves over screen
game.addEventListener('mousemove', createFishingLine);

// Event listener that will set the lineTo values as mouse position
game.addEventListener('click', setHookStartPosition);


// Initialize game
function initGame() {
//  create fish and board
    createFish();
    // make line
    
}

let animationRequest = null;

initGame();

// Makes game animate via looping via requestAnimationFrame() function
function gameLoop() {
    
    // Clear the canvas
    ctx.clearRect(0, 0, game.width, game.height);
    
    console.log("Fishing 'n such!");
    
    fishArr.forEach((fish, i) => {
        fishArr[i].update();
        fish.render();
    });

    fisherwoman.render();
    
    if (fishingLine && fishingLine.end_y > 50) {
        console.log('farts')
        drawFishingLine();
    }

    // check if game is over
    if (!hookIsSet) {
        console.log("Helllllllo");
        clearInterval(reelDemFish);
    }

    
    animationRequest = requestAnimationFrame(gameLoop);
    
}

gameLoop();
