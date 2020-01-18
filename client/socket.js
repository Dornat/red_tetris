import io from 'socket.io-client';

export const initSocketConnection = () => {
    try {
        const uri = process.env.PROTOCOL + '://' + process.env.HOST + ':' + process.env.IO_SERVER_PORT;
        return io.connect(uri);
    } catch (e) {
        console.log(e);
    }
};