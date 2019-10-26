import React from 'react';
import {connect} from "react-redux";
import {setUser} from "../../actions/userActions";

const FormNickname = (props) => {

    const onSubmit = (e) => {
        e.preventDefault();

        if (!props.form.user.length) {
            props.setError(true);
        }
        else {
            props.setError(false);
        }

        props.setUser(props.form.user);
    };

    return (
        <form className="form__nickname" onSubmit={event => onSubmit(event)}>
            <div className="input__group">
                <label className="input__label">Enter your nickname</label>
                <input type="text" name="user"
                    className={props.isError ? "nes-input is-error nickname__input" : "nes-input nickname__input"}
                    onChange={event => props.onChange(event)} value={props.form.user}
                />
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