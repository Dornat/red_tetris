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

    const [isGameExists, setGameExists] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const gameFieldRef = useRef(null);

    useEffect(() => {
        /* TODO Finish logic */
        if (props.game_id === null || props.user === '' || props.user === null) {
            props.history.push('/');
        }
        setGameExists(true);
    });

    function openModal() {
        setIsOpen(true);
    }


    const afterOpenModal = () => {
        console.log("AFTER OPEN MODAL");
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const renderModalContent = () => {
        if (1) {
            return (
                <div className="nes-dialog">
                    <i className="nes-squirtle"></i>
                    <h1>Game is paused</h1>
                </div>
            )
        }

    };

    const renderOnGame = () => {
        return (
            <div className="row">
                <ReactModal
                    isOpen={isOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    style={modalStyles}
                    contentLabel="Example Modal"
                >
                    {renderModalContent()}
                </ReactModal>
                <div className="game__container">
                    <GameField socket={props.socket} game_id={props.game_id} user={props.user} gameFieldRef={gameFieldRef}/>
                </div>
                <div className="room-management__container">
                    <RoomManagement game_id={props.game_id} socket={props.socket} gameFieldRef={gameFieldRef}/>
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