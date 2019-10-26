import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const GameLink = (props) => {

    const buttonLabel = "<>";

    return (
        <div>
            <label className="label text-uppercase">Invite link</label>
            <div className="game__link">
                <span>{props.game_id}</span>
                <CopyToClipboard text={window.location.origin + "/room/" + props.game_id}>
                    <button className="nes-btn is-primary">{buttonLabel}</button>
                </CopyToClipboard>
            </div>
        </div>
    );
};

export default GameLink;