import FormNickname from './FormNickname';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

const JoinGame = ({onClick}) => {
    const [isError, setError] = useState(false);

    const [form, setValues] = useState({ user: ''});

    const onChange = (e) => {
        setValues({
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="dashboard__section">
            <div className="col">
                <FormNickname form={form} isError={isError} setError={setError} setValues={setValues}
                              onChange={onChange}/>
                <button type="button" className="nes-btn dashboard__btn" onClick={onClick}>
                    Enroll into battle
                </button>
            </div>
        </div>
    );
};

export default JoinGame;

JoinGame.propTypes = {
    onClick: PropTypes.func
};
