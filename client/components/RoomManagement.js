import React from 'react';
import GameLink from './GameLink';

const RoomManagement = (props) => {

    return (
      <div className="room__management">
          <GameLink game_id={props.game_id}/>
      </div>
    );

};

export default RoomManagement;