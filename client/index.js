import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import io from 'socket.io-client';

// Styles
import './sass/main.scss';

if (document.getElementById("app")) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}