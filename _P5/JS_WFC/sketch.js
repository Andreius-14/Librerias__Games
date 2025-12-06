/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */

//          ╭─────────────────────────────────────────────────────────╮
//          │                        Variables                        │
//          ╰─────────────────────────────────────────────────────────╯
const tiles = []
let grid = []
const DIM = 8

const BLANK = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const LEFT = 4

const rules = [
    //  ╭─────────────────╮
    //  │      blank      │
    //  ╰─────────────────╯
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK, DOWN],
        [BLANK, LEFT]
    ],
    //  ╭─────────────────╮
    //  │        UP       │
    //  ╰─────────────────╯
    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [BLANK, DOWN],
        [RIGHT, UP, DOWN]
    ],
    //  ╭─────────────────╮
    //  │      Right      │
    //  ╰─────────────────╯

    [
        [RIGHT, LEFT, DOWN],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [BLANK, LEFT]
    ],
    //  ╭─────────────────╮
    //  │      Down       │
    //  ╰─────────────────╯
    [
        [BLANK, UP],
        [LEFT, UP, DOWN],
        [RIGHT, LEFT, UP],
        [RIGHT, UP, DOWN]
    ],
    //  ╭─────────────────╮
    //  │       Left      │
    //  ╰─────────────────╯
    [
        [RIGHT, LEFT, DOWN],
        [BLANK, RIGHT],
        [RIGHT, LEFT, UP],
        [UP, DOWN, RIGHT]
    ]
]

//          ╭─────────────────────────────────────────────────────────╮
//          │                        Funciones                        │
//          ╰─────────────────────────────────────────────────────────╯
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

// Estás dejando en arr solo los valores que están en valid
function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
        // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
        // VALID: [BLANK, RIGHT]
        // result :[BLANK, RIGHT]
        const element = arr[i]

        // ARR - VALID == ARRAY MAS PEQUEÑO
        if (!valid.includes(element)) {
            arr.splice(i, 1)
        }
    }
}
function mousePressed() {
    redraw()
}

//          ╭─────────────────────────────────────────────────────────╮
//          │                          Bucle                          │
//          ╰─────────────────────────────────────────────────────────╯

function draw() {
    background(0)
    // widht , height - propiedades de canvas p5.js
    const w = width / DIM
    const h = height / DIM

    //          ╭─────────────────────────────────────────────────────────╮
    //          │                    Draw -  Rrellena Celda               │
    //          ╰─────────────────────────────────────────────────────────╯
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            const cell = grid[i + j * DIM]

            if (cell.collapsed) {
                // traduce la unica opcion que posee a Imagen
                const index = cell.options[0]
                image(tiles[index], i * w, j * h, w, h)
            } else {
                fill(0)
                stroke(255)
                rect(i * w, j * h, w, h)
            }
        }
    }

    //          ╭─────────────────────────────────────────────────────────╮
    //          │                  Logica -  Entropia Minima              │
    //          ╰─────────────────────────────────────────────────────────╯

    // Duplica
    let gridCopy = grid.slice()

    //  Casillas sin Imagen
    gridCopy = gridCopy.filter((a) => !a.collapsed)

    // console.table(grid);
    // console.table(gridCopy)

    // Condificonal : Finaliza Si todo esta lleno
    if (gridCopy.length == 0) {
        return
    }

    // Ordena -- Menor a Mayor
    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length
    })

    // Selecciona > la array[0] cantidad de Opciones
    const len = gridCopy[0].options.length
    let stopIndex = 0

    // Filtra el array: Mantiene solo las opciones-grid con la menor longitud (mínima entropía).
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i
            break
        }
    }
    if (stopIndex > 0) gridCopy.splice(stopIndex)

    //          ╭─────────────────────────────────────────────────────────╮
    //          │                    Aplicando Entriopia                  │
    //          ╰─────────────────────────────────────────────────────────╯

    // Seleccion Random - []
    const cell = random(gridCopy)
    const pick = random(cell.options)

    cell.collapsed = true
    cell.options = [pick]

    // Mensaje
    console.table(grid)
    // console.log(gridCopy)

    //          ╭─────────────────────────────────────────────────────────╮
    //          │               Calcula el Siguiente Estado               │
    //          ╰─────────────────────────────────────────────────────────╯
    const nextGrid = []
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            const index = i + (j * DIM)

            const celda = {
                up: grid[i + (j - 1) * DIM],
                right: grid[i + 1 + j * DIM],
                down: grid[i + (j + 1) * DIM],
                left: grid[i - 1 + j * DIM]
            }

            if (grid[index].collapsed) {
                // ────────────── Guardando Estado ──────────────
                nextGrid[index] = grid[index]
            } else {
                const options = [BLANK, UP, RIGHT, DOWN, LEFT]

                // ──────────────── recorre lados ────────────────
                // Look up
                if (j > 0) {
                    const up = celda.up
                    let validOptions = []

                    for (const option of up.options) {
                        const valid = rules[option][2]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }
                // Look right
                if (i < DIM - 1) {
                    const right = celda.right
                    let validOptions = []

                    for (const option of right.options) {
                        const valid = rules[option][3]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }
                // Look down
                if (j < DIM - 1) {
                    const down = celda.down
                    let validOptions = []

                    for (const option of down.options) {
                        const valid = rules[option][0]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }

                // Look left
                if (i > 0) {
                    const left = celda.left
                    let validOptions = []

                    for (const option of left.options) {
                        const valid = rules[option][1]
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
