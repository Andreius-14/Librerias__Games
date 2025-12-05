/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */

const tiles = []
const grid = []
const DIM = 2

const BLANK = 0
const UP = 1
const RIGHT = 2
const DOWN = 3
const LEFT = 4

//Array de Imagen
function preload() {
    tiles[0] = loadImage('./tiles/blank.png')
    tiles[1] = loadImage('./tiles/up.png')
    tiles[2] = loadImage('./tiles/right.png')
    tiles[3] = loadImage('./tiles/down.png')
    tiles[4] = loadImage('./tiles/left.png')
}

//Array de Objetos
function setup() {
    createCanvas(600, 600)
    for (let i = 0; i < DIM * DIM; i++) {
        //Propiedades x Celda
        grid[i] = {
            collapse: false,
            options: [BLANK, UP, RIGHT, DOWN, LEFT]
        }
    }

    // Reglas que Opciones tiene la Posicion
    //    grid[2].options = [BLANK, UP]
    //    grid[0].options = [BLANK, UP]
}

function draw() {
    background(0)

    // Pick cell with least entropy
    const gridCopy = grid.slice();

    //Ordena -- Menor a Mayor -- grid[].options
    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length;
    })

    // Num de Obsiones (La menor posible)
    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    // recorre --- Busca la primera Casilla + con un numero mayor de Opciones
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }
    // Filtra el array: Mantiene solo las opciones con la menor longitud (mínima entropía).
    if (stopIndex > 0) gridCopy.splice(stopIndex)

    //
    // [Entropia Minima Establecida]
    //

    // Seleccion Random - []
    const cell = random(gridCopy);
    cell.collapsed = true;
    // Seleccion Random - pic
    const pick = random(cell.options);
    cell.options = [pick];

    //Mensaje
    console.log(grid);
    console.log(gridCopy);

    // widht , height - propiedades de canvas p5.js
    const w = width / DIM
    const h = height / DIM

    //Recorre --- el Grid
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            const cell = grid[i + j * DIM]

            if (cell.collapsed) {
                //traduce la unica opcion que posee a Imagen
                let index = cell.options[0]
                image(tiles[index], i * w, j * h, w, h)
            } else {
                fill(0)
                stroke(255)
                rect(i * w, j * h, w, h)
            }
        }
    }

    noLoop(0)
}
