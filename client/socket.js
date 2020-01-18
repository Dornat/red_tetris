import io from 'socket.io-client';

export const initSocketConnection = () => {
    try {
        let ioServerPort = '';
        // Heroku doesn't need a definition of socket.io port.
        if (typeof process.env.HEROKU === 'undefined') {
            ioServerPort = ':' + process.env.IO_SERVER_PORT;
        }
        const uri = process.env.PROTOCOL + '://' + process.env.HOST + ioServerPort;
        return io.connect(uri);
    } catch (e) {
        console.log(e);
    }
};