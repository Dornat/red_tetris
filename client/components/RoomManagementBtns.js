import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {startGameAction} from "../actions/gameActions";

const RoomManagementBtns = (props) => {

    const [isGameStarted, setGameStarted] = useState(props.isGameStarted || false);
    const [isLeader, setLeader] = useState(props.isLeader || false);

    const onClickStartGame = () => {

        const socket = props.socket;
        const game_id = props.game_id;

        socket.emit("startGame", game_id);

        socket.on("gameStarted", (response) => {
            if (response.game_id === game_id) {
                setGameStarted(true);
                props.startGameAction();
            }
        });
    };

    const onClickPause = (e) => {
        console.log("PAUSE");
    };

    const onClickToDashboard = () => {
        const socket = props.socket;
        const data = {
            game_id: props.game_id,
            nickname: props.user
        };

        socket.emit("leaveGame", data);
        socket.on("leftGame", (response) => {

            console.log("RESPONSE", response);
            if (response) {
                props.history.push("/");
            }
        });
    };

    useEffect(() => {
        const socket = props.socket;
        const game_id = props.game_id;

        socket.emit("isGameStarted", game_id);

        socket.on("gameStatus", (response) => {
            if (response === undefined) {
                props.history.push('/');
            }
        });
    }, []);

    if (isLeader) {
        return (
            <div className="room-management__btns">
                { isGameStarted ? <button className="nes-btn" onClick={onClickPause}>Pause</button> :
                    <button className="nes-btn" onClick={onClickStartGame}>Start</button>}
                <button className="nes-btn" onClick={onClickToDashboard}>Dashboard</button>
            </div>
        );
    }
    else {
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
        isGameStarted: state.game.isGameStarted,
        isLeader: state.game.isLeader
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RoomManagementBtns));