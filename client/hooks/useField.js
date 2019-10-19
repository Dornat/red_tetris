import {useState, useEffect} from 'react';
import {createField} from "../utils/createField";

export const useField = (piece, resetPiece) => {
    const [field, setField] = useState(createField());

    useEffect(() => {
        const updateField = prevField => {
            // flush the field
            const newField = prevField.map(
                row => {
                    return row.map(
                        cell => (cell[1] === '0' ? [0, '0'] : cell)
                    )
                }
            );

            // draw the tetromino
            piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newField[y + piece.position.y][x + piece.position.x] = [
                            value,
                            //todo merge clear
                        ]
                    }
                })
            })

            return newField;
        };

        setField(prev => updateField(prev));

    }, [piece.position.x, piece.position.y, piece.tetromino]);

    return [field, setField];
};
