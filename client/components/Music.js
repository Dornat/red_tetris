import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import {faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import {setMusicAction, setMusicTrackAction} from '../actions/roomActions';

const Music = (props) => {
    const toggleMusicSound = () => {
        props.setMusicAction(!props.musicSound);
    };

    useEffect(() => {
        if (props.musicSound) {
            props.musicLibrary[props.musicTrackName].play();
        } else {
            console.log('props.musicTrackName', props.musicTrackName);
            console.log('soundTracks', props.musicLibrary);
            if (props.musicTrackName) {
                props.musicLibrary[props.musicTrackName].pause();
            }
        }

    }, [props.musicSound]);

    useEffect(() => {
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
        musicSound: state.room.musicSound,
        musicTrackName: state.room.musicTrackName,
        musicLibrary: state.room.musicLibrary
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setMusicAction: (musicSound) => {
            dispatch(setMusicAction(musicSound));
        },
        setMusicTrackAction: (musicTrackName) => {
            dispatch(setMusicTrackAction(musicTrackName));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Music);

Music.propTypes = {
    musicSound: PropTypes.bool,
    musicTrackName: PropTypes.string,
    musicLibrary: PropTypes.object,
    setMusicAction: PropTypes.func,
    setMusicTrackAction: PropTypes.func,
};
