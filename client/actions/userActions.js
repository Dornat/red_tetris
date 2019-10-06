import {SET_USER} from '../actions/types'

export function setUser(user) {
    return {
        type: SET_USER,
        user
    };
}
