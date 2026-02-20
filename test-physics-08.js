// CREATE A BOX (Particle wrapper)
const physics = new VerletPhysics()
let gravity = new Vector(0.001, 0.05)
// physics.addEffect(new GravityEffect(gravity))


// Node used to create the box
class Node extends Particle {
    constructor(x, y, radius) {
        super(x, y)
        this.id = null
        this.display = true
        this.radius = radius
        this.color = "blue"
        physics.addParticle(this)
        // physics.addEffect(new AttractionEffect(this, this.radius*2, 0.25,))
        physics.addEffect(new AttractionEffect(this, 0, -0.9, true))
        
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.strokeStyle = "black"
        ctx.fill()
        // ctx.stroke()
    }
}

class Line extends Segment {
    constructor(nodeA, nodeB, stiffness, restLength, ) {
        super(nodeA, nodeB, stiffness, restLength)
        this.id = null
        this.display = true
        this.color = "black"
        physics.addSegment(this)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.pA.pos.x,this.pA.pos.y)
        ctx.lineTo(this.pB.pos.x,this.pB.pos.y)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}




// CREATE SQUARE WITH CIRCLES INSIDE
// Circuare, Squircle, Cuadrilculo
class Square {
    static ID = 10
    constructor(x, y, sz) {
        this.ID = Square.ID
        // Visualization Points
        this.x = x
        this.y = y
        this.sz = sz
        
        // Particles
        // Middle Circle Variables
        this.cx = Math.floor(sz*0.5)
        this.cy = Math.floor(sz*0.5)
        this.cr = this.cx
        this.p0 = new Node(this.x+this.cx, this.y+this.cy, this.cr)
        // Vertices Circles
        this.r = Math.floor(this.cr*0.4)
        this.p1 = new Node(this.x+this.r, this.y+this.r, this.r)
        this.p2 = new Node(this.x+(sz-this.r), this.y+this.r, this.r)
        this.p3 = new Node(this.x+(sz-this.r), this.y+(sz-this.r), this.r)
        this.p4 = new Node(this.x+this.r, this.y+(sz-this.r), this.r)
        this.vertices = [this.p0, this.p1, this.p2, this.p3, this.p4]
        // Segments - Center to sides
        this.s1 = new Line(this.p0, this.p1)
        this.s2 = new Line(this.p0, this.p2)
        this.s3 = new Line(this.p0, this.p3)
        this.s4 = new Line(this.p0, this.p4)
        // Sides to Sides
        this.s5 = new Line(this.p1, this.p2, 0.5) 
        this.s6 = new Line(this.p2, this.p3, 0.5)
        this.s7 = new Line(this.p3, this.p4, 0.5)
        this.s8 = new Line(this.p4, this.p1, 0.5)
        this.sides = [this.s1, this.s2, this.s3, this.s4,
                      this.s5, this.s6, this.s7, this.s8]
        
        this.vertices.forEach(p=>{
            p.ID = Square.ID
        })
        Square.ID+=1
    }

    draw(ctx) {
        this.vertices.forEach(p=>{
            p.draw(ctx)
        })
    }
}




let node1 = new Node(50, 10, 30)
let node2 = new Node(250, 250, 30)
node1.oldPos = new Vector(-1, -1)

// physics.addEffect(new AttractionEffect(node1, 20, -1,))


// let line1 = new Line(new Node(20, 60), new Node(140, 100))
// line1.pA.lock()
// line1.pB.lock()

// let line2 = new Line(new Node(20, 120), new Node(140, 180))
// line2.pB.lock()
// line2.pB.lock()




let sq1 = new Square(20, 10, 60)
let sq2 = new Square(40, 80, 80)
let sq3 = new Square(100, 170, 50)
let sq4 = new Square(160, 100, 100)



// console.log(sq1.id, sq2.id, sq3.id, sq4.id)



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // b1.draw(ctx)
    // b2.draw(ctx)
    // b3.draw(ctx)
    // b4.draw(ctx)

    node1.draw(ctx)
    node2.draw(ctx)
    // line1.draw(ctx)
    
    sq1.draw(ctx)
    sq2.draw(ctx)
    sq3.draw(ctx)
    sq4.draw(ctx)
    
    

    
    physics.rectBounce(0, 0, canvas.width, canvas.height)
    physics.update()
    requestAnimationFrame(animate)
}

animate()





// UTILITY METHODS OUTSIDE THE VERLET PHYSICS

// PARTICLE-SEGMENT COLLISION DETECTION

function closestPointPS(p, s) {
    // Unit Vector of the segment-pB to the segment-pA position
    let segUnit = s.particleB.pos.sub(s.particleA.pos).unit()
    
    // Vector from the par to the segment-pA position 
    let parToSegPA = s.particleA.pos.sub(p.pos)
    if (Vector.dot(segUnit, parToSegPA) > 0) {
        return s.particleA.pos
    }

    // Vector from segment-pB position to the par position
    let segPBToPar = p.pos.sub(s.particleB.pos)
    if (Vector.dot(segUnit, segPBToPar) > 0) {
        return s.particleB.pos
    }

    let closestDist = Vector.dot(segUnit, parToSegPA)
    let closestVect = segUnit.mul(closestDist)
    return s.particleA.pos.sub(closestVect)
}

function colDetPS(p, s) {
    let parClosest = closestPointPS(p, s).sub(p.pos)
    if (parClosest.mag() < p.radius) {
        return true
    }
    return false
}

function penResPS(p, s, radius=2) {
    let penVec = p.pos.sub(closestPointPS(p, s))
    p.pos = p.pos.add(penVec.unit().mul(radius-penVec.mag()))
}




