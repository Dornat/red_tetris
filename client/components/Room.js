import React, {useEffect, useState, useRef} from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Loader from './Loader';
import ReactModal from 'react-modal';
import JoinGame from './Form/JoinGame';
import {joinRoomAction, setLeaderAction, setOpponentAction, removeOpponentAction} from "../actions/roomActions";

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

    const [roomId, setRoomId] = useState(props.roomId || null);
    const [isRoomExists, setRoomExists] = useState(false);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [modal, setModal] = useState(null);
    const [opponent, setOpponent] = useState(null);

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
                console.log('in acceptPlayer, response', response);
                if (response.success) {
                    resolve({msg: MSG_PLAYER_ADDED});
                }
                reject({msg: ERROR_NO_SPACE_AVAILABLE}); // It also can be that the player nickname is not unique.
            });
        });
    };

    useEffect(() => {
        console.log('in Room component, props', props);
        const handleJoining = async () => {
            try {
                const locationState = props.location.state;
                console.log('props', props);
                console.log('match room id', props.match.params.id);

                let isRoomCreator = false;
                if (typeof locationState !== "undefined" && typeof locationState.gameCreator !== "undefined") {
                    isRoomCreator = locationState.gameCreator;
                }
                if (isRoomCreator) {
                    return {msg: MSG_GAME_CREATED};
                }

                /**
                 * We can reach this place only when somebody joining the room using url.
                 */
                const roomIdFromUrl = props.match.params.id;
                console.log('roomId', roomIdFromUrl);
                if (roomIdFromUrl === null) {
                    props.history.push('/'); // Should never reach here.
                }

                const joined = await canJoinRoom(roomIdFromUrl);
                props.socket.emit('join', roomIdFromUrl);
                setRoomId(roomIdFromUrl);

                if (props.user) {
                    const accepted = await acceptPlayer(roomIdFromUrl, props.user);
                    props.joinRoomAction(roomIdFromUrl);
                    return {msg: accepted.msg};
                } else {
                    return {msg: joined.msg};
                }
            } catch (e) {
                console.log('e', e);
                if (e.msg === ERROR_ROOM_NOT_FOUND || e.msg === ERROR_NO_SPACE_AVAILABLE) {
                    return {msg: e.msg};
                }
            }
        };

        handleJoining().then(result => {
            console.log('in handleJoining, result', result);
            const msg = result.msg;
            switch (msg) {
                case MSG_GAME_CREATED: {
                    console.log('MSG_GAME_CREATED');
                    setRoomExists(true);
                    break;
                }
                case MSG_PLAYER_ADDED: {
                    console.log('MSG_PLAYER_ADDED');
                    setRoomExists(true);
                    break;
                }
                case MSG_JOINED_ROOM: {
                    console.log('MSG_JOINED_ROOM');
                    setRoomExists(true);
                    setModal(MODAL_ROOM_JOINED);
                    setIsModalOpened(true);
                    break;
                }
                case ERROR_ROOM_NOT_FOUND: {
                    console.log('ERROR_ROOM_NOT_FOUND');
                    setModal(MODAL_NO_ROOM);
                    setIsModalOpened(true);
                    setRoomExists(true);
                    break;
                }
                case ERROR_NO_SPACE_AVAILABLE: {
                    console.log('ERROR_NO_SPACE_AVAILABLE');
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
            console.log('error', error);
        }).catch(reason => {
            console.log('error reason', reason);
        });

        props.socket.on('playerJoined', (players) => {
            const opponent = Object.values(players).find(player => player.nickname !== props.user);
            props.setOpponentAction(opponent);
            console.log('in playerJoined, props', props);
        });

        props.socket.on('roomStatus', (data) => {
            if (data === 'undefined') {
                setModal(MODAL_GAME_OVER);
                setIsModalOpened(true);
            }
        });

        props.socket.on('leftGame', (response) => {
            console.log('in Room, leftGame response', response);
            if (response.player === props.user) {
                props.history.push('/');
            } else {
                console.log('in else of leftGame socket, props', props);
                console.log('opponent', opponent);
                if (props.opponent.isLeader) {
                    props.setLeaderAction(true);
                    props.removeOpponentAction();
                }
            }
        });
    }, []);

    const closeModalAndEnrollNewPlayerIntoTheGame = () => {
        acceptPlayer(roomId, props.user).then(result => {
            console.log('acceptPlayer result', result);
            setRoomExists(true);
            setIsModalOpened(false);
        }).catch(reason => {
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
                    <GameField socket={props.socket} roomId={roomId} user={props.user} gameFieldRef={gameFieldRef}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement roomId={roomId} socket={props.socket} gameFieldRef={gameFieldRef}
                                    opponent={opponent}/>
                </div>
            </div>
        );
    };

    return isRoomExists ? renderOnGame() : <Loader/>;
};

const mapStateToProps = (state) => {
    console.log('in Room mapStateToProps, state', state);
    return {
        user: state.user.nickname,
        roomId: state.room.id,
        isLeader: state.room.isLeader,
        opponentNickname: state.room.opponent ? state.room.opponent.nickname : null,
        opponentIsLeader: state.room.opponent ? state.room.opponent.isLeader : null
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        joinRoomAction: (roomId, isLeader) => {
            dispatch(joinRoomAction(roomId, isLeader))
        },
        setLeaderAction: (isLeader) => {
            dispatch(setLeaderAction(isLeader))
        },
        setOpponentAction: (opponent) => {
            dispatch(setOpponentAction(opponent))
        },
        removeOpponentAction: () => {
            dispatch(removeOpponentAction())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Room));