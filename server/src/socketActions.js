import Player from "./entity/Player";
import Game from "./entity/Game";
import Room from "./entity/Room";

export const isPlayerUnique = (players, nickname) =>
{
    let player = players.some((player) => {
        return player.nickname === nickname;
    });

    console.log("PLAYER", player);

    return player === false;
};

const socketActions = (io, rooms, games, players) => {

    io.on('connection', (socket) => {

        socket.on('isPlayerNameUnique', ({nickname}) => {
            if (!isPlayerUnique(players, nickname)) {
                socket.emit('playerNameOccupied');
                return;
            }
            socket.emit('playerNameIsValid');
        });

        socket.on('createRoom', () => {
            let room = new Room();

            rooms[room.id] = room;
            socket.emit('roomCreated', room.id);
        });

        socket.on('roomJoin', ({room_id, nickname}) => {
            let player = new Player(nickname);
            players.push(player);

            if (rooms[room_id] !== undefined) {
                rooms[room_id].addPlayer(player);
            }

            socket.emit('joinedRoom');
        });

        socket.on('createGame', (playerName) => {

            console.log("PLAYERNAME", playerName);
            console.log("GAMES", games);

            if (!isPlayerUnique(games, playerName)) {
                socket.emit('playerNameOccupied');
                return;
            }

            let player = new Player(playerName);
            let game = new Game(player);

            games[game.id] = game;
            players.push(player);
            socket.emit('gameCreated', game.id);
        });

        socket.on('annulGame', ({nickname}) => {
            let game_id, player = null;

            for (let id in games) {

                let gamePlayers = games[id].players;

                player = gamePlayers.some((player) => {
                    return player.nickname === nickname;
                });

                if (player) {
                    game_id = id;
                }
            }

            if (game_id && games[game_id] !== undefined) {
                delete(games[game_id]);
            }
        });

        socket.on('join', (game) => {
            console.log('join', game);
            socket.join(game);
        });

        socket.on('isGameStarted', (game_id) => {
            if (games[game_id] === undefined) {
                socket.emit('gameStatus', undefined);
            }

            if (games[game_id]) {
                socket.emit('gameStatus', {isGameStarted: games[game_id].isGameStarted})
            }

        });

        socket.on('startGame', (game_id) => {
            console.log('in startGame');
            if (games[game_id] === undefined) {
                socket.emit('gameStatus', undefined);
            }

            if (games[game_id]) {
                games[game_id].startGame();
                console.log('games[game_id]', games[game_id]);
                io.in(game_id).emit('gameStarted', {game_id: game_id});
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

            if (playerWasAccepted) {
                io.in(game_id).emit('playersJoined', game.players);
            }
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
            } else {
                const player = game.players[0];

                io.in(game_id).emit('gameJoined', {
                    success: true,
                    data: {
                        opponent: {nickname: player.nickname, isLeader: player.isLeader}
                    }
                });
            }
        });
    });
};

export default socketActions;