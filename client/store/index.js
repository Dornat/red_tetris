import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {createStore, applyMiddleware} from 'redux';

const middleware = [thunk];

const saveNicknameToLocalStorage = state => {
    try {
        const lsState = {
            user: {
                nickname: state.user.nickname
            }
        };

        const serializedState = JSON.stringify(lsState);
        localStorage.setItem('state', serializedState);
    } catch (e) {
        console.log(e);
    }
};

const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('state');

        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.log(e);
        return undefined;
    }
};

const persistedState = loadFromLocalStorage();

const store = createStore(
    rootReducer,
    persistedState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);

store.subscribe(() => {
    saveNicknameToLocalStorage(store.getState());
});


export default store;
