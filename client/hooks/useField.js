import {useState, useEffect} from 'react';
import {createField} from "../utils/createField";

export const useField = (piece, resetPiece, pieces) => {
    const [field, setField] = useState(createField());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newField => {
            return newField.reduce((accumulator, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    accumulator.unshift(new Array(newField[0].length).fill([0, 'empty']));
                    return accumulator;
                }
                accumulator.push(row);
                return accumulator;
            }, []);
        };

        const updateField = prevField => {
            // clear field from the previous render
            const newField = prevField.map(
                row => {
                    return row.map(
                        cell => (cell[1] === 'empty' ? [0, 'empty'] : cell)
                    )
                }
            );

            // draw the tetromino
            piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newField[y + piece.position.y][x + piece.position.x] = [
                            value,
                            // 'empty',
                            `${piece.collided ? 'filled' : 'empty'}`
                        ]
                    }
                })
            });

            if (piece.collided) {
                resetPiece(pieces[0].shape);
                pieces.shift();
                return sweepRows(newField);
            }

            return newField;
        };

        setField(prev => updateField(prev));

    }, [piece, resetPiece, pieces]);

    return [field, setField, rowsCleared];
};
