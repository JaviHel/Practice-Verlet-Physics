// Bounce Balls Using Verlet Integration


class Circle {
    constructor(position=new Vector(), velocity=new Vector(), radius=16) {
        this.pos = position
        this.oldPos = position.sub(velocity)
        this.dt = 0.1
        
        this.r = radius
        this.color = "red"
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
        // Verlet integration
        // vel = pos - oldPos
        let vel = this.pos.sub(this.oldPos)
        // pos = pos + vel
        this.pos = this.pos.add(vel.limit(2))
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


COLORS = ["green", "blue", "cyan", "black", "gold"]

function coll_det_cc(c1, c2) {
    if (c1.pos.dist(c2.pos) <= c1.r + c2.r) {
        return true
    }
    return false
}

function pen_res_cc(c1, c2) {
    let distVec = c1.pos.sub(c2.pos)
    let penDepth = (c1.r + c2.r) - distVec.mag()
    let penRes = distVec.unit().mul(penDepth/2)
    c1.pos = c1.pos.add(penRes)
    c2.pos = c2.pos.add(penRes.mul(-1))
}

function col_res_cc(c1, c2) {
    // c1.pos and c2.pos are vectors
    let normal = c1.pos.sub(c2.pos).unit()
    let relVel = c1.pos.sub(c1.oldPos).sub(c2.pos.sub(c2.oldPos))
    let sepVel = Vector.dot(relVel, normal)
    let newSepVel = -sepVel
    let sepVelVec = normal.mul(newSepVel)
    
    c1.oldPos = c1.pos.sub(sepVelVec)
    c2.oldPos = c2.pos.sub(sepVelVec.mul(-1))
}



PARTICLES = []

let numOfPart = 10

for (let i = 0; i < numOfPart; i++) {
    let rx = Math.floor(Math.random()*(canvas.width-32))+16
    let ry = Math.floor(Math.random()*(canvas.height-32))+16
    let rad = Math.floor(Math.random()*10)+5
    PARTICLES.push(new Circle(new Vector(rx, ry),
                              new Vector(rx-150, ry-150).unit(),
                              rad))
    
    // PARTICLES.push(new Particle(new Vector(150, 150),
    //                             new Vector(-0.2, 0.1).unit()))
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for (let p1 of PARTICLES) {
        for (let p2 of PARTICLES) {
            if (p1 != p2 && coll_det_cc(p1, p2)) {
                pen_res_cc(p1, p2)
                col_res_cc(p1, p2)
                // p1.color = COLORS[Math.floor(Math.random()*COLORS.length)]
            }
        }
        p1.update(ctx)
    }
    
    requestAnimationFrame(animate)
}

animate()




















