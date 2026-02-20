// CHANGES AND UPDATES
// Particle class should extend Vector (It is a Vector directly)
// particles should attract each other if wanted (READY)
// particles should collide with each other (READY)
// particle should have gravity effect (READY)
// particle should have acceleration and mass
// VerletPhysics should remove particle, segment or effect (READY)




// CLASSES

class Particle {
    constructor(x=0, y=0) {
        this.pos = new Vector(x, y)
        this.oldPos = this.pos.sub(new Vector())
        this.locked = false
    }

    lock(boolean=true) {
        this.locked = boolean
    }

    update() {
        if (!this.locked) {
            let velVec = this.pos.sub(this.oldPos)
            this.oldPos = this.pos
            this.pos = this.pos.add(velVec)
        }
    }
}




class Segment {
    constructor(particleA, particleB, stiffness=0.5, restLength=0) {
        this.particleA = particleA
        this.particleB = particleB
        this.stiffness = stiffness
        restLength != 0? this.length = restLength:
        this.length = particleA.pos.dist(particleB.pos);
    }

    constraint() {
        // Segment current int-length and desire int-length
        let currLen = this.particleA.pos.dist(this.particleB.pos)
        let desireLen = this.length
        let diff = currLen - desireLen

        // Unit/Normalized Vector of the current distance 
        // between particles
        let vecLen = this.particleA.pos.sub(this.particleB.pos).unit()
        let scaledVecLen = vecLen.mul(diff*this.stiffness)

        // Apply the new segment/vector length
        // to the position of the particles
        if (!this.particleB.locked) {
            this.particleB.pos = this.particleB.pos.add(scaledVecLen)
        }
        if (!this.particleA.locked) {
            this.particleA.pos = this.particleA.pos.add(scaledVecLen.mul(-1))
        }
    }
}




// EFFECTS


class AttractionEffect {
    constructor(particle, radius=1, strength=1, blackHoleBool=true) {
        this.particle = particle
        this.radius = radius
        this.strength = strength
        this.blackHoleBool = blackHoleBool
    }

    update(particles) {
        particles.forEach(p=>{
            if (p != this.particle && !p.locked &&
                p.pos.dist(this.particle.pos) <= this.radius) {
                
                let distVec = this.particle.pos.sub(p.pos)
                let newVel = distVec.setMag(this.strength)
                p.pos = p.pos.add(newVel)
                this.blackHole? p.oldPos = p.pos:false;
            }
        })
    }
}




class GravityEffect {
    constructor(vec) {
        this.gravity = vec
    }

    update(particles) {
        particles.forEach(particle=>{
            if (!particle.locked) {
                particle.pos = particle.pos.add(this.gravity)
            }
        })
    }
}




// MAIN CLASS - VERLET PHYSICS 


class VerletPhysics {
    constructor() {
        this.particles = []
        this.segments = []
        this.effects = []
    }

    // ADD OBJECTS
    addParticle(particle) {
        this.particles.push(particle)
    }
    addSegment(segment) {
        this.segments.push(segment)
    }
    addEffect(effect) {
        this.effects.push(effect)
    }

    
    // REMOVE OBJECTS
    removeParticle(particle) {
        let partIndex = this.particles.indexOf(particle)
        this.particles.splice(partIndex, 1)
    }
    removeSegment(segment) {
        let segmIndex = this.segments.indexOf(segment)
        this.segments.splice(segmIndex, 1)
    }
    removeEffect(effect) {
        let fxIndex = this.effects.indexOf(effect)
        this.effects.splice(fxIndex, 1)
    }
    

    // GET OBJECTS
    getParticles() {
        return this.particles
    }
    getSegments() {
        return this.segments
    }
    getEffects() {
        return this.effects
    }
    

    // UTILITY METHODS
    rectBound(x, y, w, h, r=0) {
        // Limits the positioning of the particles to a certain rect
        this.particles.forEach(p=>{
            if (p.pos.x < x+r) {p.pos.x = x+r}
            else if (p.pos.y < y+r) {p.pos.y = y+r}
            else if (p.pos.x > w-r) {p.pos.x = w-r}
            else if (p.pos.y > h-r) {p.pos.y = h-r}
        })
    }

    rectBounce(x, y, w, h, r=0) {
        // Limits the positions of the particles to a certain rect
        // but they bounce to the opposite direction
        this.particles.forEach(p=>{
            if (p.pos.x < x+r) {
                p.pos.x = x+r
                p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
            }
            else if (p.pos.y < y+r) {
                p.pos.y = y+r
                p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
            }
            else if (p.pos.x > w-r) {
                p.pos.x = w-r
                p.oldPos.x = p.pos.x + (p.pos.x-p.oldPos.x)
            }
            else if (p.pos.y > h-r) {
                p.pos.y = h-r
                p.oldPos.y = p.pos.y + (p.pos.y-p.oldPos.y)
            }
        })
    }

    
    // UPDATE METHODS    
    updateParticles() {
        // Verlet Movement
        // this.particles.forEach(particle=>{
        //     particle.update()
        // })

        // OPTIMIZE?
        let arrLen = this.particles.length-1
        let halfArrLen = Math.floor(arrLen*0.5)
        let step = 2
        
        for (let i = 0; i < halfArrLen; i+=step) {
            this.particles[i].update()
            this.particles[arrLen-i].update()
            this.particles[i+1].update()
            this.particles[arrLen-1-i].update()
        }
        
    }
    updateSegments() {
        // this.segments.forEach(segment=>{
        //     segment.constraint()
        // })
        let arrLen = this.segments.length-1
        let halfArrLen = Math.floor(arrLen*0.5)
        let step = 2
        
        for (let i = 0; i < halfArrLen; i+=step) {
            this.segments[i].constraint()
            this.segments[arrLen-i].constraint()
            this.segments[i+1].constraint()
            this.segments[arrLen-1-i].constraint()
        }
    }
    updateEffects() {
        // this.effects.forEach(effect=>{
        //     effect.update(this.particles)
        // })

        let arrLen = this.effects.length-1
        let halfArrLen = Math.floor(arrLen*0.5)
        let step = 2
        
        for (let i = 0; i < halfArrLen; i+=step) {
            this.effects[i].update(this.particles)
            this.effects[arrLen-i].update(this.particles)
            this.effects[i+1].update(this.particles)
            this.effects[arrLen-1-i].update(this.particles)
        }
    }
    
    // UPDATE EVERYTHING
    update() {
        this.particles.length!=0? this.updateParticles():false;
        this.segments.length!=0? this.updateSegments():false;
        this.effects.length!=0? this.updateEffects():false;
    }
}




