import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import {getStateFromLocalStorage} from '../utils/getStateFromLocalStorage';
import {composeWithDevTools} from 'redux-devtools-extension';

const middleware = [thunk];

const persistedState = getStateFromLocalStorage();

const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);

export default store;