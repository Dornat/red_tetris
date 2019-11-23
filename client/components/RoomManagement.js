import React, {useState, useEffect} from 'react';
import GameLink from './GameLink';
import RoomManagementBtns from './RoomManagementBtns';
import {createField} from "../utils/createField";
import Field from './Field';
import {usePiece} from "../hooks/usePiece";
import {connect} from 'react-redux';
import tetrominoes from '../utils/TetrominoesScheme';

const RoomManagement = (props) => {
    const [piece, setPiece] = useState({
        position: {
            x: 0,
            y: 0
        },
        tetromino: tetrominoes[0].shape,
        collided: false
    });
    const [field, setField] = useState(createField(6, 6));

    useEffect(() => {
        setPiece({
            position: {
                x: 1, // to position the piece in the middle of game field
                y: 1
            },
            tetromino: tetrominoes[props.pieces === null ? 0 : props.pieces].shape,
            collided: true
        });
    }, [props.pieces]);

    useEffect(() => {
        const updateField = prevField => {
            // clear field from the previous render
            const newField = prevField.map(
                row => {
                    return row.map(() => [0, 'empty'])
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

            return newField;
        };

        setField(updateField(field));

    }, [piece]);

    const setFocusToField = () => {
        props.gameFieldRef.current.focus();
    };

    return (
        <div className="room__management" onClick={setFocusToField}>
            <GameLink game_id={props.game_id}/>
            <div className="future-block">
                <Field field={field}/>
            </div>
            <RoomManagementBtns socket={props.socket} game_id={props.game_id}/>
        </div>
    );

};

const mapStateToProps = (state) => {
    return {
        pieces: state.game.pieces
    }
};

export default connect(mapStateToProps, null)(RoomManagement);