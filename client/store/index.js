import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import {getStateFromLocalStorage} from '../utils/getStateFromLocalStorage';

const middleware = [thunk];

const persistedState = getStateFromLocalStorage();

const store = createStore(
    rootReducer,
    persistedState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;