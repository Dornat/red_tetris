import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const GameLink = (props) => {
    const buttonLabel = '<>';

    return (
        <div className="game-link__wrap">
            <label className="game-link__label label text-uppercase">Invite link</label>
            <div className="game__link">
                <span>{props.roomId}</span>
                <CopyToClipboard text={window.location.origin + '/room/' + props.roomId}>
                    <button className="invite-cpy__btn nes-btn is-primary">{buttonLabel}</button>
                </CopyToClipboard>
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
