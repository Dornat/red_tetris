import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

const GameStats = (props) => {
    const shouldShowStats = () => {
        console.log('GameStats props', props);
        if (props.level !== null && props.score !== null) {
            return {
                display: 'block'
            };
        } else {
            return {
                display: 'none'
            };
        }
    };

    return (
        <div className="game-stats__btns" style={shouldShowStats()}>
            <div className="game-stats__btn">
                <span>Level: {props.level}</span>
            </div>
            <div className="game-stats__btn">
                <span>Score: {props.score}</span>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        score: state.game.score,
        level: state.game.level
    };
};

export default connect(mapStateToProps, null)(GameStats);

GameStats.propTypes = {
    score: PropTypes.number,
    level: PropTypes.number,
};
