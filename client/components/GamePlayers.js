import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {faMedal} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const GamePlayers = (props) => {
    const [hidden, setHidden] = useState(false);

    /**
     * @param {object} player: {nickname, isLeader}
     */
    const renderNickname = (player) => {
        if (player.nickname) {
            return (
                <a href="#" className="nes-badge">
                    <span className="is-primary player">
                        <span className="player__nickname">{player.nickname}</span>
                        <span className="player__rank">
                            {player.isLeader === true
                                ? <FontAwesomeIcon icon={faMedal}/>
                                : ''
                            }
                        </span>
                    </span>
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
        window.addEventListener('resize', handleDisplay);
        return () => {
            window.removeEventListener('resize', handleDisplay);
        };
    }, []);

    return (
        <div className="game__players" style={hidden ? {display: 'none'} : {display: 'block'}}>
            <h3 className="game-players__title">Players</h3>
            {renderNickname({nickname: props.nickname, isLeader: props.isLeader})}
            {props.opponent ? renderNickname(props.opponent) : ''}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        nickname: state.user.nickname,
        isLeader: state.room.isLeader,
        opponent: state.room.opponent
    };
};

export default connect(mapStateToProps, null)(GamePlayers);

GamePlayers.propTypes = {
    nickname: PropTypes.string,
    isLeader: PropTypes.bool,
    opponent: PropTypes.object,
};