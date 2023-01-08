//2023 Levi D. Smith - levidsmith.com
const UNIT_SIZE = 16;
const ROOM_COLS = 60;
const ROOM_ROWS = 36;

class Player {
    constructor() {
        this.x = 10;
        this.y = 8;
        this.w = 1;
        this.h = 1;
        this.vel_x = 1;
        this.vel_y = 0;
        this.maxCountdown = 0.2;
        this.countdown = this.maxCountdown;

        this.tail = new PlayerTail(this.x - 1, this.y, 1);
    } 

    draw(ctx) {
        ctx.fillStyle = "#078216";
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, this.w * UNIT_SIZE, this.h * UNIT_SIZE);
        if (this.tail != null) {
            this.tail.draw(ctx);
        }
    }

    update(deltaTime) {
        this.countdown -= deltaTime;
        if (this.countdown <= 0) {
            if (this.tail != null) {
                this.tail.setPosition(this.x, this.y);
            }
            this.x += this.vel_x;
            this.y += this.vel_y;
            this.countdown += this.maxCountdown;

            if (this.checkCollision(a)) {
                iAppleCount++;
                this.tail.addTailUnits(iAppleCount + 2);
                this.maxCountdown -= 0.01;
                if (this.maxCountdown < 0.01) {
                    this.maxCountdown = 0.01;
                }
                a = new Apple();
                playSound("eat");
            }

            var tailUnit = this.tail;
            
            while (typeof tailUnit !== 'undefined') {
                if (this.checkCollision(tailUnit)) {
                    isGameOver = true;
                }
                tailUnit = tailUnit.tail;
            }
            

 
        }

        if (this.x < 0) {
            isGameOver = true;
        } else if (this.x >= ROOM_COLS) {
            isGameOver = true;
        }

        if (this.y < 0) {
            isGameOver = true;
        } else if (this.y  >= ROOM_ROWS) {
            isGameOver = true;
        }

        if (isGameOver) {
            playSound("dead");
        }

       
    }

    moveLeft() {
        if (this.vel_x == 0) {
            this.vel_x = -1;
            this.vel_y = 0;
        }
    }

    moveRight() {
        if (this.vel_x == 0) {
            this.vel_x = 1;
            this.vel_y = 0;
        }
    }

    moveUp() {
        if (this.vel_y == 0) {
            this.vel_x = 0;
            this.vel_y = -1;
        }
    }

    moveDown() {
        if (this.vel_y == 0) {
            this.vel_x = 0;
            this.vel_y = 1;
        }
    }

    checkCollision(a1) {
        return hasCollided(this.x, this.y, this.w, this.h, a1.x, a1.y, a1.w, a1.h);
    }

}

class PlayerTail {
    constructor(x, y, units) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;

        units--;

        if (units > 0) {
            this.tail = new PlayerTail(this.x, this.y, units);
        }
    } 

    draw(ctx) {
        ctx.fillStyle = "#078216";
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, this.w * UNIT_SIZE, this.h * UNIT_SIZE);
        if (this.tail != null) {
            this.tail.draw(ctx);
        }

    }

    setPosition(x, y) {
        if (this.tail != null) {
            this.tail.setPosition(this.x, this.y);
        }
        this.x = x;
        this.y = y;

    }

    addTailUnits(units) {
        if (this.tail != null) {
            this.tail.addTailUnits(units);
        } else {
            this.tail = new PlayerTail(this.x, this.y, units);
        }

    }
        

}


class Apple {
    constructor() {
        this.x = Math.floor(Math.random() * ROOM_COLS);
        this.y = Math.floor(Math.random() * (ROOM_ROWS - 1));
        this.w = 1;
        this.h = 2;
        this.vel_x = 0;
        this.vel_y = 0;
    } 


    update(deltaTime) {

    }

    draw(ctx) {
        
        ctx.fillStyle = "#821607";
        ctx.fillRect(this.x * UNIT_SIZE, this.y * UNIT_SIZE, this.w * UNIT_SIZE, this.h * UNIT_SIZE);
    }
}

//global variables
var canvas;
var ctx;
var timePrevious;

var p;
var a;
var iAppleCount;
var w;

var isGameOver;
var sounds;
var images;

function startGame() {
    canvas = document.getElementById("theCanvas");
    ctx = canvas.getContext("2d");

    timePrevious = -1;
    window.requestAnimationFrame(update);

    p = new Player();
    a = new Apple();
    iAppleCount = 0;

    isGameOver = false;

    sounds = [];
    sounds["eat"] = new Audio("assets/eat.wav");
    sounds["dead"] = new Audio("assets/dead.wav");


}


function update(timeCurrent) {
    if (timePrevious >= 0) {
        deltaTime = (timeCurrent - timePrevious) / 1000;
    } else {
        deltaTime = 0;
    }
    timePrevious = timeCurrent;

    draw();

    if (!isGameOver) {
        p.update(deltaTime);
        if (a != null) {
            a.update(deltaTime);
        }
    }

    window.requestAnimationFrame(update);
}

function draw() {
    //clear screen
    ctx.fillStyle = "#98ce9f";
    ctx.fillRect(0, 0, ROOM_COLS * UNIT_SIZE, ROOM_ROWS * UNIT_SIZE);

    p.draw(ctx);
    if (a != null) {
        a.draw(ctx);
    }

    if (isGameOver) {
        ctx.font = "128px Verdana";

        ctx.fillStyle = "#0000FF";
        ctx.fillText("Game Over", 200, 300);

    }


    ctx.font = "24px Verdana";
    ctx.fillStyle = "#821607";
    ctx.fillText("Apples: " + iAppleCount, 16, 24);


    ctx.font = "12px Verdana";
    ctx.fillStyle = "#02600d";
    ctx.fillText("Anguis - 2023 LD Smith", 64, 576);

}


document.onkeydown=function(e){
    keyPressed(e, (e||window.event).keyCode);
  }
  
document.onkeyup=function(e){
    keyReleased(e, (e||window.event).keyCode);
}

function keyPressed(e, iKey) {
    if (!isGameOver) {
        switch(iKey) {
            case 65:
            case 37:
                p.moveLeft();
                break;
            case 68:
            case 39:
                p.moveRight();
                break;
            case 87:
            case 38:
                p.moveUp();
                break;
            case 83:
            case 40:
                p.moveDown();
                break;
        }
    } else {
        switch(iKey) {
            case 32:
                startGame();
               
                break;
        }
    }

    e.preventDefault();
}

function keyReleased(iKey) {
    
}
    

function hasCollided(x1, y1, w1, h1, x2, y2, w2, h2) {
    var hasCollided = true;
    if (x1 + w1 <= x2 ||
        x1 >= x2 + w2 ||
        y1 + h1 <= y2 ||
        y1 >= y2 + h2) {
            hasCollided = false;
    }
    return hasCollided;
}


function playSound(str) {
    sounds[str].loop = false;
    sounds[str].play();
}
    