import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const GameLink = (props) => {

    const buttonLabel = "<>";

    return (
        <div className="game-link__wrap">
            <label className="game-link__label label text-uppercase">Invite link</label>
            <div className="game__link">
                <span>{props.game_id}</span>
                <CopyToClipboard text={window.location.origin + "/room/" + props.game_id}>
                    <button className="invite-cpy__btn nes-btn is-primary">{buttonLabel}</button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default GameLink;