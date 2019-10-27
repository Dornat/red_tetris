import {
    CREATE_GAME,
    START_GAME
} from './types';

export function createRoomAction(id) {
    return {
        type: CREATE_GAME,
        id
    };
}

export function startGameAction() {
    return {
        type: START_GAME
    }
}
