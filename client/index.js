import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

// Styles
import './sass/main.scss';

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}