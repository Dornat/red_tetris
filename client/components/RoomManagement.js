import React from 'react';
import GameLink from './GameLink';
import RoomManagementBtns from './RoomManagementBtns';
import GamePlayers from './GamePlayers';

const RoomManagement = (props) => {

    const setFocusToField = () => {
        props.gameFieldRef.current.focus();
    };

    return (
        <div className="room__management" onClick={setFocusToField}>
            <div>
                <GameLink roomId={props.roomId}/>
                <GamePlayers socket={props.socket} opponent={props.opponent}/>
            </div>

            <RoomManagementBtns socket={props.socket} roomId={props.roomId} isLeader={props.isLeader}/>
        </div>
    );

};

export default RoomManagement;