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
} from './types';

export function createRoomAction(id, isLeader = true) {
    return {
        type: CREATE_ROOM,
        id: id,
        isLeader: isLeader
    };
}

export function joinRoomAction(id) {
    return {
        type: JOIN_ROOM,
        id: id
    };
}

export function setRoomAction(roomId) {
    return {
        type: SET_ROOM,
        roomId: roomId
    };
}

export function setLeaderAction(isLeader) {
    return {
        type: SET_LEADER,
        isLeader: isLeader
    };
}

export function setOpponentAction(opponent) {
    return {
        type: SET_OPPONENT,
        opponent: opponent
    };
}

export function removeOpponentAction() {
    return {
        type: REMOVE_OPPONENT
    };
}

export function setModalAction(modal) {
    return {
        type: SET_MODAL,
        modal: modal
    };
}

export function setMusicAction(musicSound) {
    return {
        type: SET_MUSIC,
        musicSound: musicSound
    };
}

export function setMusicTrackAction(musicTrackName) {
    return {
        type: SET_MUSIC_TRACK,
        musicTrackName: musicTrackName
    };
}
