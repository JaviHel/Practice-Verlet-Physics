const canvas = document.getElementById("canvas-1")
const ctx = canvas.getContext("2d")

canvas.width = 300
canvas.height = 300

const canvasCenterX = Math.floor(canvas.width/2)
const canvasCenterY = Math.floor(canvas.height/2)

ctx.imageSmoothingEnabled = false
ctx.imageSmoothingQuality = "low"

// console.log(ctx)




    // UTILITY FUNCTIONS

function randColor() {
    let digitos = '0123456789ABCDEF';
    let colorHex = '#';
    
    for (let i = 0; i < 6; i++) {
        let indiceAleatorio = Math.floor(Math.random() * 16);
        colorHex += digitos[indiceAleatorio];
    }
    return colorHex
}


function randint(n) {
    return Math.floor(Math.random()*n)
}

// randRange

function randomChoice(array) {
    // return a random object from the array
    let randIndex = Math.floor(Math.random()*array.length)
    return array[randIndex]
}


function sineInt(max, angle, freq=1, offset=0) {
    // returns a sine interpolation of numbers between 0 and max
    // the angle is used to interpolate dynamically
    // the freq is a scalar float to change the speed
    // offset moves the range of values maintaining the interpolation distance
    let sine = Math.floor(Math.sin(radians(angle*freq))*(max))+(max/2)
    return sine + offset
}

function sineFloat(max, angle, freq=1, offset=0) {
    // returns a sine interpolation of numbers between 0 and max
    // the angle is used to interpolate dynamically
    // the freq is a scalar float to change the speed
    // offset moves the range of values maintaining the interpolation distance
    let sine = (Math.sin(radians(angle*freq))*(max))+(max/2)
    return sine + offset
}

function radians(degrees) {
    return degrees*(Math.PI/180)
}



// MOUSE METHODS
let mx = 0
let my = 0
let mcx = 0
let mcy = 0
let clicked = false

function mousePos(e) {
    mx = e.offsetX 
    my = e.offsetY
}


canvas.addEventListener("mousemove", mousePos)



function mouseClickDown(e) {
    mcx = e.offsetX 
    mcy = e.offsetY
    clicked = true
}


canvas.addEventListener("mousedown", mouseClickDown)


function mouseClickUp(e) {
    // mcx = e.offsetX 
    // mcy = e.offsetY
    clicked = false
}


canvas.addEventListener("mouseup", mouseClickUp)

