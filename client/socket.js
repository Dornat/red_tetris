import io from 'socket.io-client';

export const initSocketConnection = () => {
    try {
        const uri = process.env.PROTOCOL + '://' + process.env.HOST;
        return io.connect(uri);
    } catch (e) {
        console.log(e);
    }
};