import {useState, useCallback} from 'react';
import tetrominoes from '../utils/TetrominoesScheme';
import {COLUMN_AMOUNT} from "../utils/createField";

export const usePiece = (tetromino) => {
    const [piece, setPiece] = useState({
        position: {
            x: 0,
            y: 0
        },
        tetromino: tetrominoes[tetromino].shape
    });

    const updatePiecePosition = ({x, y}) => {
        setPiece(prev => ({
                ...prev,
                position: {
                    x: (prev.position.x += x),
                    y: (prev.position.y += y)
                }
            })
        )
    };

    const resetPiece = useCallback((tetromino) => {
        setPiece({
            position: {
                x: COLUMN_AMOUNT / 2 - 2, // to position the piece in the middle of game field
                y: 0
            },
            tetromino: tetrominoes[tetromino].shape
        });
    }, []);

    return [piece, updatePiecePosition, resetPiece];
};
