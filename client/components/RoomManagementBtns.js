import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {startGameAction} from '../actions/gameActions';
import {setMusicTrackAction} from '../actions/roomActions';

const RoomManagementBtns = (props) => {
    const [isGameStarted, setGameStarted] = useState(props.isGameStarted || false);

    const onClickStartGame = () => {
        props.socket.emit('startGameInRoom', props.roomId);
        props.setMusicTrackAction('halfLife');
    };

    const toDashboard = () => {
        props.setMusicTrackAction('boscage');
        props.socket.emit('leaveGame', props.roomId, props.user);
    };

    useEffect(() => {
        const socket = props.socket;
        socket.emit('isGameStarted', props.roomId);
        socket.on('gameStarted', (response) => {
            if (response.roomId === props.roomId) {
                setGameStarted(true);
            }
        });

        return () => {
            props.setMusicTrackAction('boscage');
        };
    }, []);

    if (props.isLeader) {
        return (
            <div className="room-management__btns">
                {!isGameStarted && <button className="nes-btn" onClick={onClickStartGame}>Start</button>}
                <button className="nes-btn" onClick={toDashboard}>Dashboard</button>
            </div>
        );
    } else {
        return (
            <div className="room-management__btns">
                <button className="nes-btn" onClick={toDashboard}>Dashboard</button>
            </div>
        );
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        startGameAction: () => {
            dispatch(startGameAction());
        },
        setMusicTrackAction: (musicTrackName) => {
            dispatch(setMusicTrackAction(musicTrackName));
        },
    };
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        isGameStarted: state.room.isGameStarted,
        isLeader: state.room.isLeader,
        roomId: state.room.id,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomManagementBtns));