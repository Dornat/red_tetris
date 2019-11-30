import {combineReducers} from 'redux';

import user from './user';
import game from './game';
import room from './room';

export default combineReducers({
    user,
    room,
    game
})