import React, {useState} from 'react';
import {connect} from 'react-redux'
import {setUser} from '../actions/userActions'

const Board = (props) => {

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
        console.log("HERE");
        props.setUser(form.user);
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);