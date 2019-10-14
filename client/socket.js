import io from 'socket.io-client';

export const initSocketConnection = () => {
    try {
        return io.connect('http://localhost:3001');
    }
    catch(e) {
        console.log(e);
    }
};