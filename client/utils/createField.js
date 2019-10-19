export const COLUMN_AMOUNT = 10;
export const ROWS_AMOUNT = 20;
export const MINIMUM_ROWS_AMOUNT = 5;

export const createField = () => {
    return Array.from(
        Array(ROWS_AMOUNT),
        () => {
            return new Array(COLUMN_AMOUNT).fill([0, '0'])
        }
    );
};
