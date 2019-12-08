import React, {useEffect, useState, useRef} from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Loader from './Loader';
import ReactModal from 'react-modal';
import JoinGame from './Form/JoinGame';
import {joinGameAction} from "../actions/gameActions";

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid'
    }
};

ReactModal.setAppElement('#app');

const Room = (props) => {
    const MODAL_NO_ROOM = 1;
    const MODAL_NO_SPACE = 2;
    const MODAL_ROOM_JOINED = 3;
    const MODAL_GAME_PAUSED = 4;

    const MSG_JOINED_GAME = 1;
    const MSG_PLAYER_ADDED = 2;
    const MSG_GAME_CREATED = 3;
    const ERROR_GAME_NOT_FOUND = 4;
    const ERROR_NO_SPACE_AVAILABLE = 5;

    const [roomId, setRoomId] = useState(props.room_id || null);
    const [isGameExists, setGameExists] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [opponent, setOpponent] = useState(null);

    const gameFieldRef = useRef(null);

    const canJoinTheGame = (game_id) => {
        props.socket.emit('join', game_id);
        props.socket.emit('joinGame', {game_id: game_id});
        props.joinGameAction(game_id);

        return new Promise((resolve, reject) => {
            props.socket.on('gameJoined', (response) => {
                if (response.success) {
                    resolve({
                        opponent: response.data.opponent,
                        msg: MSG_JOINED_GAME
                    });
                }
                reject({
                    msg: ERROR_GAME_NOT_FOUND
                });
            });
        });
    };

    const acceptPlayer = (user, game_id) => {
        props.socket.emit('acceptPlayer', {
            game_id: game_id,
            nickname: user
        });

        return new Promise((resolve, reject) => {
            props.socket.on('playerWasAccepted', (response) => {
                if (response.success) {
                    resolve({
                        success: response.success,
                        msg: MSG_PLAYER_ADDED
                    });
                }

                reject({
                    success: response.success,
                    msg: ERROR_NO_SPACE_AVAILABLE
                });
            });
        });
    };

    useEffect(() => {
        // props.socket.emit('acceptPlayer', {nickname: props.user});
    }, []);

    useEffect(() => {
        const handleJoining = async () => {
            try {
                const locationState = props.location.state;
                console.log('props', props);

                let isGameCreator = false;

                if (typeof locationState !== "undefined" && typeof locationState.gameCreator !== "undefined") {
                    isGameCreator = locationState.gameCreator;
                }

                // TODO: FIX THIS!
                // if (props.game_id === null) {
                //     props.socket.emit('annulGame', {
                //        nickname: props.user
                //     });
                //     props.history.push('/');
                // }

                if (isGameCreator) {
                    return {msg: MSG_GAME_CREATED};
                }
                //
                // const canJoinGame = await canJoinTheGame(game_id);
                //
                // setOpponent(canJoinGame.opponent);
                //
                // if (props.user) {
                //     const accepted = await acceptPlayer(props.user, game_id);
                //
                //     if (accepted.success) {
                //         return {msg: accepted.msg}
                //     }
                // } else {
                //     return {msg: canJoinGame.msg}
                // }
            } catch (e) {
                if (e.msg === ERROR_GAME_NOT_FOUND || e.msg === ERROR_NO_SPACE_AVAILABLE) {
                    return {msg: e.msg};
                }
            }
        };

        handleJoining().then((res) => {
            if (typeof res === "undefined") {
                return;
            }

            const msg = res.msg;

            switch (msg) {
                case MSG_GAME_CREATED: {
                    setGameExists(true);
                    break;
                }
                case MSG_PLAYER_ADDED: {
                    setGameExists(true);
                    break;
                }
                case MSG_JOINED_GAME: {
                    setGameExists(true);
                    setModal(MODAL_ROOM_JOINED);
                    setIsOpen(true);
                    break;
                }
                case ERROR_GAME_NOT_FOUND: {
                    setModal(MODAL_NO_ROOM);
                    setIsOpen(true);
                    setGameExists(true);
                    break;
                }
                case ERROR_NO_SPACE_AVAILABLE: {
                    setModal(MODAL_NO_SPACE);
                    setIsOpen(true);
                    setGameExists(true);
                    break;
                }
                default: {
                    break;
                }
            }
        });

        props.socket.on('playersJoined', (data) => {
            const opponent = data.find((player) => player.nickname !== props.user);
            setOpponent({nickname: opponent.nickname, isLeader: opponent.isLeader});
        });
    }, []);


    const closeModalAndEnrollNewPlayerIntoTheGame = () => {
        setIsOpen(false);
        acceptPlayer(props.user, roomId);
    };

    const renderModalContent = () => {
        if (modal === MODAL_ROOM_JOINED) {
            return (
                <div className="nes-dialog">
                    <JoinGame onClick={closeModalAndEnrollNewPlayerIntoTheGame}/>
                </div>
            );
        } else if (modal === MODAL_NO_ROOM) {
            return (
                <h2>No such room</h2>
            );
        } else if (modal === MODAL_GAME_PAUSED) {
            return (
                <h2>Game is paused</h2>
            );
        } else if (modal === MODAL_NO_SPACE) {
            return (
                <h2>No space in room</h2>
            );
        }
    };

    const renderOnGame = () => {
        return (
            <div className="row">
                <ReactModal
                    isOpen={isOpen}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >
                    {renderModalContent()}
                </ReactModal>
                <div className="game__container">
                    <GameField socket={props.socket} game_id={roomId} user={props.user} gameFieldRef={gameFieldRef}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement game_id={roomId} socket={props.socket} gameFieldRef={gameFieldRef}
                                    opponent={opponent}/>
                </div>
            </div>
        );
    };

    return isGameExists ? renderOnGame() : <Loader/>;
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        room_id: state.room.id
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinGameAction: (gameId) => {
            dispatch(joinGameAction(gameId))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Room));