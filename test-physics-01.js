// CLASSES

class Particle {
    constructor(pos=new Vector(), velocity=new Vector()) {
        this.pos = pos
        this.oldPos = pos.sub(velocity)
        this.r = 8
        this.color = "black"
        // Flags
        this.isMoving = true
    }

    applyForce(vecForce) {
        if (this.isMoving) {
            this.pos = this.pos.add(vecForce)
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    move() {
        if (this.isMoving) {
            let velVec = this.pos.sub(this.oldPos)
            let newPosVec = this.pos.add(velVec)             
            this.oldPos = this.pos
            this.pos = newPosVec
        }
    }

}




class Segment {
    constructor(particleA, particleB) {
        this.particleA = particleA
        this.particleB = particleB
        this.length = particleA.pos.dist(particleB.pos)
        this.color = "black"
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.particleA.pos.x, this.particleA.pos.y)
        ctx.lineTo(this.particleB.pos.x, this.particleB.pos.y)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}


// Create a Shape class to add shapes to the handler class


                    

class Handler {
    constructor() {
        this.particles = []
        this.segments = []
        this.addShape()
        this.particles[0].isMoving = false
    }

    addShape() {
        let offsetX = 100
        let offsetY = -40
        this.particles.push(new Particle(new Vector(50+offsetX, 60+offsetY), new Vector(0, 0)))
        this.particles.push(new Particle(new Vector(100+offsetX, 60+offsetY),new Vector(0, 0)))
        this.particles.push(new Particle(new Vector(150+offsetX, 60+offsetY),new Vector(0, 0)))
        this.particles.push(new Particle(new Vector(200+offsetX, 60+offsetY),new Vector(0, 0)))
        this.particles.push(new Particle(new Vector(250+offsetX, 60+offsetY),new Vector(0, 0)))
        this.particles.push(new Particle(new Vector(300+offsetX, 60+offsetY),new Vector(0, 0)))

        // Draw Segments Between Each Particle Position
        for (let i = 0; i < this.particles.length-1; i++) {
            this.segments.push(new Segment(this.particles[i], this.particles[i+1]))
        }
    }       

    constraint() {
        for (let segment of this.segments) {
            // Segment current int-length and desire int-length
            let currLen = segment.particleA.pos.dist(segment.particleB.pos)
            let desireLen = segment.length
            let diff = currLen - desireLen

            // Unit/Normalized Vector of the current distance 
            // between particles
            let vecLen = segment.particleA.pos.sub(segment.particleB.pos).unit()
            let scaledVecLen = vecLen.mul(diff*0.5)

            // Apply the new segment/vector length
            // to the position of the particles
            if (segment.particleB.isMoving) {
                segment.particleB.pos = segment.particleB.pos.add(scaledVecLen)
            }
            if (segment.particleA.isMoving) {
                segment.particleA.pos = segment.particleA.pos.add(scaledVecLen.mul(-1))
            }
        }
    }
            

    draw(ctx) {
        // Draw particles
        for (let particle of this.particles) {
            particle.draw(ctx)
        }

        // Draw segments
        for (let segment of this.segments) {
            segment.draw(ctx)
        }
    }
    
    
    update(ctx) {        
        let constraints = 4 // More constraints means More Rigid
        for (let i = 0; i < constraints; i++) {
            this.constraint()
        }
        
        for (let particle of this.particles) {
            particle.applyForce(GRAVITY)
            particle.move()
        }
        
        this.draw(ctx)
    }
    
}


handler = new Handler()
GRAVITY = new Vector(0, 0.5)

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    handler.update(ctx)
    requestAnimationFrame(animate)
}

animate()