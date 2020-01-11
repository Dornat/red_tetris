import {useState, useEffect} from 'react';
import {createField} from '../utils/createField';
import {fieldDebug, piecesDebug} from '../utils/gameFieldHelpers';

export const useField = (piece, resetPiece, pieces, piecesBuffer, setPieces, setNextPieceAction) => {
    const [field, setField] = useState(createField());
    const [rowsCleared, setRowsCleared] = useState(0);

    /**
     * Checks if piece can be placed in a field. This function is needed for situations when field shrinks and the piece
     * can be pushed out of bounds on 'y' access.
     *
     * @param piece
     * @param field
     * @returns {boolean}
     */
    const isPieceCanBePlaced = (piece, field) => {
        piece.tetromino.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (field[y + piece.position.y] === undefined || field[y + piece.position.y][x + piece.position.x] === undefined) {
                        return false;
                    }
                }
            });
        });
        return true;
    };

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

            while (!isPieceCanBePlaced(piece, newField)) {
                console.log('in while isPieceCanBePlaces, piece.position.y', piece.position.y);
                piece.position.y = piece.position.y - 1;
            }
            // draw the tetromino
            piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        if (newField[y + piece.position.y] === undefined || newField[y + piece.position.y][x + piece.position.x] === undefined) {
                            // TODO Reset piece on y access for field shrink situations.
                            fieldDebug(newField, 'newField');
                            console.log('piece', piece);
                            console.log('value', value);
                            console.log('row', row);
                            console.log('y, piece.position.y, x, piece.position.x', y, piece.position.y, x, piece.position.x);
                        }
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
                    // console.log('IN IF (PIECES.LENGTH === 0)');
                    resetPiece(piecesBuffer[0].shape);
                    piecesBuffer.shift();
                    setPieces(piecesBuffer);

                    // console.log('NEXT PIECE SHOULD BE', piecesBuffer[0].shape);

                    setNextPieceAction(piecesBuffer[0].shape);
                } else {
                    // console.log('IN ELSE');
                    resetPiece(pieces[0].shape);
                    pieces.shift();

                    if (pieces.length === 0) {
                        // console.log('IN ELSE IN IF (PIECES.LENGTH === 0)');
                        // console.log('NEXT PIECE SHOULD BE', piecesBuffer[0].shape);
                        setNextPieceAction(piecesBuffer[0].shape);
                    } else {
                        // console.log('IN ELSE IN ELSE');
                        // console.log('NEXT PIECE SHOULD BE', pieces[0].shape);
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
