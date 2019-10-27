import React, {useEffect, useState} from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'
import {createField} from "../utils/createField";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Loader from './Loader';

const Room = (props) => {

    const [isGameExists, setGameExists] = useState(false);

    useEffect(() => {
        /* TODO Finish logic */
        if (props.game_id === null || props.user === '' || props.user === null) {
            props.history.push('/');
        }
        setGameExists(true);
    });


    const renderOnGame = () => {
        return (
            <div className="row">
                <div className="game__container">
                    <GameField field={createField()} socket={props.socket} game_id={props.game_id}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement game_id={props.game_id} socket={props.socket}/>
                </div>
            </div>
        );
    };

    return isGameExists ? renderOnGame() : <Loader/>
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        game_id: state.game.id
    }
};

export default connect(mapStateToProps, null)(withRouter(Room));