import {
    CREATE_ROOM
} from "../actions/types";

const initialState = {
    id: null
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case CREATE_ROOM:
            return {
                ...state,
                id: action.id,
                isLeader: action.isLeader
            };
        default: {
            return state;
        }
    }
};