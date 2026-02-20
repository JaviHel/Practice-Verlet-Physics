class Vector {
    constructor(x=0, y=0) {
        this.x = x
        this.y = y
    }

    add(v) {
        return new Vector(this.x+v.x, this.y+v.y)
    }

    sub(v) {
        return new Vector(this.x-v.x, this.y-v.y)
    }

    mul(scalar) {
        return new Vector(this.x*scalar, this.y*scalar)
    }

    mag() {
        return Math.sqrt((this.x*this.x) + (this.y*this.y))
    }

    dist(v) {
        return this.sub(v).mag()
    }

    unit() {
        if (this.mag() == 0) {
            return new Vector(0, 0)
        }
        return new Vector(this.x/this.mag(), this.y/this.mag())
    }

    limit(newMag) {
        if (this.mag() > newMag) {
            return this.unit().mul(newMag)
        } 
        return this
    }

    setMag(newMag) {
        return this.unit().mul(newMag)
    }


    static dot(v1, v2) {
        return (v1.x * v2.x) + (v1.y * v2.y)
    }

    static cross(v1, v2) {
        return (v1.x * v2.y) - (v1.y * v2.x)
    }
}