import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy} from '@fortawesome/free-solid-svg-icons';

const GameLink = (props) => {
    const [copiedBalloon, setCopiedBalloon] = useState({
        display: 'none',
        top: '-42px',
        right: '-1px',
        position: 'absolute'
    });

    const copied = () => {
        setCopiedBalloon(prevState => ({
            ...prevState,
            display: 'block'
        }));
        setTimeout(() => {
            setCopiedBalloon(prevState => ({
                ...prevState,
                display: 'none'
            }));
        }, 3042);
    };

    return (
        <div className="game-link__wrap">
            <label className="game-link__label label text-uppercase">Invite link</label>
            <div className="game__link">
                <span>{props.roomId || 'NO ROOM'}</span>
                <CopyToClipboard text={window.location.origin + '/room/' + props.roomId}>
                    <button className="invite-cpy__btn nes-btn is-primary" onClick={copied}>
                        <FontAwesomeIcon icon={faCopy}/>
                    </button>
                </CopyToClipboard>
                <div className={'nes-balloon from-right'} style={copiedBalloon}>
                    <p>copied!</p>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        roomId: state.room.id,
    };
};

export default connect(mapStateToProps, null)(GameLink);

GameLink.propTypes = {
    roomId: PropTypes.string,
};
