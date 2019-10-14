import React, {useState} from 'react';
import FormNickname from "./Form/FormNickname";
import {createRoom} from "../actions/gameActions";
import {connect} from "react-redux";

const Dashboard = (props) => {

    const [isError, setError] = useState(false);

    const createRoom = (e) => {
        if (!props.user.length) {
            setError(true)
        }

        const socket = props.socket;

        if (socket) {

            console.log(props.user);
            socket.emit("create room", props.user);
        }
    };

    return (
        <main>
            <div className="flex_centered">
                <div className="row">
                    <div className="col">
                        <FormNickname user={props.user} isError={isError} setError={setError}/>
                    </div>
                </div>
                <div className="row dashboard__menu">
                    <div className="col-6">
                        <button type="button" className="nes-btn dashboard__btn" onClick={createRoom}>Create a room</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);