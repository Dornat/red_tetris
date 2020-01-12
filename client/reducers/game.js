import {
    CREATE_GAME, START_GAME, SET_SCORE, SET_NEXT_PIECE, SET_LEVEL, JOIN_GAME, REDUCE_ROWS_AMOUNT, RESET_ROWS_AMOUNT,
} from '../actions/types';
import {ROWS_AMOUNT} from '../utils/createField';

const initialState = {
    id: null,
    nextPiece: null,
    rowsAmount: ROWS_AMOUNT,
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case CREATE_GAME:
            return {
                ...state,
                id: action.id,
                isLeader: true,
                isGameStarted: false,
                score: 0
            };
        case JOIN_GAME:
            return {
                ...state,
                id: action.id,
                isLeader: false,
                isGameStarted: false,
                score: 0
            };
        case START_GAME:
            return {
                ...state,
                isGameStarted: true
            };
        case SET_SCORE:
            return {
                ...state,
                score: action.score
            };
        case SET_NEXT_PIECE:
            return {
                ...state,
                nextPiece: action.nextPiece
            };
        case SET_LEVEL:
            return {
                ...state,
                level: action.level
            };
        case REDUCE_ROWS_AMOUNT:
            return {
                ...state,
                rowsAmount: state.rowsAmount - action.reductionAmount
            };
        case RESET_ROWS_AMOUNT:
            return {
                ...state,
                rowsAmount: ROWS_AMOUNT
            };
        default: {
            return state;
        }
    }
};

