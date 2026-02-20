// r, g, b = 255, int(self.pos.y*0.86), int(self.pos.y*0.25) // y = 0 to 300
let TIMER = 0

// This has to be a point
class MyParticle {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.dx = randint(6)-3
        this.dy = randint(6)-3
        this.radius = radius
        this.color = randColor()
    }

    move() {
        this.x += this.dx
        this.y += this.dy
    }
    
    draw(ctx) {
        let [r, g, b] = [255, sineInt(300, TIMER%90, 2,)*0.5+50, sineInt(300, TIMER, 8,)*0.01] // this.y goes from 0 - 400
        this.color = `rgb(${r}, ${g}, ${b})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}



// this will draw and handle fx
class ParticleExplotion {
    constructor() {
        this.numberOfParticles = 10
        this.particles = []
        this.createParticles()
    }
    

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }
    
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new MyParticle(mx, my, 12))
        }
    }

    fx() {
        this.particles.forEach(p=>{
            p.move()

            p.radius -= 0.5

            if (p.radius < 2) {
                this.removeParticle(p)
            }
        })

        if (this.particles.length <= 0) {
            this.createParticles()
        }
    }

            
    draw(ctx) {
        this.particles.forEach(p=>{
            p.draw(ctx)
        })
    }

    update() {
        this.draw(ctx)
        this.fx()
    }
}





class Trail {
    constructor() {
        this.particles = []
        this.duration = 100
    
        this.createParticle()
    }
    
    createParticle() {
        this.particles.push(new MyParticle(mx, my, 12))
    }
    
    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    draw(ctx) {
        this.particles.forEach(p=>{
            p.draw(ctx)
        })
    }

    fx() {
        this.particles.forEach(p=>{
            p.radius -= 1
            
            if (this.particles.length >= 10) {
                this.removeParticle(p)
            }

        })

        this.createParticle()
        
    }
    
    update() {
        this.draw(ctx)
        this.fx()
    }
}




class Pulse {
    constructor(p1) {
        this.p1 = p1 
        this.color = "red"
        this.value = 0
        this.maxim = 60
        
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.p1.x, this.p1.y, this.p1.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    fx() {
        let freq = 4
        // let angle = Math.floor(Math.sin(radians(this.value*freq))*this.maxim)+this.maxim
        let angle = sineInt(this.maxim, this.value, freq)
        this.color = `hsl(${50}, ${angle+40}%, ${60}%)`
        this.value += 1
        this.value > 360? this.value = 0: false;
        
    }

    update() {
        this.draw(ctx)
        this.fx()
    }
}




function sineInt(max, angle, freq=1, offset=0) {
    // returns a sine interpolation of numbers between 0 and max
    // the angle is used to interpolate dynamically
    // the freq is a scalar float to change the speed
    // offset moves the range of values maintaining the interpolation distance
    let sine = Math.floor(Math.sin(radians(angle*freq))*(max/2))+(max/2)
    return sine + offset
}





// MOUSE VARIABLES
mx = 150;
my = 150;


let pe = new ParticleExplotion()
let trail = new Trail()
let pulse = new Pulse(new MyParticle(mx, my, 20))


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    
    pulse.update()
    TIMER += 1
    TIMER>=1000? TIMER = 0: false;
    requestAnimationFrame(animate)
}

animate()







            

function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)




function radians(degrees) {
    return degrees*(Math.PI/180)
}