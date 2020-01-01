import {useState, useCallback} from 'react';
import tetrominoes from '../utils/TetrominoesScheme';
import {COLUMN_AMOUNT} from '../utils/createField';
import {checkCollision} from '../utils/checkCollision';

export const usePiece = (tetromino) => {
    const [piece, setPiece] = useState({
        position: {
            x: 0,
            y: 0
        },
        tetromino: tetrominoes[tetromino].shape,
        collided: false
    });

    const rotate = (tetrominoMatrix, direction) => {
        // make the rows to become columns
        const rotatedTetromino = tetrominoMatrix.map((_, index) => {
            return tetrominoMatrix.map(column => column[index]);
        });

        // reverse each row to get a rotated matrix
        if (direction > 0) {
            return rotatedTetromino.map(row => {
                return row.reverse();
            });
        }
        return rotatedTetromino.reverse();
    };

    const pieceRotate = (field, direction) => {
        const pieceClone = JSON.parse(JSON.stringify(piece));
        pieceClone.tetromino = rotate(pieceClone.tetromino, direction);

        const position = pieceClone.position.x;
        let offset = 1;

        while (checkCollision(pieceClone, field, {x: 0, y: 0})) {
            pieceClone.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > pieceClone.tetromino[0].length) {
                 rotate(pieceClone.tetromino, -direction);
                 pieceClone.position.x = position;
                 return;
            }
        }

        setPiece(pieceClone);
    };

    /**
     * Updates piece position on field.
     *
     * @param {number} x Horizontal movement direction, can be -1 or 0 or 1.
     * @param {number} y Vertical movement direction, can be 0 or 1.
     * @param {boolean} collided Tells field whether the piece finished its movement.
     */
    const updatePiecePosition = ({x, y, collided}) => {
        setPiece(prev => ({
                ...prev,
                position: {
                    x: (prev.position.x += x),
                    y: (prev.position.y += y)
                },
                collided
            })
        );
    };

    /**
     * @param {char} tetromino
     * @param {number} columnAmount
     */
    const resetPiece = useCallback((tetromino, columnAmount = COLUMN_AMOUNT) => {
        console.log('resetPiece callback, TETROMINO', tetromino);
        setPiece({
            position: {
                x: columnAmount / 2 - 2, // to position the piece in the middle of game field
                y: 0
            },
            tetromino: tetrominoes[tetromino].shape,
            collided: false
        });
    }, []);

    return [piece, updatePiecePosition, resetPiece, pieceRotate];
};
