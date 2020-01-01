import {
    SET_USER
} from '../actions/types';

const initialState = {
    nickname: ''
};

export default (state = initialState, action = {}) => {
    switch(action.type) {
        case SET_USER:
            return {
                ...state,
                nickname: action.user
            };
        default: {
            return state;
        }
    }
};

