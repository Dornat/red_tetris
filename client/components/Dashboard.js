import React, {useState} from 'react';
import FormNickname from "./Form/FormNickname";
import {createRoomAction} from "../actions/roomActions";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

const Dashboard = (props) => {

    const [isError, setError] = useState(false);
    const [isCreateRoomBtnDisabled, setBtnDisability] = useState(false);
    const [nicknameError, setNicknameError] = useState(false);

    const [form, setValues] = useState({
        user: props.user || ''
    });

    const createRoom = () => {
        setValues({user: props.user});

        if (!props.user) {
            setError(true);
        } else {
            props.socket.emit('isPlayerNameUnique', {nickname: props.user});

            props.socket.on('playerNameIsValid', () => {
                props.socket.emit('createRoom', props.user);
                setBtnDisability(true);

                props.socket.on('roomCreated', (room_id) => {
                    props.createRoomAction(room_id);
                    console.log('before history push');
                    props.history.push({
                        pathname: '/room/' + room_id,
                        state: {
                            gameCreator: true
                        }
                    });
                    // props.socket.emit('roomJoin', {room_id: room_id, nickname: props.user});
                    // props.socket.on('joinedRoom', () => {
                    // });
                });
            });

            props.socket.on('playerNameOccupied', () => {
               setBtnDisability(false);
               setNicknameError(true);
               setError(true);
            });
        }
    };

    const onChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
    };

    const renderNicknameError = () => {
        if (nicknameError) {
            return (
                <p className="form__error">The selected nickname is occupied</p>
            )
        }
    };

    return (
        <main>
            <div className="flex_centered">
                <div className="dashboard__section">
                    <div className="col">
                        <FormNickname form={form} isError={isError} setError={setError} setValues={setValues}
                                      onChange={onChange}/>
                    </div>
                </div>
                <div className="dashboard__section dashboard__menu d-flex-col">
                    { renderNicknameError() }
                    <button type="button" className="nes-btn dashboard__btn" onClick={createRoom}
                            disabled={isCreateRoomBtnDisabled}>
                        Create a room
                    </button>
                    <button type="button" className="nes-btn dashboard__btn">Score</button>
                </div>
            </div>
        </main>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createRoomAction: (user) => {
            dispatch(createRoomAction(user))
        }
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));