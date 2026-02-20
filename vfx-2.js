// r, g, b = 255, int(self.pos.y*0.86), int(self.pos.y*0.25)


// FX PRIMITIVES
class Point {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.dx = 0
        this.dy = 0
        this.radius = radius
    }
}

// this (-) is a dash
class Dash {
    constructor(x, y, length) {
        this.x = x
        this.y = y
        this.dx = randint(10)-5
        this.dy = randint(10)-5
        this.length = length

        this.color = randColor()
        this.oriented = randomChoice([/*"top", "bottom", "left", "right",*/
                                      "topleft", "topright", 
                                      "bottomleft", "bottomright"])
    }   
}



class Sparks {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.particles = []
        this.addParticles(20)
        this.timer = 0
    }  

    addParticles(n) {
        for (let i = 0; i < n; i++) {
            this.particles.push(new Dash(this.x, this.y, randint(10)+5))
        }
    }

    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }

    draw(p) {
        ctx.lineWidth = randint(2)+2
        // ctx.strokeStyle = `hsl(${(this.timer%25)+25}, 80%, 60%)`
        ctx.strokeStyle = `hsl(${(25-(this.timer%25))+15}, 80%, 60%)`
        // Crosshair Horizontal-Vertical
        if (p.oriented === "right") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x+p.length, p.y)
        }

        if (p.oriented === "left") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x-p.length, p.y)
        }

        if (p.oriented === "top") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x, p.y-p.length)
        }

        if (p.oriented === "bottom") {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x, p.y+p.length)
        }
        
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

    move() {
        this.particles.forEach(p=>{
            p.x += p.dx*0.8
            p.y += p.dy*0.8
        }) 
    }
    

    update() {
        this.particles.forEach(p=>{
            this.draw(p)

            p.length -= 0.5
            if (p.length <= 0) {
                this.removeParticle(p)
            }
            
            if (this.timer % 20 == 0) {
                this.removeParticle(p)
            }
            
        }) 

        // this.addParticles(1)

        this.move()
        this.timer += 1
        this.timer >= 100? this.timer = 0:false;
    }
    
}




// MOUSE VARIABLES
mx = 150;
my = 150;

let spark = new Sparks(mx, my)

let VFX = []


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // When creating the FX pass the position
    if (clicked) {
        VFX.push(new Sparks(mx, my))
    }

    // Updates all the FX in the list if there are any
    if (VFX.length != 0) {
        VFX.forEach(fx=>{
            fx.update()
            
            if (fx.timer <= 0) {
                let idx = VFX.indexOf(fx)
                VFX.splice(idx, 1)
            }
            
        })
    }
    
    clicked = false
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