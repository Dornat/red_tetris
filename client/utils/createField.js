export const COLUMN_AMOUNT = 10;
export const ROWS_AMOUNT = 20;
export const MINIMUM_ROWS_AMOUNT = 5;

export const createField = (rowsAmount = ROWS_AMOUNT, columnAmount = COLUMN_AMOUNT) => {
    return Array.from(
        Array(rowsAmount),
        () => {
            return new Array(columnAmount).fill([0, 'empty'])
        }
    );
};
