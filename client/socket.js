import io from 'socket.io-client';
// import dotenv from 'dotenv';
//
// // For .env file to work
// dotenv.config();

export const initSocketConnection = () => {
    try {
        return io.connect('http://localhost:' + process.env.IO_SERVER_PORT);
    } catch (e) {
        console.log(e);
    }
};