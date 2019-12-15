import Player from "./entity/Player";
import Game from "./entity/Game";
import Room from "./entity/Room";

const socketActions = (io, rooms, games, players) => {
    io.on('connection', (socket) => {
        /**
         * Checks whether the player nickname is occupied or not.
         *
         * @param nickname
         */
        socket.on('isPlayerNameUnique', (nickname) => {
            if (!isPlayerUnique(players, nickname)) {
                socket.emit('playerNameOccupied');
            } else {
                socket.emit('playerNameIsValid');
            }
        });

        /**
         * Creates new room and adds it to global rooms array. Adds player to global players array. The nickname is a
         * name of the player who by design is a room leader.
         *
         * @param nickname
         */
        socket.on('createRoom', (nickname) => {
            if (Room.isPlayerUnique(players, nickname)) {
                const player = new Player(nickname);
                const room = new Room(player);
                rooms[room.id] = room;
                players[nickname] = player;
                socket.emit('roomCreated', room.id);
                socket.join(room.id);
            } else {
                socket.emit('playerNameOccupied');
            }
        });

        // TODO description
        socket.on('joinRoom', ({roomId, nickname}) => {
            if (rooms[roomId] !== undefined) {
                const player = new Player(nickname);
                players.push(player);
                rooms[roomId].addPlayer(player);
                console.log('rooms', rooms);
                socket.emit('joinedRoom', {roomId: roomId, nickname: nickname});
            } else {
                socket.emit('failedToJoinRoom', {roomId: roomId, nickname: nickname})
            }
        });

        /**
         * Creates new game in a given room.
         *
         * @param roomId
         */
        socket.on('createGame', (roomId) => {
            const room = rooms[roomId];
            room.instantiateAGame();
            io.in(roomId).emit('gameCreated', {roomId: roomId, gameId: room.game.id});
        });

        // TODO description
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
                delete (games[game_id]);
            }
        });

        // TODO description
        socket.on('join', (game) => {
            console.log('join', game);
            socket.join(game);
        });

        /**
         * Checks if game in the room has been started.
         *
         * @param roomId
         */
        socket.on('isGameStarted', (roomId) => {
            if (typeof rooms[roomId] === 'undefined') {
                io.in(roomId).emit('roomStatus', 'undefined');
            } else {
                io.in(roomId).emit('roomStatus', {
                    isGameStarted: rooms[roomId].game
                        ? rooms[roomId].game.isGameStarted
                        : false
                });
            }
        });

        /**
         * Starts game in a given room. If game in the room is not instantiated than create new game.
         *
         * @param roomId
         */
        socket.on('startGameInRoom', (roomId) => {
            const room = rooms[roomId];
            if (typeof room === 'undefined') {
                io.in(roomId).emit('roomStatus', 'undefined');
            } else {
                if (room.game === null) {
                    room.instantiateAGame();
                }
                room.game.start();
                io.in(roomId).emit('gameStarted', {roomId: roomId, gameId: room.game.id});
            }
        });

        /**
         * Kicks the player from room. Only the leader can kick his opponent, so we need to know only room id.
         *
         * @param roomId
         */
        socket.on('kickPlayer', (roomId) => {
            io.in(roomId).emit('playerWasKicked', rooms[roomId].kickPlayer());
        });

        // TODO description
        socket.on('acceptPlayer', ({roomId, nickname}) => {
            if (typeof rooms[roomId] === 'undefined') {
                io.in(roomId).emit('roomStatus', 'undefined');
            } else {
                const room = rooms[roomId];
                const newPlayer = new Player(nickname, false);
                const playerWasAccepted = room.addPlayer(newPlayer);

                io.in(roomId).emit('playerWasAccepted', {success: playerWasAccepted});

                if (playerWasAccepted) {
                    io.in(roomId).emit('playerJoined', room.players);
                }

            }
        });

        /**
         * Removes the player from game and room.
         *
         * @param roomId
         * @param nickname
         */
        socket.on('leaveGame', (roomId, nickname) => {
            console.log('roomId', roomId);
            console.log('nickname', nickname);
            const room = rooms[roomId];
            console.log('room', room);
            if (typeof room === 'undefined') {
                console.log('players[nickname]', players[nickname]);
                if (players[nickname]) {
                    delete players[nickname];
                }
                socket.emit('leftGame', true);
            } else {
                const player = room.getPlayer(nickname);
                const isPlayerRemoved = room.removePlayer(player);
                console.log('room', room);
                socket.emit('leftGame', isPlayerRemoved);
            }
        });

        /**
         * Generates pieces.
         */
        socket.on('generatePieces', (roomId) => {
            if (typeof rooms[roomId] === 'undefined') {
                io.in(roomId).emit('roomStatus', 'undefined');
            } else {
                const pieces = Game.generatePieces(5);
                console.log('generating...');
                console.log(pieces);
                io.in(roomId).emit('getPieces', {pieces: pieces});
            }
        });

        /**
         * Updates player field and does piece management.
         *
         * @param data
         */
        socket.on('updatePlayerField', (data) => {
            io.in(data.roomId).emit('roomStatus', 'undefined');
            const room = rooms[data.roomId];
            if (typeof room === 'undefined') {
                io.in(data.roomId).emit('roomStatus', 'undefined');
            } else {
                const game = room.game;

                if (game.gameOver) {
                    delete rooms[data.roomId];
                    return;
                }

                const player = players[data.nickname];
                const cheater = game.managePiecePlacement(data.coords, player);

                if (cheater === null) {
                    io.in(data.roomId).emit('fireInTheHoleTheCheaterIsHere');
                    console.log('\u001b[31mfireInTheHoleTheCheaterIsHere\u001b[0m');
                }

                console.log(player.field);

                io.in(data.roomId).emit('sendUpdatedGameData', {
                    myNickName: player.nickname,
                    score: player.score.quantity,
                    level: game.level
                });

                player.online = false;
                socket.emit('isPlayerOnline');
                setTimeout(() => {
                    if (player.online) {
                        room.game.over();
                    }
                }, 5000);
            }
        });


        /**
         * Sets online value of specific player to true.
         *
         * @param nickname
         */
        socket.on('setPlayerOnline', (nickname) => {
            players[nickname].online = true;
        });

        // TODO description
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