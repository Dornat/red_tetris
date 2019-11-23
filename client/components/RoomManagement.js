import React from 'react';
import GameLink from './GameLink';
import RoomManagementBtns from './RoomManagementBtns';

const RoomManagement = (props) => {

    const setFocusToField = () => {
        props.gameFieldRef.current.focus();
    };

    return (
        <div className="room__management" onClick={setFocusToField}>
            <GameLink game_id={props.game_id}/>
            <RoomManagementBtns socket={props.socket} game_id={props.game_id}/>
        </div>
    );

};

export default RoomManagement;