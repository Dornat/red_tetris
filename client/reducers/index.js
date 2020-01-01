import {combineReducers} from 'redux';

import user from './user';
import game from './game';
import room from './room';

const rootReducer = combineReducers({
    user,
    room,
    game
});

export default rootReducer;