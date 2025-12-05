/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */

const tiles = []
let grid = []
const DIM = 8

const BLANK = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const LEFT = 4

const rules = [
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK, DOWN],
        [BLANK, LEFT]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [BLANK, DOWN],
        [RIGHT, UP, DOWN]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [BLANK, LEFT]
    ],
    [
        [BLANK, UP],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [RIGHT, UP, DOWN]
    ],
    [
        [RIGHT, LEFT, DOWN],
        [BLANK, RIGHT],
        [RIGHT, LEFT, UP],
        [UP, DOWN, RIGHT]
    ]
]

// Array de Imagen
function preload() {
    tiles[0] = loadImage('./tiles/blank.png')
    tiles[1] = loadImage('./tiles/up.png')
    tiles[2] = loadImage('./tiles/right.png')
    tiles[3] = loadImage('./tiles/down.png')
    tiles[4] = loadImage('./tiles/left.png')
}

// Array de Objetos
function setup() {
    createCanvas(600, 600)
    for (let i = 0; i < DIM * DIM; i++) {
        // Propiedades x Celda
        grid[i] = {
            collapsed: false,
            options: [BLANK, UP, RIGHT, DOWN, LEFT]
        }
    }

    // Reglas que Opciones tiene la Posicion
    //    grid[2].options = [BLANK, UP]
    //    grid[0].options = [BLANK, UP]
}

function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
        // VALID: [BLANK, RIGHT]
        // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
        // result in removing UP, DOWN, LEFT
        const element = arr[i]
        if (!valid.includes(element)) {
            arr.splice(i, 1)
        }
    }
}
function mousePressed() {
    redraw()
}


function draw() {
    background(0)
    // widht , height - propiedades de canvas p5.js
    const w = width / DIM
    const h = height / DIM

    // Recorre --- el Grid
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            const cell = grid[i + j * DIM]

            if (cell.collapsed) {
                // traduce la unica opcion que posee a Imagen
                let index = cell.options[0]
                image(tiles[index], i * w, j * h, w, h)
            } else {
                fill(0)
                stroke(255)
                rect(i * w, j * h, w, h)
            }
        }
    }


    // Pick cell with least entropy
    let gridCopy = grid.slice()
    gridCopy = gridCopy.filter((a) => !a.collapsed)
    // console.table(grid);
    // console.table(gridCopy) // Ordena -- Menor a Mayor -- grid[].options

    if (gridCopy.length == 0) {
        return
    }

    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length
    })

    // Num de Obsiones (La menor posible)
    const len = gridCopy[0].options.length
    let stopIndex = 0
    // recorre --- Busca la primera Casilla + con un numero mayor de Opciones
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i
            break
        }
    }
    // Filtra el array: Mantiene solo las opciones con la menor longitud (mínima entropía).
    if (stopIndex > 0) gridCopy.splice(stopIndex)

    //---------------------------------
    // [Entropia Minima Establecida]
    //---------------------------------

    // Seleccion Random - []
    const cell = random(gridCopy)
    cell.collapsed = true
    // Seleccion Random - pic
    const pick = random(cell.options)
    cell.options = [pick]

    // Mensaje
    console.table(grid)
    // console.log(gridCopy)


    const nextGrid = []
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            const index = i + j * DIM
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index]
            } else {
                let options = [BLANK, UP, RIGHT, DOWN, LEFT]
                // Look up
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM]
                    let validOptions = []

                    for (let option of up.options) {
                        let valid = rules[option][2]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)

                }
                // Look right
                if (i < DIM - 1) {
                    let right = grid[i + 1 + j * DIM]
                    let validOptions = []

                    for (let option of right.options) {
                        let valid = rules[option][3]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)

                }
                // Look down
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM]
                    let validOptions = []

                    for (let option of down.options) {
                        let valid = rules[option][0]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)


                }

                // Look left
                if (i > 0) {
                    let left = grid[i - 1 + j * DIM]
                    let validOptions = []

                    for (let option of left.options) {
                        let valid = rules[option][1]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)

                }

                nextGrid[index] = {
                    options,
                    collapsed: false
                }
            }
        }
    }

    grid = nextGrid
    // noLoop(0)
}
