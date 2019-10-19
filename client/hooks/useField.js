import {useState, useEffect} from 'react';
import {createField} from "../utils/createField";

export const useField = (piece, resetPiece) => {
    const [field, setField] = useState(createField());

    useEffect(() => {
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
                            'empty',
                            `${piece.collided ? 'filled' : 'empty'}`
                        ]
                    }
                })
            });

            if (piece.collided) {
                resetPiece();
            }

            return newField;
        };

        setField(prev => updateField(prev));

    }, [piece, resetPiece]);

    return [field, setField];
};