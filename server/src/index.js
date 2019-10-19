import Server from './Server';
import Database from './Database';
import dotenv from 'dotenv';
import * as path from 'path';
import http from 'http';
import socket from 'socket.io';


import Game from './entity/Game';
import Player from './entity/Player';

/**
 * Global games object
 * @type {{}}
 */
let games = {};


// For .env file to work
dotenv.config();

const server = new Server({
    port: process.env.SERVER_PORT || 3000,
    createStaticFolder: true,
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

socketServer.listen(process.env.IO_SERVER_PORT);

io.on('connection', (socket) => {
    socket.on('createGame', function (playerName) {
        let player = new Player(playerName);
        let game = new Game(player);

        games[game.id] = game;

        socket.emit('gameCreated', game.id);
    });

    /**
     * Only the leader can kick his opponent, so we need to know only gameId
     */
    socket.on('kickPlayer', function (gameId) {
        /** @param {Game} game */
        let game = games[gameId];
        let playerWasKicked = game.kickPlayer();

        socket.emit('playerWasKicked', playerWasKicked);
    });

    socket.on('acceptPlayer', function (playerName, gameId) {
        let game = games[gameId];
        let newPlayer = new Player(playerName, false);
        let playerWasAccepted = game.addPlayer(newPlayer);

        socket.emit('playerWasAccepted', playerWasAccepted);
    });

    /**
     * TODO maybe it's better to use playerId
     */
    socket.on('leaveGame', function (playerName, gameId) {
        let game = games[gameId];
        let leftGame = game.exitFromGame(playerName);

        socket.emit('leftGame', leftGame);
    });

    socket.on('getNextPieces', function (gameId) {
        let game = games[gameId];
        let pieces = game.generatePieces(5);
        socket.emit('getNextPieces', pieces);
    })
});


database.initConnection();