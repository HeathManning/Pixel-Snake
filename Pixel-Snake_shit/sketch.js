var player = new Snake("Player", 256, Math.round(window.innerWidth/2), Math.round(window.innerHeight/2));
var fruits = [];
var numOfFruits = 4096;

const modelViewportRadius = 8;
const model = tf.sequential();
model.add(tf.layers.dense({units: 16, inputShape: [modelViewportRadius*4*modelViewportRadius], name: "hidden_layer"}));
model.add(tf.layers.dense({units: 4, name: "output_layer"}));
console.log(JSON.stringify(model.outputs[0].shape));
//model.add(tf.layers.dense({units: 1}));
//model.summary();
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

function setup() {
    for (i = 0; i < numOfFruits; i++) {
        fruits.push(new IntVec2(Math.round(random()*window.innerWidth), random()*Math.round(window.innerHeight)));
    }

    createCanvas(window.innerWidth, window.innerHeight);

    background(0);

    frameRate(1);

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
        //set(fruits[i].x, fruits[i].y);
    }

    let modelViewport = [];
    let startPos = player.segments[0].pos.Clone().Sub(new IntVec2(modelViewportRadius, modelViewportRadius));

    for (ix = startPos.x; ix < startPos.x+modelViewportRadius*2; ix++) {
        modelViewport.push([]);
        for (iy = startPos.y; iy < startPos.y+modelViewportRadius*2; iy++) {
            modelViewport[ix-startPos.x][iy-startPos.y] = (get(ix, iy) != [0, 0, 0, 255]);
        }
    }

    updatePixels();

    async function trainModel() {
        const inputTensor = tf.tensor(modelViewport.flat(), [1, modelViewportRadius*4*modelViewportRadius], "bool");

        const desiredOutput = tf.tensor([
            player.direction != 2 && player.Advance(0),
            player.direction != 3 && player.Advance(1),
            player.direction != 0 && player.Advance(2),
            player.direction != 1 && player.Advance(3),
        ], [1,4], "bool");

        const h = await model.fit(inputTensor, desiredOutput, {batchSize: 1});
        console.log(h.history.loss);
        const out = await model.predictOnBatch(inputTensor);
        return out;
    }

    var waiting = true;
    trainModel().then((value) => {
        const eval = value;
        waiting = false;

        eval.print();
    });

    noLoop();
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
    resizeCanvas(window.innerWidth, window.innerHeight);
}
