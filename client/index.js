import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// Styles
import './sass/main.scss';

if (document.getElementById("app")) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}