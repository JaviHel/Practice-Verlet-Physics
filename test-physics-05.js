// FINITE STATE MACHINE AI

// IDLE: Just stays still, only aware if something engages it directly
// AWARE: Searches for intruders, notices things like open doors
// INTRIGUED: Knows something is happening, abandons path to seek
// ALERT: Aware of the player and begins hunting them down
// AGGRESIVE: Actively attacking the player
// FLEEING: runs away from the player
// DEAD: No longer aware, but may be revived (depending on the game)




// CREATE A STATE/EVENT TABLE FOR THE CPU LIKE THIS
// 1. Idle until player is within a certain range
// 2. If within range, moves towards the player
// 3. If close enough, attacks
// 4. When attack is finished, flee from the player




// Main state to control all other states
class State {
    constructor(CPU, player) {
        this.cpu = CPU
        this.player = player
        this.state = "state"
    }

    update() {
        
    }
}

class Idle extends State {
    update() {
        this.cpu.color = "black"
        this.cpu.pos.x += (Math.random()*2)-1
        this.cpu.pos.y += (Math.random()*2)-1
    }
}

class Seek extends State {
    update() {
        this.cpu.color = "darkred"
        let direction = this.player.pos.sub(cpu.pos).unit().setMag(1)
        this.cpu.pos = this.cpu.pos.add(direction)        
    }
}

class Attack extends State {
    update() {
        this.cpu.color = "red"
        let direction = this.player.pos.sub(cpu.pos).unit().setMag(4)
        this.cpu.pos = this.cpu.pos.add(direction)  
        
    }
}

class Flee extends State {
    update() {
        this.cpu.color = "green"
        let direction = this.player.pos.sub(cpu.pos).unit().setMag(2)
        this.cpu.pos = this.cpu.pos.sub(direction) 
    }
}











class Player extends Particle {
    constructor(x, y) {
        super(x, y)
        this.radius = 10
        this.color = "lightblue"
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}


class CPU extends Particle {
    constructor(x, y) {
        super(x, y)
        this.radius = 10
        this.color = "black"
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}





let physics = new VerletPhysics()

let player = new Player(50, 50)
let cpu = new CPU(canvasCenterX, canvasCenterY)

let state = new State(cpu, player)



mx = 50
my = 50


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let mousePosVec = new Vector(mx, my)
    player.pos = mousePosVec

    let dist = player.pos.dist(cpu.pos)

    if (dist > 150) {
        state = new Idle(cpu, player)
        state.state = "idle"
    }
    else if (dist <= 150 && dist > 100) {
        state = new Seek(cpu, player)
        state.state = "seek"
    }
    else if (dist > 100) {
        state = new Attack(cpu, player)
        state.state = "attack"
    }
    else if (dist < 10) {
        state = new Flee(cpu, player)
        state.state = "flee"
    }
    

    if (state.state != "flee") {
       if (dist <= 150 && dist > 40) {
            state = new Seek(cpu, player)
            state.state = "seek"
        }
        else if (dist <= 40) {
        state = new Attack(cpu, player)
        state.state = "attack"
        }
    }
    
    
    
    player.draw(ctx)
    cpu.draw(ctx)
    state.update()
    requestAnimationFrame(animate)
}

animate()





function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)