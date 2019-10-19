import React from 'react';

const GameLink = (props) => {

    const buttonLabel = "<>";

    console.log(window.location.href);

    return (
        <div>
            <label className="label text-uppercase">Invite link</label>
            <div className="game__link">
                <span>{props.game_id}</span>
                <button className="nes-btn is-primary">{buttonLabel}</button>
                <input type="hidden" value=""/>
            </div>
        </div>
    );
};

export default GameLink;