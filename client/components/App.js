import React from 'react';
import Router from './Router';
import SocketContext from './Context/SocketContext';
import store from '../store';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {initSocketConnection} from '../socket';

const socket = initSocketConnection();

export default function App() {
    return (
        <SocketContext.Provider value={socket}>
            <BrowserRouter>
                <Provider store={store}>
                    <Route component={Router}/>
                </Provider>
            </BrowserRouter>
        </SocketContext.Provider>
    );
}