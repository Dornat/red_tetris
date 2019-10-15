import React, {useState, useEffect} from 'react';
import {connect} from "react-redux";
import {setUser} from "../../actions/userActions";

const FormNickname = (props) => {

    const [form, setValues] = useState({
        user: props.user || ''
    });

    const [inputClass, setClass] = useState("nes-input nickname__input");

    const onSubmit = (e) => {
        e.preventDefault();

        if (form.user.length) {
            props.setError(false);
            setClass("nes-input nickname__input");
        }
        props.setUser(form.user);
    };

    const onChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (props.isError) {
            setClass("nes-input is-error nickname__input")
        }
    });

    return (
        <form className="form__nickname" onSubmit={event => onSubmit(event)}>
            <div className="input__group">
                <label className="input__label">Enter your nickname</label>
                <input type="text" name="user" className={inputClass} onChange={event => onChange(event)} value={form.user}/>
                <input type="submit" className="nes-btn is-primary" value="Save"/>
            </div>
        </form>
    );

};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setUser: (user) => {
            dispatch(setUser(user))
        }
    }
};

export default connect(null, mapDispatchToProps)(FormNickname);