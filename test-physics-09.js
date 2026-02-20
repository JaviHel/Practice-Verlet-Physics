class Circle extends Particle {
    constructor(x, y, r) {
        super(x, y)
        this.radius = r
        this.color = "black"
        physics.addParticle(this)
        // physics.addEffect(new AttractionEffect(this, 100, 0.5))
        // physics.addEffect(new AttractionEffect(this, 20, -2))
        
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}


class Spring extends Segment {
    constructor(p1, p2, stiffness, restLength) {
        super(p1, p2, stiffness, restLength)
        this.color = "black"
        physics.addSegment(this)
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.pA.pos.x, this.pA.pos.y)
        ctx.lineTo(this.pB.pos.x, this.pB.pos.y)
        ctx.strokeStyle = this.color
        ctx.stroke()
    }
}


let physics = new VerletPhysics()
// physics.addEffect(new GravityEffect(new Vector(0, 1)))


// Create Circles
let numOfCircles = 10 

for (let i = 0; i < numOfCircles; i++) {
    let x = randint(250)+50
    let y = randint(250)+50
    new Circle(x, y, 5)
}


// Create Springs
for (let c1 of physics.getParticles()) {
    for (let c2 of physics.getParticles()) {
        if (c1 != c2) {
            new Spring(c1, c2, 0.05, 100)
        }
    }
}


    

mx = 150
my = 150


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let mouseVec = new Vector(mx, my)
    let rad = 20
    

    physics.getParticles().forEach(p=>{
        // if (mouseVec.dist(p.pos) < rad) {
        //     p.pos = mouseVec
        // }
        p.draw(ctx)
    })

    physics.getSegments().forEach(s=>{
        s.draw(ctx)
    })
    
    physics.rectBound(0, 0, canvas.width, canvas.height)
    physics.update()
    requestAnimationFrame(animate)
}


animate()


function mousePos(e) {
    mx = e.offsetX
    my = e.offsetY
}
canvas.addEventListener("mousemove", mousePos)



function randint(n) {
    return Math.floor(Math.random()*n)
}








