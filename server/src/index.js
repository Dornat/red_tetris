import Server from './Server';
import Database from './Database';
import dotenv from 'dotenv';
import * as path from 'path';
import http from 'http';
import socket from 'socket.io';

import Game from './entity/Game';
import Player from './entity/Player';

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

/**
 * Global games object
 * @type {{}}
 */
const games = {};
const players = [];

socketServer.listen(process.env.IO_SERVER_PORT);

io.on('connection', (socket) => {
    socket.on('createGame', (playerName) => {
        let player = new Player(playerName);
        let game = new Game(player);

        games[game.id] = game;
        players.push(player);
        socket.emit('gameCreated', game.id);
    });

    socket.on("isGameStarted", (game_id) => {
        if (games[game_id] === undefined) {
            socket.emit("gameStatus", undefined);
        }

        if (games[game_id]) {
            socket.emit("gameStatus", {isGameStarted: games[game_id].isGameStarted})
        }

    });

    socket.on("startGame", (game_id) => {
        if (games[game_id] === undefined) {
            socket.emit("gameStatus", undefined);
        }

        if (games[game_id]) {
            games[game_id].startGame();
            socket.emit("gameStarted", {game_id: game_id});
        }
    });

    /**
     * Only the leader can kick his opponent, so we need to know only gameId
     */
    socket.on('kickPlayer', (gameId) => {
        /** @param {Game} game */
        let game = games[gameId];
        let playerWasKicked = game.kickPlayer();

        socket.emit('playerWasKicked', playerWasKicked);
    });

    socket.on('acceptPlayer', ({game_id, nickname}) => {
        let game = games[game_id];
        let newPlayer = new Player(nickname, false);
        let playerWasAccepted = game.addPlayer(newPlayer);

        socket.emit('playerWasAccepted', {
            success: playerWasAccepted
        });
    });

    socket.on('leaveGame', (data) => {
        let game_id = data.game_id;
        let game = games[game_id];
        let result = game.exitFromGame(data.nickname);

        console.log("RESULT", result);

        if (!games[game_id].players.length) {
            delete games[game_id];
        }

        socket.emit('leftGame', result);
    });

    socket.on('generatePieces', (data) => {
        let game = games[data.id];
        let pieces = game.generatePieces(5);

        console.log('generating...');
        console.log(pieces);
        socket.emit('getPieces', {pieces: pieces});
    });

    socket.on('updatePlayerField', (data) => {
        let game = games[data.id];
        let player = game.getPlayerByNickname(data.nickname);

        let cheater = game.managePiecePlacement(data.coords, player);
        if (cheater === null) {
            socket.emit('fireInTheHoleTheCheaterIsHere');
        }

        socket.emit('sendUpdatedGameData', {
            score: player.score.quantity,
            level: game.level
        });

        console.log('cheater', cheater);
        console.log('score', player.score);
    });

    socket.on('joinGame', (data) => {
        const game_id = data.game_id;
        const game = games[game_id];

        if (typeof game === "undefined") {
            socket.emit('gameJoined', {success: false});
        }
        else {

            const player = game.players[0];

            socket.emit('gameJoined', {
                success: true,
                data: {
                    opponent: {nickname: player.nickname, isLeader: player.isLeader}
                }
            });
        }

    });
});


database.initConnection();