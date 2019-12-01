const COLUMN_AMOUNT = 10;
const ROWS_AMOUNT = 20;
const MINIMUM_ROWS_AMOUNT = 5;

class Field {
    constructor() {
        this.columnAmount = COLUMN_AMOUNT;
        this.rowAmount = ROWS_AMOUNT;

        // create a 2d matrix with zeroes
        this.matrix = Array(ROWS_AMOUNT).fill().map(() => Array(COLUMN_AMOUNT).fill(0));
    }

    /**
     * In case of multi player game, when one of the users successfully clears a row opponent board should reduce it's
     * maximum length i.e. row amount
     * If the field (matrix) is too small then the game is over
     */
    destroyRow() {
        if (this.matrix[0].indexOf(1) === -1) {
            if (this.rowAmount > MINIMUM_ROWS_AMOUNT) {
                this.rowAmount = this.rowAmount - 1;
                this.matrix.shift();
            } else {
                // TODO "GAME OVER"
            }
        } else {
            // TODO "GAME OVER"
        }
    }

    /**
     * On success returns deleted rows, else null.
     * Parameter example: [[20, 2], [19, 2], [18, 2], [17, 2]] - stick (####) tetromino.
     * @param {Array} coordinates
     * @returns {null|number}
     */
    fillCoordinates(coordinates) {
        if (this.coordinatesAreFillable(coordinates)) {
            for (let i = 0; i < coordinates.length; i++) {
                this.matrix[coordinates[i][0]][coordinates[i][1]] = 1;
            }

            let sweptRows = 0;
            // This is for rows sweeping.
            for (let i = 0; i < this.matrix.length; i++) {
                if (this.matrix[i].findIndex(cell => cell === 0) === -1) {
                    this.matrix.splice(i, 1);
                    this.matrix.unshift(new Array(this.matrix[0].length).fill(0));
                    sweptRows++;
                }
            }

            return sweptRows;
        }
        console.log('coordinates are not fillable');
        console.log('coords', coordinates);
        return null;
    }

    /**
     * @param {Array} coordinates
     * @returns {boolean}
     */
    coordinatesAreFillable(coordinates) {
        let matrix = this.matrix;
        console.log('coordinates', coordinates);

        // check if coordinates array doesn't have the duplicate coordinates in itself
        let valuesSoFar = [];
        for (let i = 0; i < coordinates.length; i++) {
            let value = coordinates[i];
            console.log('value', value);
            console.log('valuesSoFar', valuesSoFar);
            for (let j = 0; j < valuesSoFar.length; j++) {
                if (valuesSoFar[j][0] === value[0] && valuesSoFar[j][1] === value[1]) {
                    return false;
                }
            }
            valuesSoFar.push(value);
        }

        // check if specific coordinate is not intersecting with the same coordinate in matrix
        for (let i = 0; i < coordinates.length; i++) {
            if (typeof matrix[coordinates[i][0]] !== 'undefined' && typeof matrix[coordinates[i][0]][coordinates[i][1]] !== 'undefined') {
                if (matrix[coordinates[i][0]][coordinates[i][1]] !== 0) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }
}

export default Field;