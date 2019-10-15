import React, {useState} from 'react';
import {connect} from 'react-redux'
import {setUser} from '../actions/userActions'
import io from 'socket.io-client';

const Dashboard = props => {
    const [form, setValues] = useState({
        user: ''
    });

    const onChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        props.setUser(form.user);

        const socket = io.connect('http://localhost:3001');
        socket.emit('createGame', form.user, function (data) {
            console.log(data);
        });

        socket.on('createdGame', function (data) {
            console.log(data);
        });
    };

    return (
        <form onSubmit={event => onSubmit(event)}>
            <input type="text" name="user" onChange={event => onChange(event)}/>
            <input type="submit"/>
        </form>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);