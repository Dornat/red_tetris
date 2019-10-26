import React from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'
import {createField} from "../utils/createField";

const Room = (props) => {

    return (
        <div className="row">
            <div className="game__container">
                <GameField field={createField()} socket={props.socket}/>
            </div>
            <div className="room-management__container">
                <RoomManagement/>
            </div>
        </div>
    );
};

export default Room;