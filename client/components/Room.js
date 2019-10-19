import React from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'

const Room = () => {

    return (
        <div className="row">
            <div className="game__container">
                <GameField/>
            </div>
            <div className="room-management__container">
                <RoomManagement/>
            </div>
        </div>
    );
};

export default Room;