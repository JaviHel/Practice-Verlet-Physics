// CHANGES AND UPDATES
// Particle class should extend Vector (It is a Vector directly)
// particles should attract each other if wanted (READY)
// particles should collide with each other (READY)
// particle should have gravity effect (READY)
// VerletPhysics should remove particle, segment or effect (READY)
// particle should have acceleration and mass
// Alert Class to add external logic to collisions or close particles/segments



// CLASSES

class Particle {
    static ID = 0
    constructor(x=0, y=0) {
        this.pos = new Vector(x, y)
        this.oldPos = this.pos.sub(new Vector())
        this.radius = 0
        this.locked = false
        this.ID = Particle.ID
        this.color = ""
        Particle.ID += 1
    }

    lock(boolean=true) {
        this.locked = boolean
    }    
}




class Segment {
    constructor(particleA, particleB, stiffness=0.5, restLength=0) {
        this.particleA = particleA
        this.particleB = particleB
        this.pA = particleA
        this.pB = particleB
        this.stiffness = stiffness
        restLength != 0? this.length = restLength:
        this.length = particleA.pos.dist(particleB.pos);
        this.color = ""
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
    constructor(particle, radius=1, strength=1, blackHoleBool=false) {
        this.particle = particle
        this.radius = radius
        this.strength = strength
        this.blackHoleBool = blackHoleBool
    }

    setRadius(radius) {
        this.radius = radius
    }
    setStrength(strength) {
        this.strength = strength
    }
    setSuperAttract(bool=false) {
        this.blackHoleBool = bool
    }
    
    update(particles) {
        particles.forEach(p=>{
            if (p != this.particle && !p.locked && p.ID != this.particle.ID 
                && p.pos.dist(this.particle.pos) <= p.radius+this.particle.radius+this.radius) {

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
        this.particles.forEach(particle=>{
            if (!particle.locked) {
                let velVec = particle.pos.sub(particle.oldPos)
                particle.oldPos = particle.pos
                particle.pos = particle.pos.add(velVec)
            }
        })
    }
    updateSegments() {
        this.segments.forEach(segment=>{
            segment.constraint()
        })
    }
    updateEffects() {
        this.effects.forEach(effect=>{
            effect.update(this.particles)
        })
    }
    
    // UPDATE EVERYTHING
    update() {
        this.particles.length!=0? this.updateParticles():false;
        this.segments.length!=0? this.updateSegments():false;
        this.effects.length!=0? this.updateEffects():false;
    }
}







            
