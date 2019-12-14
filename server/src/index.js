import Server from './Server';
import Database from './Database';
import dotenv from 'dotenv';
import * as path from 'path';
import http from 'http';
import socket from 'socket.io';
import socketActions from './socketActions.js';

import Game from './entity/Game';
import Player from './entity/Player';

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
 * Global games array.
 *
 * @type {Array}
 */
const games = [];

/**
 * Global rooms array.
 *
 * @type {Array}
 */
const rooms = [];

/**
 * Global players array.
 * @type {Array}
 */
const players = [];

socketServer.listen(process.env.IO_SERVER_PORT);

socketActions(io, rooms, games, players);


database.initConnection();