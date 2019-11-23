import {useState, useEffect} from 'react';
import {createField} from "../utils/createField";

export const useField = (piece, resetPiece, pieces, piecesBuffer, setPieces, props) => {
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
                            `${piece.collided ? 'filled' : 'empty'}`
                        ]
                    }
                })
            });

            /**
             * For the record - piecesBuffer is used for seamless transition from one bunch of generated array of pieces
             * to another and of course for seamless usage in future block.
             */
            if (piece.collided) {
                if (pieces.length === 0) {
                    setPieces(piecesBuffer);
                    resetPiece(piecesBuffer[0].shape);
                    piecesBuffer.shift();
                    props.setPiecesAction(piecesBuffer[0].shape);
                } else {
                    resetPiece(pieces[0].shape);
                    pieces.shift();
                    if (pieces.length === 0) {
                        props.setPiecesAction(piecesBuffer[0].shape);
                    } else {
                        props.setPiecesAction(pieces[0].shape);
                    }
                }
                return sweepRows(newField);
            }

            return newField;
        };

        setField(prev => updateField(prev));

    }, [piece, resetPiece, pieces, piecesBuffer]);

    return [field, setField, rowsCleared];
};
