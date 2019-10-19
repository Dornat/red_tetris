import {
    CREATE_GAME,
} from '../actions/types'

const initialState = {
    id: null
};

export default (state = initialState, action = {}) => {

    switch(action.type) {
        case CREATE_GAME:
            return {
                ...state,
                id: action.id
            };
        default: {
            return state;
        }
    }
}

