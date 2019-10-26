import React from 'react';
import GameLink from './GameLink';
import RoomManagementBtns from './RoomManagementBtns';

const RoomManagement = (props) => {

    return (
      <div className="room__management">
          <GameLink game_id={props.game_id}/>
          <div className="enemy__field"/>
          <RoomManagementBtns socket={props.socket}/>
      </div>
    );

};

export default RoomManagement;