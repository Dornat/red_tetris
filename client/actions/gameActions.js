import {
    CREATE_GAME, START_GAME, SET_SCORE, SET_NEXT_PIECE, SET_LEVEL, JOIN_GAME, REDUCE_ROWS_AMOUNT, RESET_ROWS_AMOUNT,
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

export function setNextPieceAction(nextPiece) {
    return {
        type: SET_NEXT_PIECE,
        nextPiece: nextPiece
    };
}

export function setLevelAction(level) {
    return {
        type: SET_LEVEL,
        level: level
    };
}

export function reduceRowsAmountAction(reductionAmount) {
    return {
        type: REDUCE_ROWS_AMOUNT,
        reductionAmount: reductionAmount
    };
}

export function resetRowsAmountAction() {
    return {
        type: RESET_ROWS_AMOUNT
    };
}
