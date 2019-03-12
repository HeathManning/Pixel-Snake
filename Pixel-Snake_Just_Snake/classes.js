function SnakeSegment(pos) {
    this.pos = pos;
}

function Snake(ID, initLen, startX, startY) {
    this.ID = ID;
    this.direction = 0;
    this.segments = [new SnakeSegment(new IntVec2(startX, startY))];
    this.segmentsToAdd = initLen-1;

    this.CollisionCheck = function(direction) {
        this.direction = direction;

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

        let headPos = this.segments[0].pos.Clone().Add(new IntVec2 (x, y));
        let endIndex = this.segments.length-1
        if(this.segmentsToAdd > 0) {
            endIndex += 1;
        }
        for (i = 0; i < endIndex; i++) {
            if (this.segments[i].pos.Clone().Sub(headPos).SqrMag() == 0) {
                return true;
            }
        }
        return false;
    }

    this.FruitCheck = function() {
        for (i = 0; i < fruits.length; i++) {
            if (this.segments[0].pos.Clone().Sub(fruits[i]).SqrMag() == 0) {
                this.segmentsToAdd += 1;
                fruits.splice(i, 1);
                break;
            }
        }
    }

    this.Advance = function() {

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
        let isColliding = this.CollisionCheck(this.direction);

        if (isColliding == false) {
            this.FruitCheck();
            if (this.segmentsToAdd > 0) {
                this.segments.push(new SnakeSegment(this.segments[this.segments.length-1].pos.Clone()));
                this.segmentsToAdd--;
            }
            this.segments.unshift(this.segments[this.segments.length-1]);
            this.segments.pop();
            this.segments[0].pos = this.segments[1].pos.Clone().Add(new IntVec2(x, y));
        }
    }
}

function IntVec2(x, y) {
    this.x = Math.round(x*1);
    this.y = Math.round(y*1);

    this.Clone = function() {
        return new IntVec2(Math.round(this.x*1), Math.round(this.y*1));
    }

    this.Add = function(pos) {
        this.x = Math.round(this.x + pos.x);
        this.y = Math.round(this.y + pos.y);
        return this;
    }

    this.Sub = function(pos) {
        this.x = Math.round(this.x - pos.x);
        this.y = Math.round(this.y - pos.y);
        return this;
    }

    this.Mult = function(scal) {
        this.x = Math.round(this.x * scal);
        this.y = Math.round(this.y * scal);
        return this;
    }

    this.SqrMag = function() {
        return Math.round(this.x*this.x + this.y*this.y);
    }

    this.toString = function() {
        return this.x.toString() + " " + this.y.toString();
    }
}