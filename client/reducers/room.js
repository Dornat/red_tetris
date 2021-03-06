import {
    CREATE_ROOM,
    JOIN_ROOM,
    SET_ROOM,
    SET_LEADER,
    SET_OPPONENT,
    REMOVE_OPPONENT,
    SET_MODAL,
    SET_MUSIC,
    SET_MUSIC_TRACK,
} from '../actions/types';
import {musicLibrary} from '../utils/musicLibrary';

const initialState = {
    id: null,
    musicSound: false,
    musicLibrary: musicLibrary
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case CREATE_ROOM:
            return {
                ...state,
                id: action.id,
                isLeader: action.isLeader
            };
        case JOIN_ROOM:
            return {
                ...state,
                id: action.id,
                isLeader: false,
                isGameStarted: false,
                score: 0
            };
        case SET_ROOM:
            return {
                ...state,
                id: action.roomId
            };
        case SET_LEADER:
            return {
                ...state,
                isLeader: action.isLeader
            };
        case SET_OPPONENT:
            return {
                ...state,
                opponent: action.opponent
            };
        case REMOVE_OPPONENT:
            return {
                ...state,
                opponent: null
            };
        case SET_MODAL:
            return {
                ...state,
                modal: action.modal
            };
        case SET_MUSIC:
            return {
                ...state,
                musicSound: action.musicSound
            };
        case SET_MUSIC_TRACK:
            return {
                ...state,
                musicTrackName: action.musicTrackName
            };
        default: {
            return state;
        }
    }
};