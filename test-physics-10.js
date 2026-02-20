class Circle extends Particle {
    static ID = 100
    constructor(x, y) {
        super(x, y)
        this.radius = randint(30)+5
        this.color = randColor()
        physics.addParticle(this)
        // physics.addEffect(new AttractionEffect(this, 0, 0.05,)) // Atract
        physics.addEffect(new AttractionEffect(this, 0, -1,)) // repulse
    }
    
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}



class Attractor extends Particle {
    constructor(x, y) {
        super(x, y)
        this.radius = randint(30)+5
        this.color = randColor()
        physics.addParticle(this)
        physics.addEffect(new AttractionEffect(this, 100, 0.5, true)) // Attract
        // physics.addEffect(new AttractionEffect(this, 0, -15,))// Repulse
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}



                                               



const physics = new VerletPhysics()
physics.addEffect(new GravityEffect(new Vector(0, 0.2)))

let att1 = new Attractor(150, 150)

mx = 0
my = 0
mcx = 0
mcy = 0

let mouseVec = new Vector()


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    mouseVec.x = mx
    mouseVec.y = my
    att1.pos = mouseVec
    
    if (clicked) {
        new Circle(mcx, mcy)
    }
    clicked = false

    physics.getParticles().forEach(p=>{
        p.draw(ctx)
    })
    
    physics.rectBounce(-400, 0, canvas.width+400, canvas.height)
    physics.update()
    requestAnimationFrame(animate)
}

animate()








