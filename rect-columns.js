class Rect {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h


        this.offsetX = 0
        this.offsetY = 0
        
        this.fillColor = randColor()
        this.strokeColor = ""

        this.speed = 2
    }

    translate(x, y) {
        this.offsetX = x
        this.offsetY = y
    }

    move() {

        // original canvasSize = 300
        // custom canvasSize = 400
        
        // Move Down (Ready)
        // this.y goes from 0 to 400 with a speed of 2
        // and translated to (-rowSize*2) 
        
        // this.y = (this.y%canvasHeight)+this.speed

        // Move Up (ready)
        // this.y goes from 0 to -400 with a speed of 2
        // and translated to 300+rowSize

        this.y = (this.y%-canvasHeight)-this.speed
    }
    
    draw(ctx) {
        ctx.save()
        ctx.fillStyle = this.fillColor
        ctx.strokeStyle = this.strokeColor
        ctx.lineWidth = this.lineWidth
        
        ctx.beginPath()
        ctx.roundRect(this.x+this.offsetX, this.y+this.offsetY, this.w, this.h)

        !this.strokeColor==""? ctx.stroke(): false;
        !this.fillColor==""? ctx.fill(): false;

        ctx.restore()
    }
}




let LEFT_COL = []
let RIGHT_COL = []

let canvasHeight = 400 // Custom Canvas Width
let rows = 10
let rowSize = parseInt(canvasHeight/rows)
let offsetY = rowSize*2

for (let i = 0; i < rows; i++) {
    var x = 0
    var y = i*rowSize+offsetY
    var w = 300
    var h = rowSize

    var rect = new Rect(x, y, w, h)
    LEFT_COL.push(rect)
}






function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)


    LEFT_COL.forEach(rect=>{
        rect.draw(ctx)
        rect.move()

        rect.translate(0, 300+rowSize)
        
        if (UP) {
            rect.speed -= 0.1
        }

        if (DOWN) {
            rect.speed += 0.1
        }
    })
    
    requestAnimationFrame(animate)
}



animate()
keyboardEnabled()