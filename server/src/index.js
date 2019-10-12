import Server from './Server';
import Database from './Database';
import dotenv from 'dotenv';
import * as path from 'path';
import http from 'http';
import socket from 'socket.io';

// For .env file to work
dotenv.config();

const server = new Server({
    port: process.env.SERVER_PORT || 3000,
    createStaticFolder: true,
    staticFolderLocation: path.join('../public'),
    onInit: (port) => {
        console.log("Red Tetris is running on http://localhost:" + port);
    }
});

const database = new Database({
    uri: process.env.MONGODB_URI,
    db_name: process.env.MONGODB_NAME
});

const socketServer = http.Server(server.app);
const io = socket(socketServer);

socketServer.listen(3001);

io.on('connection', (socket) => {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', (data) => {
        console.log("DATA", data);
    });
});



database.initConnection();