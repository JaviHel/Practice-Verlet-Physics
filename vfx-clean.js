let GLOBAL_TIMER = 0

// FIX TRAIS - FIX TRAIS - FIX TRAILS -

// FX PRIMITIVES
class Point {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.speed = 10
        this.dx = randint(this.speed)-this.speed/2
        this.dy = randint(this.speed)-this.speed/2
        this.radius = radius

        this.color = "red"
    }
}

// this (-) is a dash
class Dash {
    constructor(x, y, length) {
        this.x = x
        this.y = y
        this.speed = 10
        this.dx = randint(this.speed)-this.speed/2
        this.dy = randint(this.speed)-this.speed/2
        this.length = length
        this.oriented = randomChoice([/*"top", "bottom", "left", "right",*/
                                      "topleft","topright","bottomleft","bottomright"])
    }
}


class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2

        this.color = "lawngreen"
        this.lineWidth = 4
    }


    draw(ctx) {
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.color
        
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)

        ctx.stroke()
    }
}

/*##########################################################################*/


// Handle primitives to create EFFECTS
class Explotion {
    constructor(x, y, radius=20) {
        this.x = x
        this.y = y
        this.radius = radius
        this.fillColor = "red"
        this.duration = 10
        
        this.particles = []
        this.numberOfParticles = 10
        this.createParticles(this.numberOfParticles)
    }
    
