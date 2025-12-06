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

//          ╭─────────────────────────────────────────────────────────╮
//          │                 Restricciones por Tile                  │
//          ╰─────────────────────────────────────────────────────────╯
//           rules[tile][dir] indica QUÉ tiles pueden colocarse en la
//           dirección "dir" respecto al tile actual.
//
//           dir index:
//          ╭─────────────────────────────────────────────────────────╮
//          │     0 = ↑  (qué puede ir ARRIBA de este tile)           │
//          │     1 = →  (qué puede ir a la DERECHA de este tile)     │
//          │     2 = ↓  (qué puede ir ABAJO de este tile)            │
//          │     3 = ←  (qué puede ir a la IZQUIERDA de este tile)   │
//          ╰─────────────────────────────────────────────────────────╯
//
//           Ejemplo visual del concepto:
//
//          ╭─────────────────────────────────────────────────────────────╮
//          │ ┌─────┐        rules[X][0] = lista de tiles permitidos aquí │
//          │ │  ?  │   ↑                                                 │
//          │ ├─────┤   X     ← tile actual                               │
//          │ │  X  │   ↓                                                 │
//          │ └─────┘        rules[X][2] = lista de tiles permitidos aquí │               │
//          ╰─────────────────────────────────────────────────────────────╯
//
//           Esto hace que leer las reglas sea literal “tabla de compatibilidad”.

const rules = [
    //  ╭─────────────────╮
    //  │      blank      │
    //  ╰─────────────────╯
    [
        /* [↑] */[BLANK, UP],
        /* [→] */[BLANK, RIGHT],
        /* [↓] */[BLANK, DOWN],
        /* [←] */[BLANK, LEFT]
    ],
    //  ╭─────────────────╮
    //  │        UP       │
    //  ╰─────────────────╯
    [
        /* [↑] */[RIGHT, LEFT, DOWN],
        /* [→] */[LEFT, UP, DOWN],
        /* [↓] */[BLANK, DOWN],
        /* [←] */[RIGHT, UP, DOWN]
    ],
    //  ╭─────────────────╮
    //  │      Right      │
    //  ╰─────────────────╯

    [
        /* [↑] */[RIGHT, LEFT, DOWN],
        /* [→] */[LEFT, UP, DOWN],
        /* [↓] */[RIGHT, LEFT, UP],
        /* [←] */[BLANK, LEFT]
    ],
    //  ╭─────────────────╮
    //  │      Down       │
    //  ╰─────────────────╯
    [
        /* [↑] */[BLANK, UP],
        /* [→] */[LEFT, UP, DOWN],
        /* [↓] */[RIGHT, LEFT, UP],
        /* [←] */[RIGHT, UP, DOWN]
    ],
    //  ╭─────────────────╮
    //  │       Left      │
    //  ╰─────────────────╯
    [
        /* [↑] */[RIGHT, LEFT, DOWN],
        /* [→] */[BLANK, RIGHT],
        /* [↓] */[RIGHT, LEFT, UP], // ↓
        /* [←] */[UP, DOWN, RIGHT] // ←
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
    // GameOver -- Si no hay casillas que llenar Detiene todo
    // Filtra -- Casillas sin Imagen
    // Ordena -- Menor a Mayor
    // Group  -- Agrupa las celdas con Menores Opciones. ejm: las de 1 Opcion ||  las de 2 Opciones

    // [Duplica]
    let gridCopy = grid.slice()

    // [GameOver]
    if (gridCopy.length == 0) {
        return
    }
    // [Filtra]
    gridCopy = gridCopy.filter((a) => !a.collapsed)

    // [Ordena]
    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length
    })

    // [Group]
    const len = gridCopy[0].options.length
    let stopIndex = 0

    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i
            break
        }
    }
    if (stopIndex > 0) gridCopy.splice(stopIndex)

    //          ╭─────────────────────────────────────────────────────────╮
    //          │     Aplicando Entriopia : Habilita  Imagen a Pintar     │
    //          ╰─────────────────────────────────────────────────────────╯

    // Seleccion Random - [] y Tile
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

            if (grid[index].collapsed) {
                // ────────────── Guardando Estado ──────────────
                nextGrid[index] = grid[index]
            } else {
                // ╭─────────────────────────────────────────────────────────╮
                // │     Pasa por una capa de DEPURACION -- por cada IF,     │
                // │Dejando aquel que cumple las restriciones de los vecinos │
                // ╰─────────────────────────────────────────────────────────╯
                const options = [BLANK, UP, RIGHT, DOWN, LEFT]

                // ──────────────── recorre lados ────────────────
                // Se ejecuta en la Celda Vacia
                // La celda Vacia - Tiene Vecinos

                // ──────────────── Logica  UP ────────────────
                // Options  : los posibles TILES Del Vecino          >>> options: [BLANK, UP, RIGHT, DOWN, LEFT]
                // Options  : Si esta lleno tiene 1 Tile Definido    >>> options: [valor_establecido]
                //
                // Ubicacion Actual: Abajo del Vecino
                // Restriccion     : Elejimos la restriccion Abajo del Vecino  [2]
                // ╭──────╮
                // │[0][↑]│
                // │[1][→]│
                // │[2][↓]│
                // │[3][←]│
                // ╰──────╯

                // ╭─────────────────────────────────────────────────────────╮
                // │  Ya accedido a los nameTile entonces ya tengo acceso a  │
                // │                  su ubicacion en RUles                  │
                // ╰─────────────────────────────────────────────────────────╯

                // Look up
                if (j > 0) {
                    const up = grid[i + (j - 1) * DIM]
                    let validOptions = []
                    for (const option of up.options) {
                        const valid = rules[option][2]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }
                // Look right
                if (i < DIM - 1) {
                    const right = grid[i + 1 + j * DIM]
                    let validOptions = []

                    for (const option of right.options) {
                        const valid = rules[option][3]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }
                // Look down
                if (j < DIM - 1) {
                    const down = grid[i + (j + 1) * DIM]
                    let validOptions = []

                    for (const option of down.options) {
                        const valid = rules[option][0]
                        validOptions = validOptions.concat(valid)
                    }
                    checkValid(options, validOptions)
                }

                // Look left
                if (i > 0) {
                    const left = grid[i - 1 + j * DIM]
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
