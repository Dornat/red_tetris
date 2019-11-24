import React from 'react';

const GameStats = (props) => {

    const shouldShowStats = () => {
        if (props.level !== null && props.score !== null) {
            return {
                display: 'block'
            };
        }
        else {
            return {
                display: 'none'
            }
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

export default GameStats;