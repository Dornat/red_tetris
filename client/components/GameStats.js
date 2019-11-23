import React from 'react';

const GameStats = (props) => {
    return (
        <div className="game-stats__btns">
           <div className="game-stats__btn">
               <span>Level: 4</span>
           </div>
            <div className="game-stats__btn">
                <span>Score: 55</span>
            </div>
        </div>
    );
};

export default GameStats;