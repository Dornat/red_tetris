import GameLink from './GameLink';
import GamePlayers from './GamePlayers';
import PropTypes from 'prop-types';
import React from 'react';
import RoomManagementBtns from './RoomManagementBtns';
import {connect} from 'react-redux';
import Music from './Music';

const RoomManagement = (props) => {
    const setFocusToField = () => {
        props.gameFieldRef.current.focus();
    };

    return (
        <div className="room__management" onClick={setFocusToField}>
            <div>
                <Music/>
                <GameLink/>
                <GamePlayers socket={props.socket}/>
            </div>

            <RoomManagementBtns socket={props.socket}/>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        roomId: state.room.id,
        isLeader: state.room.isLeader,
        opponent: state.room.opponent,
    };
};

export default connect(mapStateToProps, null)(RoomManagement);

RoomManagement.propTypes = {
    roomId: PropTypes.string,
    socket: PropTypes.object,
    opponent: PropTypes.object,
    gameFieldRef: PropTypes.object,
};