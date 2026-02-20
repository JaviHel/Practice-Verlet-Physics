// CLOTH SIMULATION


class MyParticle extends Particle {
    constructor(x, y) {
        super(x, y)
        this.r = 6
        this.color = "transparent"
        physics.addParticle(this)
        physics.addEffect(new AttractionEffect(this, this.r*2, -0.25))
        
    }
    
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}




class MySegment extends Segment {
    constructor(x, y, stiffness=0.5, restLength=0) {
        super(x, y, stiffness, restLength)
        this.lineWidth = 2
        physics.addSegment(this)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.particleA.pos.x, this.particleA.pos.y)
        ctx.lineTo(this.particleB.pos.x, this.particleB.pos.y)
        ctx.lineWidth = this.lineWidth
        ctx.stroke()
    }
}


// MAIN

let physics = new VerletPhysics()
physics.addEffect(new GravityEffect(new Vector(0, 0.05)))

let size = 20
let cols = Math.floor(canvas.width/size)
let rows = Math.floor(canvas.height/size)

// GRIDS
let PARTICLES = []

let offsetx = Math.floor(size/2)
let offsety = 0

for (let col = 0; col < cols; col++) {
    PARTICLES[col] = []
    for (let row = 0; row < rows; row++) {
        PARTICLES[col][row] = new MyParticle(offsetx+col*size, offsety+row*size)
    }
}

for (let col = 0; col < cols-1; col++) {
    for (let row = 0; row < rows; row++) {
        new MySegment(PARTICLES[col][row], PARTICLES[col+1][row],0.25)
    }
}

for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows-1; row++) {
        new MySegment(PARTICLES[col][row], PARTICLES[col][row+1],0.5)
    }
}

PARTICLES[0][0].lock()
PARTICLES[Math.floor((cols-1)/2)][0].lock()
PARTICLES[cols-1][0].lock()


// PARTICLES[0][rows-1].lock()
// PARTICLES[Math.floor((cols-1)/2)][rows-1].lock()
// PARTICLES[cols-1][rows-1].lock()





mx = 0;
my = 0;
let clicked = false

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let mouseVec = new Vector(mx, my)
    let rad = 10
    

    physics.getParticles().forEach(p=>{
        if (!clicked && mouseVec.dist(p.pos) < rad) {
            // physics.removeParticle(p)
            p.pos = mouseVec
        }
    })

    physics.getSegments().forEach(s=>{
        if (clicked && mouseVec.dist(s.particleB.pos) < rad) {
            physics.removeSegment(s)
        }
        if (clicked && mouseVec.dist(s.particleA.pos) < rad) {
            physics.removeSegment(s)
        }
    })
    
    clicked = false

    physics.rectBound(0, 0, canvas.width, canvas.height)

    // DRAW OBJECTS
    physics.getParticles().forEach(p=>{
        p.draw(ctx)
    })

    physics.getSegments().forEach(s=>{
        s.draw(ctx)
    })

    physics.update()
    requestAnimationFrame(animate)
}

animate()

