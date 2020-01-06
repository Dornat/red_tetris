import FormNickname from './Form/FormNickname';
import Music from './Music';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {createRoomAction} from '../actions/roomActions';
import {withRouter} from 'react-router-dom';

const Dashboard = (props) => {
    const [isError, setError] = useState(false);
    const [isCreateRoomBtnDisabled, setBtnDisability] = useState(false);
    const [nicknameError, setNicknameError] = useState(false);
    const [form, setValues] = useState({
        user: props.user || ''
    });

    const createRoom = () => {
        // Very important to remove all listeners from socket to avoid recursion.
        props.socket.removeAllListeners();
        setValues({user: props.user});

        if (!props.user) {
            setError(true);
        } else {
            props.socket.emit('isPlayerNameUnique', {nickname: props.user});
            props.socket.on('playerNameIsValid', () => {
                props.socket.emit('createRoom', props.user);
                setBtnDisability(true);
                props.socket.on('roomCreated', (roomId) => {
                    props.socket.emit('join', roomId, props.user);
                    props.createRoomAction(roomId);
                    props.history.push({
                        pathname: '/room/' + roomId,
                        state: {
                            gameCreator: true
                        }
                    });
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
            );
        }
    };

    useEffect(() => {
        return () => {
            props.socket.removeAllListeners();
        };
    }, []);

    return (
        <main>
            <div className="flex_centered">
                <div className="dashboard-actions">
                    <Music/>
                </div>
                <div className="dashboard__section">
                    <div className="col">
                        <FormNickname form={form} isError={isError} setError={setError} setValues={setValues}
                                      onChange={onChange}/>
                    </div>
                </div>
                <div className="dashboard__section dashboard__menu d-flex-col">
                    {renderNicknameError()}
                    <button type="button" className="nes-btn dashboard__btn" onClick={createRoom}
                            disabled={isCreateRoomBtnDisabled}>
                        Create a room
                    </button>
                    <button type="button" className="nes-btn dashboard__btn">Score</button>
                </div>
            </div>
        </main>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createRoomAction: (user) => {
            dispatch(createRoomAction(user));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));

Dashboard.propTypes = {
    user: PropTypes.string,
    createRoomAction: PropTypes.func,
    socket: PropTypes.object,
    history: PropTypes.object,
};