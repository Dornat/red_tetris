import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import {faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import {setMusicAction} from '../actions/roomActions';
import {soundManager, sfw} from 'soundmanager2';
import music from '../music/tetris_effect_ost_boscage.mp3';

const Music = (props) => {
    const toggleMusicSound = () => {
        props.setMusicAction(!props.musicSound);
    };

    useEffect(() => {
        // soundManager.setup({
        //     url: sfw,
        //     onready: function() {
        //         const mySound = soundManager.createSound({
        //             id: 'aSound', // optional: provide your own unique id
        //             url: music
        //         });
        //
        //         mySound.play();
        //
        //     },
        // });
        // const music = new Audio('../music/tetris_effect_ost_boscage.mp3');
        // music.loop = true;
        // music.play().then(response => {
        //     console.log('hello', response);
        // }).catch(reason => {
        //     console.log('in catch', reason);
        // });
    }, []);

    return (
        <div className="music">
            {
                props.musicSound
                    ?
                    <button className="music__on nes-btn is-primary" onClick={toggleMusicSound}>
                        <FontAwesomeIcon icon={faVolumeUp}/>
                    </button>
                    :
                    <button className="music__off nes-btn is-disabled" onClick={toggleMusicSound}>
                        <FontAwesomeIcon icon={faVolumeMute}/>
                    </button>
            }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        musicSound: state.room.musicSound
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMusicAction: (musicSound) => {
            dispatch(setMusicAction(musicSound));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Music);

Music.propTypes = {
    musicSound: PropTypes.bool,
    setMusicAction: PropTypes.func
};
