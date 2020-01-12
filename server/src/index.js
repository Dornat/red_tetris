import Server from './Server';
import Database from './Database';
import dotenv from 'dotenv';
import http from 'http';
import socket from 'socket.io';
import socketActions from './socketActions.js';

// For .env file to work
dotenv.config();

const server = new Server({
    port: process.env.SERVER_PORT || 3000,
    createStaticFolder: true,
    onInit: (port) => {
        console.log('Red Tetris is running on http://localhost:' + port);
    }
});

const database = new Database({
    uri: process.env.MONGODB_URI,
    db_name: process.env.MONGODB_NAME
});

const socketServer = http.Server(server.app);
const io = socket(socketServer);

/**
 * Global rooms array.
 *
 * @type {{}}
 */
const rooms = {};

/**
 * Global players array.
 *
 * @type {{}}
 */
const players = {};

/**
 * Online statuses of players in form of {socket.id: nickname}.
 *
 * @type {{}}
 */
const onlineStatuses = {};

socketServer.listen(process.env.IO_SERVER_PORT);

socketActions(io, rooms, onlineStatuses, players);


database.initConnection();