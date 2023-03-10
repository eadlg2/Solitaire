class Card {
    constructor(x, y, sketch, front = false, back = false, suit = 0, value = 0, flipped = false) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.sketch = sketch;
        if (this.sketch.width < 800) {
            this.w = this.sketch.width / 10;
            this.h = this.sketch.height / 10;
        } else {
            this.w = 100;
            this.h = 140;
        }
        this.r = 5;
        this.offsetX = 0;
        this.offsetY = 0;
        this.moving = false;
        this.front = front;
        this.back = back;
        if (this.front && this.back) {
            front.resize(this.w, this.h);
            back.resize(this.w, this.h);
        } else if (this.front) {
            front.resize(this.w, this.h);
        }
        this.suit = suit;
        this.value = value;
        this.flipped = flipped;
        this.speed = 3;
        this.dirX = this.sketch.random(-1, 1);
        this.dirY = this.sketch.random(-1, 1);
    }

    show() {
        if (this.front && this.back) {
            if (this.flipped) {
                this.sketch.image(this.front, this.x, this.y);
                this.sketch.noFill();
            } else {
                this.sketch.image(this.back, this.x, this.y);
                this.sketch.noFill();
            }
        } else if (this.front) {
            this.sketch.fill(255, 255, 255, 50);
            this.sketch.image(this.front, this.x, this.y);
        } else {
            this.sketch.fill(255, 255, 255, 50);
        }
        this.sketch.rect(this.x, this.y, this.w, this.h, this.r);
    }

    bounce() {
        this.x += this.speed * this.dirX;
        this.y += this.speed * this.dirY;

        if (this.x > this.sketch.width - this.w || this.x < 0) {
            this.dirX *= -1;
        }
        if (this.y > this.sketch.height - this.h || this.y < 0) {
            this.dirY *= -1;
        }
    }

    move(tab = false) {
        let checkY;

        if (tab) {
            checkY = this.y + 30; 
        } else {
            checkY = this.y + this.h;
        }

        if ((this.sketch.mouseX > this.x && this.sketch.mouseX < this.x + this.w)
            && (this.sketch.mouseY > this.y && this.sketch.mouseY < checkY) && this.flipped) {
            this.moving = true;
            this.offsetX = this.x - this.sketch.mouseX;
            this.offsetY = this.y - this.sketch.mouseY;
        }
    }

    forceMove() {
        this.moving = true;
        this.offsetX = this.x - this.sketch.mouseX;
        this.offsetY = this.y - this.sketch.mouseY;  
    }

    released() {
        this.moving = false;
    }

    update() {
        if (this.moving) {
            this.x = this.sketch.mouseX + this.offsetX;
            this.y = this.sketch.mouseY + this.offsetY;
        }
    }

    return() {
        if (this.moving) {
            this.x = this.startX;
            this.y = this.startY;
        }
    }

    confirm(newX, newY, location) {
        if (this.moving) {
            this.startX = newX;
            this.startY = newY;
            this.x = newX;
            this.y = newY;

            location.push(this);

            return 0;
        }

        return -1;
    }
}