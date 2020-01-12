import React, {useEffect, useState, useRef} from 'react';
import PropTypes from 'prop-types';
import RoomManagement from './RoomManagement';
import GameField from './GameField';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Loader from './Loader';
import ReactModal from 'react-modal';
import JoinGame from './Form/JoinGame';
import {
    joinRoomAction,
    setRoomAction,
    setLeaderAction,
    setOpponentAction,
    removeOpponentAction, setMusicTrackAction
} from '../actions/roomActions';

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
    const MODAL_GAME_OVER = 5;

    const MSG_JOINED_ROOM = 1;
    const MSG_PLAYER_ADDED = 2;
    const MSG_GAME_CREATED = 3;
    const ERROR_ROOM_NOT_FOUND = 4;
    const ERROR_NO_SPACE_AVAILABLE = 5;

    const [isRoomExists, setRoomExists] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [modal, setModal] = useState(null);

    const gameFieldRef = useRef(null);

    /**
     * Checks if somebody can join the room.
     *
     * @param roomId
     * @returns {Promise<*>}
     */
    const canJoinRoom = async (roomId) => {
        return new Promise((resolve, reject) => {
            props.socket.emit('canJoinRoom', roomId);
            props.socket.on('canJoinRoom', (response) => {
                if (response.success) {
                    resolve({msg: MSG_JOINED_ROOM});
                }
                reject({msg: ERROR_ROOM_NOT_FOUND});
            });
        });
    };

    /**
     * Adds player to specific room.
     *
     * @param roomId
     * @param nickname
     * @returns {Promise<*>}
     */
    const acceptPlayer = async (roomId, nickname) => {
        return new Promise((resolve, reject) => {
            props.socket.emit('acceptPlayer', roomId, nickname);
            props.socket.on('playerWasAccepted', (response) => {
                if (response.success) {
                    resolve({msg: MSG_PLAYER_ADDED});
                }
                reject({msg: ERROR_NO_SPACE_AVAILABLE}); // It also can be that the player nickname is not unique.
            });
        });
    };

    useEffect(() => {
        const handleJoining = async () => {
            try {
                const locationState = props.location.state;

                let isRoomCreator = false;

                if (typeof locationState !== 'undefined' && typeof locationState.gameCreator !== 'undefined') {
                    isRoomCreator = locationState.gameCreator;
                }

                const roomIdFromUrl = props.match.params.id;

                // When creator refreshes the page he needs to return to the room that he's created recently.
                if (props.roomId === null && props.isLeader == null && isRoomCreator) {
                    props.socket.emit('join', roomIdFromUrl, props.user);
                    props.setRoomAction(roomIdFromUrl);
                    props.setLeaderAction(true);
                }

                if (isRoomCreator) {
                    return {msg: MSG_GAME_CREATED};
                }

                /**
                 * We can reach this place only when somebody joined the room using url.
                 */
                if (roomIdFromUrl === null) {
                    props.history.push('/'); // Should never reach here.
                }

                const joined = await canJoinRoom(roomIdFromUrl);
                props.setRoomAction(roomIdFromUrl);

                if (props.user) {
                    props.socket.emit('join', roomIdFromUrl, props.user);
                    const accepted = await acceptPlayer(roomIdFromUrl, props.user);
                    props.joinRoomAction(roomIdFromUrl, false);
                    return {msg: accepted.msg};
                } else {
                    props.socket.emit('join', roomIdFromUrl);
                    return {msg: joined.msg};
                }
            } catch (e) {
                if (e.msg === ERROR_ROOM_NOT_FOUND || e.msg === ERROR_NO_SPACE_AVAILABLE) {
                    return {msg: e.msg};
                }
            }
        };

        handleJoining().then(result => {
            const msg = result.msg;
            switch (msg) {
                case MSG_GAME_CREATED: {
                    setRoomExists(true);
                    break;
                }
                case MSG_PLAYER_ADDED: {
                    setRoomExists(true);
                    props.setLeaderAction(false);
                    break;
                }
                case MSG_JOINED_ROOM: {
                    setRoomExists(true);
                    setModal(MODAL_ROOM_JOINED);
                    setIsModalOpened(true);
                    break;
                }
                case ERROR_ROOM_NOT_FOUND: {
                    setModal(MODAL_NO_ROOM);
                    setIsModalOpened(true);
                    setRoomExists(true);
                    break;
                }
                case ERROR_NO_SPACE_AVAILABLE: {
                    setModal(MODAL_NO_SPACE);
                    setIsModalOpened(true);
                    setRoomExists(true);
                    break;
                }
                default: {
                    break;
                }
            }
        }, error => {
            console.warn(error);
        }).catch(reason => {
            console.warn(reason);
        });

        props.socket.on('playerJoined', (players) => {
            const opponent = Object.values(players).find(player => player.nickname !== props.user);
            props.setOpponentAction(opponent);
        });

        props.socket.on('leftGame', (response) => {
            if (response.player === props.user) {
                props.socket.emit('disconnect');
                props.history.push('/');
            } else {
                if (response.isLeader && (props.isLeader === false || typeof props.isLeader === 'undefined')) {
                    props.setLeaderAction(true);
                }
            }
            props.removeOpponentAction();
        });

        props.socket.on('gameOver', () => {
            setModal(MODAL_GAME_OVER);
            setIsModalOpened(true);
        });

        props.setMusicTrackAction('newBeginnings');
        return () => {
            props.setMusicTrackAction('boscage');
            props.socket.removeAllListeners();
        };
    }, []);

    const closeModalAndEnrollNewPlayerIntoTheGame = () => {
        acceptPlayer(props.roomId, props.user).then(() => {
            setRoomExists(true);
            setIsModalOpened(false);
        }).catch(() => {
            setIsModalOpened(true);
            setModal(MODAL_NO_SPACE);
        });
    };

    const toDashBoard = () => props.socket.emit('leaveGame', props.roomId, props.user);

    const straightToDashboard = () => props.history.push('/');

    const renderModalContent = () => {
        if (modal === MODAL_ROOM_JOINED) {
            return (
                <div className="nes-dialog">
                    <JoinGame onClick={closeModalAndEnrollNewPlayerIntoTheGame}/>
                </div>
            );
        } else if (modal === MODAL_NO_ROOM) {
            return (
                <div className="nes-dialog">
                    <h2>No such room</h2>
                    <button className="nes-btn" onClick={straightToDashboard}>To Dashboard</button>
                </div>
            );
        } else if (modal === MODAL_GAME_PAUSED) {
            return (
                <div className="nes-dialog">
                    <h2>Game is paused</h2>
                </div>
            );
        } else if (modal === MODAL_NO_SPACE) {
            return (
                <div className="nes-dialog">
                    <h2>No space in room</h2>
                    <button className="nes-btn" onClick={straightToDashboard}>To Dashboard</button>
                </div>
            );
        } else if (modal === MODAL_GAME_OVER) {
            return (
                <div className="nes-dialog">
                    <h2>Game Over!</h2>
                    <button className="nes-btn" onClick={toDashBoard}>To Dashboard</button>
                </div>
            );
        }
    };

    const renderOnGame = () => {
        return (
            <div className="row">
                <ReactModal
                    isOpen={isModalOpened}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >
                    {renderModalContent()}
                </ReactModal>
                <div className="game__container">
                    <GameField socket={props.socket} gameFieldRef={gameFieldRef}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement socket={props.socket} gameFieldRef={gameFieldRef}/>
                </div>
            </div>
        );
    };

    return isRoomExists ? renderOnGame() : <Loader/>;
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        roomId: state.room.id,
        isLeader: state.room.isLeader,
        opponent: state.room.opponent,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinRoomAction: (roomId, isLeader) => {
            dispatch(joinRoomAction(roomId, isLeader));
        },
        setRoomAction: (roomId) => {
            dispatch(setRoomAction(roomId));
        },
        setLeaderAction: (isLeader) => {
            dispatch(setLeaderAction(isLeader));
        },
        setOpponentAction: (opponent) => {
            dispatch(setOpponentAction(opponent));
        },
        removeOpponentAction: () => {
            dispatch(removeOpponentAction());
        },
        setMusicTrackAction: (musicTrackName) => {
            dispatch(setMusicTrackAction(musicTrackName));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Room));

Room.propTypes = {
    roomId: PropTypes.string,
    user: PropTypes.string,
    isLeader: PropTypes.bool,
    socket: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    joinRoomAction: PropTypes.func,
    setRoomAction: PropTypes.func,
    setLeaderAction: PropTypes.func,
    setOpponentAction: PropTypes.func,
    setMusicTrackAction: PropTypes.func,
    removeOpponentAction: PropTypes.func,
};