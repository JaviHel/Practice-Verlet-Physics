// BEE ATTACK
const physics = new VerletPhysics()
// physics.addEffect(new GravityEffect(new Vector(0, 0.5)))


class Node extends Particle {
    constructor(x, y) {
        super(x, y)
        this.radius = 5
        this.color = "black"
        physics.addParticle(this)
        physics.addEffect(new AttractionEffect(this, 8, -1))
        
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

class Line extends Segment {
    constructor(nodeA, nodeB, stiffness, restLength) {
        super(nodeA, nodeB, stiffness, restLength)
        this.color = "black"
        physics.addSegment(this)
    }
}


class Attractor extends Particle {
    constructor(x, y) {
        super(x, y)
        this.radius = 20
        this.color = "brown"
        physics.addParticle(this)
        physics.addEffect(new AttractionEffect(this, 200, 0.5,true)) // Attract
        physics.addEffect(new AttractionEffect(this, 2, -15,))// Repulse
    }
    
    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}



let attr = new Attractor(150, 150); attr.lock(false);



for (let i = 0; i < 50; i++) {
    let x = (Math.floor(Math.random()*250)+20)
    let y = (Math.floor(Math.random()*250)+20)
    new Node(x, y)
}






function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    physics.getParticles().forEach(p=>{
        p.draw(ctx)
    })
    physics.rectBounce(0, 0,canvas.width,canvas.height, 5)
    physics.update()
    requestAnimationFrame(animate)
}
animate()



















