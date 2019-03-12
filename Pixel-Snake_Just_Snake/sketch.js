var player = new Snake("Player", 4, Math.round(128), Math.round(128));
var fruits = [];
var fruitDensity = 0.1;
var canvas;
var pixelScale = 3;

function setup() {
    //createCanvas(window.innerWidth, window.innerHeight);
    canvas = createCanvas(256, 256);

    for(x = 0; x < width; x++) {
        for(y = 0; y < height; y++) {
            if(random() <= fruitDensity) {
                fruits.push(new IntVec2(x, y));
            }
        }
    }

    canvas.style("width", width*pixelScale+"px");
    canvas.style("height", height*pixelScale+"px");

    background(0);

    frameRate(60);

    loadPixels();
}

var stepsPerFrame = 1;

function draw() {

    background(0);

    for (i = 0; i < stepsPerFrame; i++) {
        player.Advance();
    }

    //loadPixels();

    for (i = 0; i < player.segments.length; i++) {
        set(player.segments[i].pos.x, player.segments[i].pos.y, color(255));
    }

    for (i = 0; i < fruits.length; i++) {
        set(fruits[i].x, fruits[i].y);
    }

    updatePixels();
}

var lastKey;

function keyTyped() {
    if (key === 'w' && lastKey !== 's') {
        player.direction = 2;
        lastKey = key;
    } else if (key === 'd' && lastKey !== 'a') {
        player.direction = 1;
        lastKey = key;
    } else if (key === 's' && lastKey !== 'w') {
        player.direction = 0;
        lastKey = key;
    } else if (key === 'a' && lastKey !== 'd') {
        player.direction = 3;
        lastKey = key;
    }
}

function windowResized() {
    //resizeCanvas(window.innerWidth, window.innerHeight);
}
