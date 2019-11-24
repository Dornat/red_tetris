import React, {useEffect, useState, useRef} from 'react';
import RoomManagement from './RoomManagement'
import GameField from './GameField'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Loader from './Loader';
import ReactModal from 'react-modal';

const modalStyles = {
    content : {
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
    const MODAL_GAME_JOINED = 3;
    const MODAL_GAME_PAUSED = 4;

    const MSG_JOINED_GAME = 1;
    const MSG_PLAYER_ADDED = 2;
    const MSG_GAME_CREATED = 3;
    const ERROR_GAME_NOT_FOUND = 4;
    const ERROR_NO_SPACE_AVAILABLE = 5;

    const [gameId, setGameId] = useState(props.game_id || null);
    const [isGameExists, setGameExists] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(null);
    const [opponent, setOpponent] = useState(null);

    const gameFieldRef = useRef(null);

    const canJoinTheGame = (game_id) => {

        props.socket.emit('joinGame', {game_id: game_id});

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
                })
            });
        });
    };

    useEffect(() => {

        const handleJoining = async() => {
            try {
                const game_id = props.match.params.game_id;
                const locationState = props.location.state;

                let isGameCreator = false;

                if (typeof locationState !== "undefined" && typeof locationState.gameCreator !== "undefined") {
                    isGameCreator = locationState.gameCreator;
                }


                if (isGameCreator) {
                    return {msg: MSG_GAME_CREATED}
                }

                const { data: opponent, msg } = await canJoinTheGame(game_id);

                setOpponent(opponent);

                if (props.user) {
                    const {data: success, msg} = await acceptPlayer(props.user, game_id);

                    if (success) {
                        return {msg: msg}
                    }
                }
                else {
                    return {msg: msg}
                }
            }
            catch(e) {

                if (e.msg === ERROR_GAME_NOT_FOUND || e.msg === ERROR_NO_SPACE_AVAILABLE) {
                    return {msg: e.msg}
                }
            }
        };

        handleJoining().then((res) => {

            if (typeof res === "undefined") {
                return;
            }

            const msg = res.msg;

           switch(msg) {
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
                   setModal(MODAL_GAME_JOINED);
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

    }, []);


    const renderModalContent = () => {
        if (modal == MODAL_GAME_JOINED) {
            return (
                <div className="nes-dialog">
                    <i className="nes-squirtle"></i>
                    <h1>Game is paused</h1>
                </div>
            )
        }
        else if (modal == MODAL_NO_ROOM) {
            return (
                <h2>No such room</h2>
            );
        }
        else if (modal == MODAL_GAME_PAUSED) {
            return (
                <h2>Game is paused</h2>
            )
        }
        else if (modal == MODAL_NO_SPACE) {
            return (
                <h2>No space in room</h2>
            )
        }

    };

    console.log("IS OPEN", isOpen);

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
                    <GameField socket={props.socket} game_id={gameId} user={props.user} gameFieldRef={gameFieldRef}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement game_id={gameId} socket={props.socket} gameFieldRef={gameFieldRef}/>
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