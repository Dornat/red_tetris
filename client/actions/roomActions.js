import {CREATE_ROOM} from "./types";

export function createRoomAction(id, isLeader = true) {
    return {
        type: CREATE_ROOM,
        id: id,
        isLeader: isLeader
    };
}