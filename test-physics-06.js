// CLOTH SIMULATION
// PAINT SQUARES
// KALEIDOSCOPE


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
physics.addEffect(new GravityEffect(new Vector(0.025, 0)))

let size = 16
let width = 250
let height = 150
let cols = Math.floor(width/size)
let rows = Math.floor(height/size)

let offsetx = 20
let offsety = 50


// CREATE PARTICLES IN A GRID LIKE PATTERN
let GRID = []
let PARTICLES = []

for (let col = 0; col < cols; col++) {
    GRID[col] = []
    PARTICLES[col] = []
    for (let row = 0; row < rows; row++) {
        GRID[col][row] = "darkblue"
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


// Lock Particles If Needed

PARTICLES[0][0].lock()
// PARTICLES[Math.floor((cols-1)/2)][0].lock()
// PARTICLES[cols-1][0].lock()


PARTICLES[0][rows-1].lock()
// PARTICLES[Math.floor((cols-1)/2)][rows-1].lock()
// PARTICLES[cols-1][rows-1].lock()





// FILL EACH SQUARE INSIDE THE CLOTH
function fillSquare(x, y, color) {
    // ctx.save()
    ctx.beginPath()
    ctx.moveTo(PARTICLES[x][y].pos.x, 
               PARTICLES[x][y].pos.y)
    
    ctx.lineTo(PARTICLES[x+1][y].pos.x, 
               PARTICLES[x+1][y].pos.y)
    
    ctx.lineTo(PARTICLES[x+1][y+1].pos.x,
               PARTICLES[x+1][y+1].pos.y)
    
    ctx.lineTo(PARTICLES[x][y+1].pos.x,
               PARTICLES[x][y+1].pos.y)
    ctx.closePath()
    
    // ctx.strokeStyle = "blue"
    ctx.fillStyle = color
    ctx.fill()
    // ctx.stroke()
    // ctx.restore()
}


// // KALEIDOSCOPE ALGORITHM

function updateColor(x=0, y=0, color="cyan") {
    GRID[x][y] = color
    GRID[cols-1-x][y] = color
    GRID[x][rows-1-y] = color
    GRID[cols-1-x][rows-1-y] = color
}


// KALEIDOSCOPE VARIABLES

// random-x and random-y position
let rx = Math.floor(Math.random()*cols)
let ry = Math.floor(Math.random()*rows)

// Speed
let dx = 1
let dy = 1

// Change color
let hue = Math.floor(Math.random()*360)
let color;




// MOUSE VARIABLES
mx = 0;
my = 0;
clicked = false


// ANIMATION LOOP

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // VERLET SIMULATION LOGIC
    
    let mouseVec = new Vector(mx, my)
    let rad = 10

    physics.getParticles().forEach(p=>{
        if (!clicked && mouseVec.dist(p.pos) < rad) {
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

    // physics.rectBound(0, 0, canvas.width, canvas.height)

    // DRAW PARTICLES & SEGMENTS
    // physics.getParticles().forEach(p=>{
    //     p.draw(ctx)
    // })

    physics.getSegments().forEach(s=>{
        s.draw(ctx)
    })
    
    physics.update()


    

    // KALEIDOSCOPE LOGIC

    // Change color
    color = `hsl(${hue}, 50%, 50%)`
    hue += 2 % 360

    rx += dx
    ry += dy
    
    dx = randomChoice([1, -1])
    dy = randomChoice([1, -1])
     
    rx = Math.abs(rx%cols)
    ry = Math.abs(ry%rows)
    
    updateColor(rx, ry, color)
    

    // // DRAW KALEIDOSCOPE GRID
    for (let col = 0; col < cols-1; col++) {
         for (let row = 0; row < rows-1; row++) {
            let newColor = GRID[col][row]
            fillSquare(col, row, newColor)
        }   
    }
    
    requestAnimationFrame(animate)
}

animate()



// CREATE A MOUSE CLASS TO USE THE MOUSE EASY




function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)



function mouseClick(e) {
    mx = e.offsetX 
    my = e.offsetY
    clicked = true
}


canvas.addEventListener("mousedown", mouseClick)

