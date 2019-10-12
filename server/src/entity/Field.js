const COLUMN_AMOUNT = 10;
const ROWS_AMOUNT = 20;

class Field {
    constructor() {
        this.columnAmount = COLUMN_AMOUNT;
        this.rowAmount = ROWS_AMOUNT;
    }

    destroyRow() {
        this.rowAmount =- 1;
    }
}

export