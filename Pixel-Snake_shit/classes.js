function SnakeSegment(pos) {
    this.pos = pos;
}

function Snake(ID, initLen, startX, startY) {
    this.ID = ID;
    this.direction = 0;
    this.segments = [new SnakeSegment(new IntVec2(startX, startY))];
    this.segmentsToAdd = initLen-1;

    this.Advance = function(direction) {
        if (direction !== null) {
            this.direction = direction;
            var dirTest = true;
        }

        var x, y;
        if (this.direction == 0) {
            x = 0;
            y = 1;
        } else if (this.direction == 1) {
            x = 1;
            y = 0;
        } else if (this.direction == 2) {
            x = 0;
            y = -1;
        } else if (this.direction == 3) {
            x = -1;
            y = 0;
        }
        
        //check for collisions before moving snake
        let headPos = this.segments[0].pos.Clone().Add(new IntVec2 (x, y));
        let isColliding = false;
        for (i = 0; i < this.segments.length-1; i++) {
            if (this.segments[i].pos.Clone().Sub(headPos).SqrMag() == 0) {
                isColliding = true;
            }
        }

        if(dirTest == false) {

            for (i = 0; i < fruits.length; i++) {
                if (this.segments[0].pos.Clone().Sub(fruits[i]).SqrMag() == 0) {
                    print("fruit hit");
                    this.segmentsToAdd += 1;
                    fruits[i] = new IntVec2(Math.round(random()*window.innerWidth), random()*Math.round(window.innerHeight));
                }
            }

            if (isColliding == false) {
                if (this.segmentsToAdd > 0) {
                    this.segments.push(new SnakeSegment(this.segments[this.segments.length-1].pos.Clone()));
                    this.segmentsToAdd--;
                }
                this.segments.unshift(this.segments[this.segments.length-1]);
                this.segments.pop();
                this.segments[0].pos = this.segments[1].pos.Clone().Add(new IntVec2(x, y));
            }
        
        }

        return isColliding;
    }
}

function IntVec2(x, y) {
    this.x = x*1;
    this.y = y*1;

    this.Clone = function() {
        return new IntVec2(this.x*1, this.y*1);
    }

    this.Add = function(pos) {
        this.x += pos.x;
        this.y += pos.y;
        return this;
    }

    this.Sub = function(pos) {
        this.x -= pos.x;
        this.y -= pos.y;
        return this;
    }

    this.Mult = function(scal) {
        this.x *= scal;
        this.y *= scal;
        return this;
    }

    this.SqrMag = function() {
        return this.x*this.x + this.y*this.y;
    }

    this.toString = function() {
        return this.x.toString() + " " + this.y.toString();
    }
}