import {CREATE_ROOM, JOIN_ROOM, SET_LEADER, SET_OPPONENT, REMOVE_OPPONENT} from './types';

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
