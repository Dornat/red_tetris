import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

const GamePlayers = (props) => {

    const [hidden, setHidden] = useState(false);
    const [opponent, setOpponent] = useState(null);

    /**
     * @param {object} player: {nickname, isLeader}
     */
    const renderNickname = (player) => {
        if (player.nickname) {
            return (
                <a href="#" className="nes-badge">
                    <span className="is-primary">{player.nickname} {player.isLeader === true ? '(L)' : ''}</span>
                </a>
            );
        }
    };

    const handleDisplay = () => {
        if (window.innerWidth < 992) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    };

    useEffect(() => {
        handleDisplay();

        window.addEventListener('resize', function (e) {
            handleDisplay();
        });
    }, []);

    useEffect(() => {
        setOpponent(props.opponent);
    }, [props.opponent]);

    return (
        <div className="game__players" style={hidden ? {display: 'none'} : {display: 'block'}}>
            <h3 className="game-players__title">Players</h3>
            {renderNickname({nickname: props.nickname, isLeader: props.isLeader})}
            {opponent ? renderNickname(opponent) : ''}
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        nickname: state.user.nickname,
        isLeader: state.game.isLeader
    };
};

export default connect(mapStateToProps, null)(GamePlayers);