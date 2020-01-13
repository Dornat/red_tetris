import React from 'react';
import PropTypes from 'prop-types';

const NotFound = (props) => {
    return (
        <div>
            <div className="not-found__section">
                <div className="not-found__head">
                    <i className="nes-bulbasaur"/>
                </div>
                <div className="not-found__msg">
                    <span>Page does not exist</span>
                </div>
            </div>
            <div className="bottom__menu">
                <button className="nes-btn" onClick={() => props.history.push('/')}>To Dashboard</button>
            </div>
        </div>
    );
};

NotFound.propTypes = {
    history: PropTypes.object
};

export default NotFound;