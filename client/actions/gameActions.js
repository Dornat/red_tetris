import {
    CREATE_GAME,
    START_GAME,
    SET_SCORE,
    SET_PIECES,
    JOIN_GAME,
} from './types';

export function createGameAction(id) {
    return {
        type: CREATE_GAME,
        id
    };
}

export function joinGameAction(id) {
    return {
        type: JOIN_GAME,
        id
    };
}

export function startGameAction() {
    return {
        type: START_GAME
    }
}

export function setScoreAction(score) {
    return {
        type: SET_SCORE,
        score
    }
}

export function setPiecesAction(pieces) {
    return {
        type: SET_PIECES,
        pieces
    }
}