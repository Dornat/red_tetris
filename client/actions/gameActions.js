import {
    CREATE_GAME,
    START_GAME,
    SET_SCORE,
    SET_PIECES,
    SET_LEVEL,
    JOIN_GAME,
} from './types';

export function createGameAction(id) {
    return {
        type: CREATE_GAME,
        id: id
    };
}

export function joinGameAction(id) {
    return {
        type: JOIN_GAME,
        id: id
    };
}

export function startGameAction() {
    return {
        type: START_GAME
    };
}

export function setScoreAction(score) {
    return {
        type: SET_SCORE,
        score: score
    };
}

export function setPiecesAction(pieces) {
    return {
        type: SET_PIECES,
        pieces: pieces
    };
}

export function setLevelAction(level) {
    return {
        type: SET_LEVEL,
        level: level
    };
}