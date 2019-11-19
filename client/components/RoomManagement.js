import React, {useState, useEffect} from 'react';
import GameLink from './GameLink';
import RoomManagementBtns from './RoomManagementBtns';
import {createField} from "../utils/createField";
import Field from './Field';
import {usePiece} from "../hooks/usePiece";

const RoomManagement = (props) => {
    const [pieces, setPieces] = useState([{shape: 0}]);
    const [piece, resetPiece] = usePiece(0);
    const [field, setField] = useState(createField(6, 6));

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

            resetPiece(pieces[0].shape);

            return newField;
        };

        setField(updateField(field));
    }, [pieces]);

    const setFocusToField = () => {
        props.gameFieldRef.current.focus();
    };

    return (
        <div className="room__management" onClick={setFocusToField}>
            <GameLink game_id={props.game_id}/>
            <div className="future-block">
                <Field field={createField(6, 6)}/>
            </div>
            <RoomManagementBtns socket={props.socket} game_id={props.game_id}/>
        </div>
    );

};

export default RoomManagement;