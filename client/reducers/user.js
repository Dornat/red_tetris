import {
    SET_USER
} from '../actions/types'

const initialState = {
    "user": null
};

export default (state = initialState, action = {}) => {

    console.log("USER REDUCER");
    console.log(action.user);
    console.log(action.type);
    switch(action.type) {
        case SET_USER:
        {
            console.log("HELLO");
            return action.user;
        }
        default: {
            console.log("DEF CASE");
            return state;
        }
    }
}

