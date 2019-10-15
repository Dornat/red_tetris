import {
    CREATE_GAME,
} from '../actions/types'

const initialState = {
    game: {
        id: null
    }
};

export default (state = initialState, action = {}) => {

    switch(action.type) {
        case CREATE_GAME:
            return {
                ...state,
                game: {
                    id: action.id
                }
            };
        default: {
            return state;
        }
    }
}

