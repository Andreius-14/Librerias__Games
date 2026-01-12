/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */
//          ╭─────────────────────────────────────────────────────────╮
//          │                        Variables                        │
//          ╰─────────────────────────────────────────────────────────╯
const tiles = []
const tileImages = []
let grid = []
const DIM = 22

const BLANK = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const LEFT = 4

//          ╭─────────────────╮
//          │  tileImages[]   │ ─╮
//          ╰─────────────────╯  │
//          ╭─────────────────╮  │
//       ╭─ │     tiles[]     │<─╯  new Tiles + Rules
//       │  ╰─────────────────╯
//       │  ╭─────────────────╮
//       ╰─>│     grid[]      │ ─╮    new Cell
//          ╰─────────────────╯  │
//          ╭─────────────────╮  │
//          │   nextGrid[]    │<─╯    new Cell
//          ╰─────────────────╯
//          ╭─────────────────────────────────────────────────────────╮
//          │                        Funciones                        │
//          ╰─────────────────────────────────────────────────────────╯
function preload() {
    const path = 'circuit'
    // Carga Imagen
    for (let i = 0; i < 13; i++) {
        tileImages[i] = loadImage(`${path}/${i}.png`)
    }
}

function setup() {
    createCanvas(600, 600)
    // Imagen a Instancia
    tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA'])
    tiles[1] = new Tile(tileImages[1], ['BBB', 'BBB', 'BBB', 'BBB'])
    tiles[2] = new Tile(tileImages[2], ['BBB', 'BCB', 'BBB', 'BBB'])
    tiles[3] = new Tile(tileImages[3], ['BBB', 'BDB', 'BBB', 'BDB'])
    tiles[4] = new Tile(tileImages[4], ['ABB', 'BCB', 'BBA', 'AAA'])
    tiles[5] = new Tile(tileImages[5], ['ABB', 'BBB', 'BBB', 'BBA'])
    tiles[6] = new Tile(tileImages[6], ['BBB', 'BCB', 'BBB', 'BCB'])
    tiles[7] = new Tile(tileImages[7], ['BDB', 'BCB', 'BDB', 'BCB'])
    tiles[8] = new Tile(tileImages[8], ['BDB', 'BBB', 'BCB', 'BBB'])
    tiles[9] = new Tile(tileImages[9], ['BCB', 'BCB', 'BBB', 'BCB'])
    tiles[10] = new Tile(tileImages[10], ['BCB', 'BCB', 'BCB', 'BCB'])
    tiles[11] = new Tile(tileImages[11], ['BCB', 'BCB', 'BBB', 'BBB'])
    tiles[12] = new Tile(tileImages[12], ['BBB', 'BCB', 'BBB', 'BCB'])

    // Duplica Rotando
    for (let i = 2; i < 14; i++) {
        for (let j = 1; j < 4; j++) {
            tiles.push(tiles[i].rotate(j))
        }
    }
    // Genera Rules - Para UP-DOWN-LEFT-RIGHT Guarda en el [new Tile]
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i]
        tile.analyze(tiles)
    }

    startOver()
}

function startOver() {
    // Creando Cell - Reserva el espacio de las opciones posibles que lo llenaran
    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = new Cell(tiles.length)
    }
}
function checkValid(arr, valid) {
    // Depura: Deja Valid en Arr
    for (let i = arr.length - 1; i >= 0; i--) {
        const element = arr[i]
        if (!valid.includes(element)) arr.splice(i, 1)
    }
}
function mousePressed() {
    redraw()
}

function vecino_depurador(options, gps_Vecino, myPosition) {
    const vecino = grid[gps_Vecino]
    let validOptions = []

    for (const option of vecino.options) {
        const valid = tiles[option][myPosition]
        validOptions = validOptions.concat(valid)
    }
    checkValid(options, validOptions)
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
                // Imprime - Img
                const index = cell.options[0]
                image(tiles[index].img, i * w, j * h, w, h)
            } else {
                // Black - Grid
                fill(0)
                stroke(255)
                rect(i * w, j * h, w, h)
            }
        }
    }

    //          ╭─────────────────────────────────────────────────────────╮
    //          │                  Logica -  Entropia Minima              │
    //          ╰─────────────────────────────────────────────────────────╯
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

    // [Group] las menores Opciones
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

    if (pick === undefined) {
        startOver()
        return
    }

    cell.options = [pick]

    // Mensaje
    console.table(grid)
    // console.log(gridCopy)

    //          ╭─────────────────────────────────────────────────────────╮
    //          │                    Siguiente Estado                     │
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
                const options = new Array(tiles.length).fill(0).map((x, i) => i)

                const exist = {
                    up: j > 0,
                    right: i < (DIM - 1),
                    down: j < (DIM - 1),
                    left: i > 0
                }
                const gps = {
                    up: i + (j - 1) * DIM,
                    right: i + 1 + j * DIM,
                    down: i + (j + 1) * DIM,
                    left: i - 1 + j * DIM
                }

                if (exist.up) vecino_depurador(options, gps.up, 'down')
                if (exist.right) vecino_depurador(options, gps.right, 'left')
                if (exist.down) vecino_depurador(options, gps.down, 'up')
                if (exist.left) vecino_depurador(options, gps.left, 'right')

                // New [CASILLA] Con las opciones Depuradas
                nextGrid[index] = new Cell(options)
            }
        }
    }

    grid = nextGrid
    // noLoop(0)
}