    createParticles(n=1) {
        for (let i = 0; i < n; i++) {
            this.particles.push(new Point(this.x, this.y, this.radius))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    move(p) {
        p.x += p.dx
        p.y += p.dy
    }
    
    effect(p) {
        if (p.radius <= 1) {
            this.removeParticle(p)
        }

        if (GLOBAL_TIMER % this.duration == 0) {
            this.removeParticle(p)
        }
        
        p.radius -= 1
    }

    

    draw(p) {
        ctx.fillStyle = this.fillColor
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        ctx.fill()
    }

    update() {
        this.particles.forEach(p=>{
            this.move(p)
            this.effect(p)
            this.draw(p)
        })            
    }
}





class Trail {
    constructor() {
        this.fillColor = "red"
        this.enabled = false
        this.timer = 0
        this.duration = 50
        
        this.particles = []
    }
    
    addParticle(x=0, y=0, radius) {
        this.particles.push(new Point(x, y, radius))
    }
    
    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    effect(p) {
        if (p.radius <= 1) {
            this.removeParticle(p)
        }
        
        if (this.particles.length >= 20) {
            this.removeParticle(p)
        }
        
        p.radius -= 1

    }

    draw(p) {
        let greenCycle = sineInt(255, GLOBAL_TIMER%90, 4,)*0.5+50
        let blueCycle = sineInt(255, GLOBAL_TIMER, 8,)*0.01
        ctx.fillStyle = `rgb(${255}, ${greenCycle}, ${blueCycle})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)
        ctx.fill()
    }

    animationDuration() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer%this.duration == 0) {
            this.timer = 0
            this.enabled=false
        }
    }
    
    update() {
        this.animationDuration()
        this.particles.forEach(p=>{
            this.effect(p)
            this.draw(p)
        })
    }
}




class Sparks {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.particles = []
        this.addParticles(20)
        this.duration = 20
        this.strokeColor = "red"
        this.isColorCustomized = true
    }  

    addParticles(n=1) {
        for (let i = 0; i < n; i++) {
            this.particles.push(new Dash(this.x, this.y, randint(10)+5))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    move(p) {
        p.x += p.dx*0.8
        p.y += p.dy*0.8
    }

    effect(p) {
        if (p.length <= 0) {
            this.removeParticle(p)
        }
        
        if (GLOBAL_TIMER % this.duration == 0) {
            this.removeParticle(p)
        }

        p.length -= 0.5
        
    }

    customizeColor() {
        if (this.isColorCustomized) {
            this.strokeColor = `hsl(${((GLOBAL_TIMER%25))+25}, 80%, 60%)`
        }
    }
    
    draw(p) {
        ctx.lineWidth = randint(4)+1
        ctx.strokeStyle = this.strokeColor
        // Crosshair Horizontal-Vertical
        // if (p.oriented === "right") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x+p.length, p.y)
        // }

        // if (p.oriented === "left") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x-p.length, p.y)
        // }

        // if (p.oriented === "top") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x, p.y-p.length)
        // }

        // if (p.oriented === "bottom") {
        //     ctx.beginPath()
        //     ctx.moveTo(p.x, p.y)
        //     ctx.lineTo(p.x, p.y+p.length)
        // }
        
        // Crosshair Diagonals
        if (p.oriented === "topright") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x+p.length, p.y-p.length)
        }

        if (p.oriented === "topleft") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x-p.length, p.y-p.length)
        }

        if (p.oriented === "bottomleft") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x-p.length, p.y+p.length)
        }

        if (p.oriented === "bottomright") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x+p.length, p.y+p.length)
        }

        ctx.stroke()            
    }

    update() {
        this.particles.forEach(p=>{
            this.move(p)
            this.customizeColor()
            this.effect(p)
            this.draw(p)
        }) 
    }
}





class Pulse {
    constructor(p1) {
        this.p1 = p1
        this.maxim = 50
        this.freq = 2
        this.customFill = false
        this.customStroke = false
        this.lineWidth = 1
    }

    fx() {
        let cycle = sineInt(this.maxim, GLOBAL_TIMER%360, this.freq)
        if (this.customFill) {
            this.p1.fillColor = `hsl(${0}, ${cycle+50}%, ${60}%)`
        }
        if (this.customStroke) {
            this.p1.lineWidth = (GLOBAL_TIMER%4)+1
            this.p1.strokeColor = `hsl(${0}, ${cycle+50}%, ${60}%)`
        }
    }

    update() {
        this.fx()
    }
}




class Wave {
    constructor() {
        // this.game = game
        this.particles = []

        this.maxRadius = 250
        this.enabled = false
        this.timer = 0
        this.duration = 250

        this.strokeColor = "red"
        
        this.addParticle()
    }

    addParticle() {
        let p1 = new Point(150, 150, 5)
        let p2 = new Point(150, 150, p1.radius*(randint(4)+3))
        this.particles.push(p1, p2)
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }
    
    effect(p) {
        if (p.radius > this.maxRadius) {
            this.removeParticle(p)
        }

        p.radius += 2
    }

    startTimer() {
        if (this.enabled) {
            this.timer += 1
        }

        if (this.timer == this.duration) {
            this.timer = 0
            this.enabled = false
        }
    }

    draw(p) {
        ctx.lineWidth = 4
        ctx.strokeStyle = this.strokeColor
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2)

        ctx.stroke()
    }
    
    update() {
        this.startTimer()
        this.particles.forEach(p=>{
            this.effect(p)
            this.draw(p)
        })
    }    
}


 

class Laser {
    constructor() {
        // this.game = game
        this.particles = []

        this.enabled = false
        this.timer = 0
        this.duration = 300

        this.addParticle()
    }

    addParticle() {
        this.particles.push(new Line(0, 0, 0, 0))
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }
    
    effect(p) {
        p.x1 = this.timer
        p.y1 = 0
        p.x2 = 0
        p.y2 = this.timer
    }

    startTimer() {
        if (this.enabled) {
            this.timer += 1
        }
        
        if (this.timer == this.duration) {
            this.timer = 0
            this.enabled = false
        }
    }

    draw(p) {
        p.draw(ctx)
    }
    
    update() {
        this.startTimer()
        this.particles.forEach(p=>{
            this.effect(p)
            this.draw(p)
        })

        
    }    
}












// MOUSE VARIABLES
mx = 150;
my = 150;


let VFX = []

// Crete trail object first
// Then updates the trail passing the position of the ball
let trail = new Trail()

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // When creating the FX pass the position
    if (clicked) {
        // VFX.push(new Sparks(mx, my))
        // VFX.push(new Explotion(mx, my))
        
        // let wave = new Wave()
        // wave.enabled = true
        // VFX.push(wave)

        let laser = new Laser()
        laser.enabled = true
        VFX.push(laser)
        // trail.enabled = true
    }


    // TRAIL WORKS LIKE THIS
    // if (trail.enabled) {
    //     trail.addParticle(mx, my, 20)
    // }

    // Updates Constantly
    // trail.update()

    
    
    
    // Updates all the FX in the list if there are any
    if (VFX.length != 0) {
        VFX.forEach(fx=>{
            fx.update()
            
            if (!fx.enabled) {
                let idx = VFX.indexOf(fx)
                VFX.splice(idx, 1)
            }
            
        })
    }
    
    clicked = false
    GLOBAL_TIMER += 1
    GLOBAL_TIMER >= 1000? GLOBAL_TIMER = 0: false;
    
    requestAnimationFrame(animate)
}

animate()




function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)


function mouseClick(e) {
    // mx = e.offsetX 
    // my = e.offsetY
    clicked = true
}


canvas.addEventListener("mousedown", mouseClick)




function radians(degrees) {
    // degrees = 90
    return degrees*(Math.PI/180)
}