import React from 'react';
import SocketContext from '../Context/SocketContext';

const InitSockets = (props, Component) => {

    return () => {
        return (
            <SocketContext.Consumer>
                { socket => <Component {...props} socket={socket}/> }
            </SocketContext.Consumer>
        );
    };
};

export default InitSockets;