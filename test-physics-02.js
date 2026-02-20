// CLASSES

class Particle {
    constructor(x=0, y=0, vx=0, vy=0, radius=2) {
        this.pos = new Vector(x, y)
        this.oldPos = this.pos.sub(new Vector(vx, vy))
        this.r = radius
        this.color = "black"
        // Flags
        this.isMoving = true
    }

    applyForce(vecForce) {
        if (this.isMoving) {
            this.pos = this.pos.add(vecForce)
        }
    }

    bounceWalls() {
        
        if (this.pos.x < this.r) {
            this.pos.x = this.r
            this.oldPos.x = this.pos.x + (this.pos.x-this.oldPos.x)
        }

        if (this.pos.x > canvas.width-this.r) {
            this.pos.x = canvas.width-this.r
            this.oldPos.x = this.pos.x + (this.pos.x-this.oldPos.x)
        }

        if (this.pos.y < this.r) {
            this.pos.y = this.r
            this.oldPos.y = this.pos.y + (this.pos.y-this.oldPos.y)
        }

        if (this.pos.y > canvas.height-this.r) {
            this.pos.y = canvas.height-this.r
            this.oldPos.y = this.pos.y + (this.pos.y-this.oldPos.y)
        }
        
    }
    
    move() {
        if (this.isMoving) {
            let velVec = this.pos.sub(this.oldPos)
            let newPosVec = this.pos.add(velVec)             
            this.oldPos = this.pos
            this.pos = newPosVec
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update(ctx) {
        this.bounceWalls()
        this.move()
        this.draw(ctx)
    }
}




class Segment {
    constructor(particleA, particleB) {
        this.particleA = particleA
        this.particleB = particleB
        this.length = particleA.pos.dist(particleB.pos)
        this.color = "black"

        this.constraintLvl = 1
    }

    constraint() {
        // Segment current int-length and desire int-length
        let currLen = this.particleA.pos.dist(this.particleB.pos)
        let desireLen = this.length
        let diff = currLen - desireLen

        // Unit/Normalized Vector of the current distance 
        // between particles
        let vecLen = this.particleA.pos.sub(this.particleB.pos).unit()
        let scaledVecLen = vecLen.mul(diff/2)

        // Apply the new segment/vector length
        // to the position of the particles
        if (this.particleB.isMoving) {
            this.particleB.pos = this.particleB.pos.add(scaledVecLen)
        }
        if (this.particleA.isMoving) {
            this.particleA.pos = this.particleA.pos.add(scaledVecLen.mul(-1))
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.particleA.pos.x, this.particleA.pos.y)
        ctx.lineTo(this.particleB.pos.x, this.particleB.pos.y)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

    update(ctx) {
        // More constraints means More Rigid
        for (let i = 0; i < this.constraintLvl; i++) {
            this.constraint()
        }
        
        this.draw(ctx)
    }
}


// From a list of particles you create a shape
// From the partilces you create the segments
class Shape {
    constructor(x=0, y=0) {
        this.particles = []
        this.segments = []
        SHAPES.push(this)
    }

    move() {}

    draw(ctx) {
        if (this.particles.length >= 2) {
            
            this.particles.forEach(p=>{
                p.update(ctx)
            })
            
            this.segments.forEach(s=>{
                s.update(ctx)
            })
        }
    }
}


class Rectangle extends Shape {
    constructor(x, y, w, h) {
        super()
        this.vx = Math.floor(Math.random()*10)-5
        this.vy = Math.floor(Math.random()*10)-5
        
        this.particles = [
            new Particle(x, y, this.vx, this.vy),
            new Particle(x+w, y, this.vx, this.vy),
            new Particle(x+w, y+h, -this.vx, this.vy),
            new Particle(x, y+h, -this.vx, -this.vy)
        ]

        this.segments = [
            new Segment(this.particles[0], this.particles[1]),
            new Segment(this.particles[1], this.particles[2]),
            new Segment(this.particles[2], this.particles[3]),
            new Segment(this.particles[3], this.particles[0]),
            new Segment(this.particles[0], this.particles[2]),
            new Segment(this.particles[1], this.particles[3]),
        ]
    }

    update(ctx) {
        this.move()
        this.draw(ctx)
    }
}


class Triangle extends Shape {
    constructor(x, y, s) {
        super()
        this.vx = Math.floor(Math.random()*10)-5
        this.vy = Math.floor(Math.random()*10)-5
        
        
        this.particles = [
            new Particle(x, y, this.vx, this.vy),
            new Particle(x+s, y, this.vx, this.vy),
            new Particle(x+s, y+s, -this.vx, this.vy),
        ]

        this.segments = [
            new Segment(this.particles[0], this.particles[1]),
            new Segment(this.particles[1], this.particles[2]),
            new Segment(this.particles[2], this.particles[0]),
        ]
    }

    update(ctx) {
        this.move()
        this.draw(ctx)
    }
}


class Chain extends Shape{
    constructor(x=0, y=0, numOfPoints=2, distBetPoints=1) {
        super()
        this.createParticles(x, y, numOfPoints, distBetPoints)       
        this.createSegments()
        // this.particles[this.particles.length-1].isMoving = false
    }

    createParticles(x, y, nop, dbp) {
        for (let i = 0; i < nop; i++) {
            this.particles.push(new Particle(x+i, y+i*dbp,))
        }
    }

    createSegments() {
        for (let i = 0; i < this.particles.length-1; i++) {
            this.segments.push(
                new Segment(this.particles[i], this.particles[i+1])
            )
        }
    }

    update(ctx) {
        this.draw(ctx)
    }
    
}





// Each shape is a list of particles
// SHAPES stores each list of particles/shape
// to update its movement later
let SHAPES = []


let GRAVITY = new Vector(0, 0.05)

new Chain(120, 200, 50, 10)
new Rectangle(40, 40, 60, 40)
new Rectangle(150, 200, 50, 50)
new Triangle(150, 250, 80)



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    SHAPES.forEach(shape=>{
        // shape.particles[randInt(0, SHAPES.length-1)].pos.x += Math.random()-0.5
        // shape.particles[randInt(0, SHAPES.length-1)].pos.y += Math.random()-0.5
        shape.update(ctx)
    })
    
    requestAnimationFrame(animate)
}

animate()



function randInt(min, max) {
    return Math.floor(Math.random()*max)+min
}


// Control one particle of an object

let obj = SHAPES[0].particles[0]
let vel = 0.5

function stick(e) {
    if (e.key == "w") {
        obj.pos.y += -vel
    }
    
    if (e.key == "s") {
        obj.pos.y += vel
    }

    if (e.key == "a") {
        obj.pos.x += -vel
    }

    if (e.key == "d") {
        obj.pos.x += vel
    }
    
    obj.color = "red"
}

window.addEventListener("keydown", stick)