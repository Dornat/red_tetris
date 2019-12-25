import React from 'react';
import Router from './Router';
import SocketContext from './Context/SocketContext';
import store from '../store';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {initSocketConnection} from '../socket';
import {socketEvents} from '../socketEvents';

const socket = initSocketConnection();
socketEvents(socket);

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