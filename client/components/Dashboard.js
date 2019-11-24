import React, {useState} from 'react';
import FormNickname from "./Form/FormNickname";
import {createRoomAction} from "../actions/gameActions";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

const Dashboard = (props) => {

    const [isError, setError] = useState(false);
    const [isCreateRoomBtnDisabled, setBtnDisability] = useState(false);

    const [form, setValues] = useState({
        user: props.user || ''
    });

    const createRoom = (e) => {
        setValues({user: props.user});

        if (!props.user) {
            setError(true);
        } else {
            props.socket.emit('createGame', props.user);
            setBtnDisability(true);

            props.socket.on('gameCreated', (game_id) => {
                props.socket.emit('join', game_id);
                props.createRoomAction(game_id);

                props.history.push({
                    pathname: '/room/' + game_id,
                    state: {gameCreator: true}
                })
            });
        }
    };

    const onChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
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