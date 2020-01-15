import React from 'react';
import SocketContext from '../Context/SocketContext';

const InitSockets = (ChildComponent) => {
    return () => {
        return (
            <SocketContext.Consumer>
                { socket => <ChildComponent socket={socket}/> }
            </SocketContext.Consumer>
        );
    };
};

export default InitSockets;