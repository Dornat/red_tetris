import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {setUser} from '../../actions/userActions';

const FormNickname = (props) => {
    const onSubmit = (e) => {
        e.preventDefault();
        const nicknameValidation = '^[0-9\\w]{1,10}$';
        const nickname = String(props.form.user);

        if (nickname.match(nicknameValidation)) {
            props.setError(false);
            props.setUser(props.form.user);
        } else {
            props.setError(true);
        }
    };

    return (
        <form className="form__nickname" onSubmit={event => onSubmit(event)}>
            <div className="form-nickname__group">
                <label className="input__label">Enter your nickname</label>
                <input type="text" name="user"
                       className={props.isError ? 'nes-input is-error nickname__input' : 'nes-input nickname__input'}
                       onChange={event => props.onChange(event)} value={props.form.user}
                />
                <input type="submit" className="nes-btn is-primary" value="Save"/>
            </div>
        </form>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => {
            dispatch(setUser(user));
        }
    };
};

export default connect(null, mapDispatchToProps)(FormNickname);

FormNickname.propTypes = {
    isError: PropTypes.bool,
    form: PropTypes.object,
    setError: PropTypes.func,
    setUser: PropTypes.func,
    onChange: PropTypes.func,
};