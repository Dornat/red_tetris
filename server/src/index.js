import '@babel/polyfill';
import Database from './Database';
import Server from './Server';
import dotenv from 'dotenv';
import socketActions from './socketActions.js';

// For .env file to work
dotenv.config();

const server = new Server({
    port: process.env.PORT || 8,
    createStaticFolder: true,
    onInit: (port) => {
        console.log('Red Tetris is running on http://' + process.env.HOST + ':' + port);
    }
});

const database = new Database({
    uri: process.env.MONGODB_URI,
    db_name: process.env.MONGODB_NAME
});

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

socketActions(server.io, rooms, onlineStatuses, players);


database.initConnection();