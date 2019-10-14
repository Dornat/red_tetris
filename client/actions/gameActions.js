import {
    CREATE_GAME
} from './types';

export function createRoom(id) {
    return {
        type: CREATE_GAME,
        id
    };
}
