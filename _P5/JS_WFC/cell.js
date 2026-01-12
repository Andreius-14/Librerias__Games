/* eslint indent: "off" */
/* eslint-disable space-before-function-paren */


class Cell {
    constructor(value) {
        // Initialize the cell as not collapsed
        this.collapsed = false;
        // Is an array passed in?
        if (value instanceof Array) {
            // Set options to the provided array
            this.options = value;
        } else {
            // Fill array with all the option
            // [0, 1, 2, ..., tiles.length - 1]s
            this.options = [];
            for (let i = 0; i < value; i++) {
                this.options[i] = i;
            }
        }
    }
}


