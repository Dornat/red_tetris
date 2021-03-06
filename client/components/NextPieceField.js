import Field from './Field';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import tetrominoes from '../utils/TetrominoesScheme';
import {connect} from 'react-redux';
import {createField} from '../utils/createField';

const NextPieceField = (props) => {
    const [piece, setPiece] = useState({
        position: {
            x: 0,
            y: 0
        },
        tetromino: tetrominoes[0].shape,
        collided: false
    });
    const [field, setField] = useState(createField(5, 6));

    useEffect(() => {
        setPiece({
            position: {
                x: 1, // to position the piece in the middle of game field
                y: 1
            },
            tetromino: tetrominoes[props.nextPiece === null ? 0 : props.nextPiece].shape,
            collided: true
        });
    }, [props.nextPiece]);

    useEffect(() => {
        const updateField = prevField => {
            // clear field from the previous render
            const newField = prevField.map(
                row => {
                    return row.map(() => [0, 'empty']);
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

            return newField;
        };

        setField(updateField(field));

    }, [piece]);

    return (
        <div className="future-block">
            <Field field={field}/>
        </div>
    );

};

const mapStateToProps = (state) => {
    return {
        nextPiece: state.game.nextPiece
    };
};

export default connect(mapStateToProps, null)(NextPieceField);

NextPieceField.propTypes = {
    nextPiece: PropTypes.string
};
