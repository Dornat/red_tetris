import React, {useState} from 'react';
import FormNickname from "./Form/FormNickname";
import {createRoom} from "../actions/gameActions";
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
        }
        else {
            props.socket.emit('createGame', props.user);
            setBtnDisability(true);

            props.socket.on('gameCreated', (game_id) => {
                props.createRoom(game_id);
                props.history.push('/room/' + game_id);
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
                <div className="row">
                    <div className="col">
                        <FormNickname form={form} isError={isError} setError={setError} setValues={setValues} onChange={onChange}/>
                    </div>
                </div>
                <div className="row dashboard__menu">
                    <div className="col-6">
                        <button type="button" className="nes-btn dashboard__btn" onClick={createRoom} disabled={isCreateRoomBtnDisabled}>Create a room</button>
                    </div>
                    <div className="col-6">
                        <button type="button" className="nes-btn dashboard__btn">Score</button>
                    </div>
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
        createRoom: (user) => {
            dispatch(createRoom(user))
        }
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));