
class MyParticle extends Particle {
    constructor(x, y) {
        super(x, y)
        this.r = 6
        this.color = "black"
        physics.addParticle(this)
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




let physics = new VerletPhysics()
// physics.addEffect(new GravityEffect(new Vector(0, 0.05)))


// let p0 = new MyParticle(150, 150); p0.lock();

let p1 = new MyParticle(150, 150); p1.lock(false); p1.r*=2;
let p2 = new MyParticle(200, 280); 
let p3 = new MyParticle(10, 200);
let p4 = new MyParticle(20, 10);
let p5 = new MyParticle(280, 10);



let segLen = 40
// new MySegment(p1, p2, 0.025, segLen)
// new MySegment(p2, p3, 0.025, segLen)
// new MySegment(p3, p4, 0.025, segLen)
// new MySegment(p4, p5, 0.025, segLen)
// new MySegment(p4, p2, 0.25, segLen)
// new MySegment(p5, p3, 0.25, segLen)


physics.addEffect(new AttrationEffect(p1, 20, -10))
physics.addEffect(new AttrationEffect(p2, 20, -0.9))
physics.addEffect(new AttrationEffect(p3, 20, -0.9))
physics.addEffect(new AttrationEffect(p4, 20, -0.9))
physics.addEffect(new AttrationEffect(p5, 20, -0.9))

// physics.addEffect(new AttrationEffect(new MyParticle(100, 250), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(70, 240), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(80, 10), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(260, 20), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(280, 40), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(290, 30), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(270, 20), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(210, 10), 20, -1))
// physics.addEffect(new AttrationEffect(new MyParticle(200, 40), 20, -1))

let mx = 150;
let my = 150;

                
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let mouseVec = new Vector(mx, my)
    p1.pos = mouseVec

                  
    // physics.rectBound(10, 10, canvas.width-10, canvas.height-10)
    physics.rectBounce(0, 0, canvas.width, canvas.height)
    
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



// CREATE A MOUSE CLASS TO USE THE MOUSE EASY


function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)
