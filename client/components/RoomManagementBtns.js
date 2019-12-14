import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {startGameAction} from "../actions/gameActions";

const RoomManagementBtns = (props) => {

    const [isGameStarted, setGameStarted] = useState(props.isGameStarted || false);
    const [isLeader, setLeader] = useState(props.isLeader || false);

    const onClickStartGame = () => {
        const socket = props.socket;
        socket.emit('startGameInRoom', props.roomId);
    };

    const onClickPause = (e) => {
        console.log('PAUSE');
    };

    const onClickToDashboard = () => {
        const socket = props.socket;
        const data = {
            roomId: props.roomId,
            nickname: props.user
        };

        socket.emit('leaveGame', props.roomId, props.user);
        socket.on('leftGame', (response) => {
            if (response) {
                props.history.push('/');
            }
        });
    };

    useEffect(() => {
        const socket = props.socket;
        socket.emit('isGameStarted', props.roomId);
        socket.on('gameStatus', (response) => {
            if (response === undefined) {
                props.history.push('/');
            }
        });

        socket.on('gameStarted', (response) => {
            console.log('in gameStarted socket');

            if (response.roomId === props.roomId) {
                setGameStarted(true);
            }
        });
    }, []);

    if (isLeader) {
        return (
            <div className="room-management__btns">
                {isGameStarted
                    ? <button className="nes-btn" onClick={onClickPause}>Pause</button>
                    : <button className="nes-btn" onClick={onClickStartGame}>Start</button>
                }
                <button className="nes-btn" onClick={onClickToDashboard}>Dashboard</button>
            </div>
        );
    } else {
        return (
            <div className="room-management__btns">
                <button className="nes-btn" onClick={onClickToDashboard}>Dashboard</button>
            </div>
        );
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startGameAction: () => {
            dispatch(startGameAction())
        }
    }
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        isGameStarted: state.room.isGameStarted,
        isLeader: state.room.isLeader
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomManagementBtns));