import {
    CREATE_GAME,
    START_GAME,
    SET_SCORE
} from '../actions/types'

const initialState = {
    id: null
};

export default (state = initialState, action = {}) => {

    switch(action.type) {
        case CREATE_GAME:
            return {
                ...state,
                id: action.id,
                isLeader: true,
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
        default: {
            return state;
        }
    }
}

