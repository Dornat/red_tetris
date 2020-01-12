import {checkCollision} from '../utils/checkCollision';
import {createField} from '../utils/createField';
import {fieldDebug, piecesDebug} from '../utils/gameFieldHelpers';
import {useState, useEffect} from 'react';

/**
 * Checks if piece can be placed in a field. This function is needed for situations when field shrinks and the piece
 * can be pushed out of bounds on 'y' access.
 *
 * @param piece
 * @param field
 * @returns {boolean}
 */
export const isPieceCanBePlaced = (piece, field) => {
    piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                if (field[y + piece.position.y] === undefined || field[y + piece.position.y][x + piece.position.x] === undefined) {
                    return false;
                }
            }
        });
    });

    if (piece.position.y > 0) {
        return !checkCollision(piece, field, {x: 0, y: 0});
    } else {
        return true;
    }
};

export const useField = (piece, resetPiece, pieces, piecesBuffer, setPieces, setNextPieceAction) => {
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
                    );
                }
            );

            // draw the tetromino
            piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newField[y + piece.position.y][x + piece.position.x] = [
                            value,
                            `${piece.collided ? 'filled' : 'empty'}`
                        ];
                    }
                });
            });

            // TODO Fix the bug. Should be here somewhere!
            /**
             * For the record - piecesBuffer is used for seamless transition from one bunch of generated array of pieces
             * to another one and of course for seamless usage in next piece block.
             */
            if (piece.collided) {
                if (pieces.length === 0) {
                    resetPiece(piecesBuffer[0].shape);
                    piecesBuffer.shift();
                    setPieces(piecesBuffer);
                    setNextPieceAction(piecesBuffer[0].shape);
                } else {
                    resetPiece(pieces[0].shape);
                    pieces.shift();
                    if (pieces.length === 0) {
                        setNextPieceAction(piecesBuffer[0].shape);
                    } else {
                        setNextPieceAction(pieces[0].shape);
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
