import {
    CREATE_GAME,
    START_GAME
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
                isGameStarted: false
            };
        case START_GAME:
            return {
                ...state,
                isGameStarted: true
            };
        default: {
            return state;
        }
    }
}

