import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';

import Router from './Router';
import store from '../store';

export default function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Route component={Router}/>
            </Provider>
        </BrowserRouter>
    );
}