import Player from './entity/Player';
import Game from './entity/Game';
import Room from './entity/Room';

const logDate = () => {
    return (new Date()).toISOString().slice(0, -5);
};

const socketActions = (io, rooms, games, players) => {
    io.on('connection', (socket) => {
        /**
         * Checks whether the player nickname is occupied or not.
         *
         * @param nickname
         */
        socket.on('isPlayerNameUnique', (nickname) => {
            if (!Room.isPlayerUnique(players, nickname)) {
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
                console.log(`[${logDate()}] Room '${room.id}' was added to global rooms array`);
                players[nickname] = player;
                console.log(`[${logDate()}] Player '${nickname}' was added to global players array`);
                socket.emit('roomCreated', room.id);
                socket.join(room.id);
            } else {
                socket.emit('playerNameOccupied');
            }
        });

        /**
         * Checks if somebody can join the room.
         */
        socket.on('canJoinRoom', (roomId) => {
            if (typeof rooms[roomId] !== 'undefined') {
                socket.emit('canJoinRoom', {success: true});
            } else {
                socket.emit('canJoinRoom', {success: false});
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
            console.log(`[${logDate()}] The game has been instantiated in Room '${roomId}'`);
            io.in(roomId).emit('gameCreated', {roomId: roomId, gameId: room.game.id});
        });

        // TODO description
        socket.on('annulGame', (nickname) => {
            // TODO Answer me why do we need this one?
        });

        /**
         * Joins player to specific room in socket.io.
         */
        socket.on('join', (roomId, nickname = 'Guest') => {
            const room = rooms[roomId];
            socket.join(roomId);
            if (typeof room !== 'undefined') {
                console.log(`[${logDate()}] Player '${nickname}' has joined the room '${roomId}'`);
            } else {
                if (players[nickname]) {
                    delete players[nickname];
                    console.log(`[${logDate()}] Player '${nickname}' was removed from global players array`);
                }
                io.in(roomId).emit('leftGame', {player: nickname, left: true});
                console.log(`[${logDate()}] Player '${nickname}' failed to join the room '${roomId}' and left`);
            }
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
                    console.log(`[${logDate()}] The game has been instantiated in Room '${roomId}'`);
                }
                room.game.start();
                console.log(`[${logDate()}] The game has been started in Room '${roomId}'`);
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
            console.log(`[${logDate()}] Player was kicked from Room '${roomId}'`);
        });

        /**
         * Adds player to specific room.
         *
         * @param roomId
         * @param nickname
         */
        socket.on('acceptPlayer', (roomId, nickname) => {
            if (typeof rooms[roomId] === 'undefined') {
                io.in(roomId).emit('roomStatus', 'undefined'); // Should never reach here.
            } else {
                const room = rooms[roomId];
                const newPlayer = new Player(nickname, false);
                const playerWasAccepted = room.addPlayer(newPlayer);

                io.in(roomId).emit('playerWasAccepted', {success: playerWasAccepted});

                if (playerWasAccepted) {
                    players[nickname] = newPlayer;
                    console.log(`[${logDate()}] Player '${nickname}' was added to global players array`);
                    io.in(roomId).emit('playerJoined', room.players);
                }
                console.log(`[${logDate()}] Player '${nickname}' was${playerWasAccepted ? '' : ' not'} accepted to room '${roomId}'`);
            }
        });

        /**
         * Removes the player from game and room.
         *
         * @param roomId
         * @param nickname
         */
        socket.on('leaveGame', (roomId, nickname) => {
            const room = rooms[roomId];
            if (typeof room === 'undefined') {
                let isLeader = false;
                if (players[nickname]) {
                    isLeader = players[nickname].isLeader;
                    delete players[nickname];
                    console.log(`[${logDate()}] Player '${nickname}' was removed from global players array`);
                }
                io.in(roomId).emit('leftGame', {player: nickname, isLeader: isLeader, left: true});
                console.log(`[${logDate()}] Player '${nickname}' has left the room '${roomId}'`);
            } else {
                const isLeader = players[nickname].isLeader;
                const isPlayerRemoved = room.removePlayer(nickname);
                delete players[nickname];
                console.log(`[${logDate()}] Player '${nickname}' was removed from global players array`);
                if (Object.keys(room.players).length < 1) {
                    delete rooms[room.id];
                    console.log(`[${logDate()}] Room '${room.id}' was removed from global rooms array`);
                    io.in(roomId).emit('roomStatus', 'undefined');
                }
                io.in(roomId).emit('leftGame', {player: nickname, isLeader: isLeader, left: isPlayerRemoved});
                console.log(`[${logDate()}] Player '${nickname}' has left the room '${roomId}'`);
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
            const room = rooms[data.roomId];
            if (typeof room === 'undefined') {
                io.in(data.roomId).emit('roomStatus', 'undefined');
            } else {
                const game = room.game;

                if (game.gameOver) {
                    console.log('the game is over man');
                    delete rooms[data.roomId];
                    return;
                }

                const player = players[data.nickname];
                const cheater = game.managePiecePlacement(data.coords, player);

                if (cheater === null) {
                    console.log('\u001b[31mfireInTheHoleTheCheaterIsHere\u001b[0m');
                    io.in(data.roomId).emit('fireInTheHoleTheCheaterIsHere');
                }

                console.log(player.field);

                io.in(data.roomId).emit('sendUpdatedGameData', {
                    myNickName: player.nickname,
                    score: player.score.quantity,
                    level: game.level,
                    field: player.field.matrix
                });
            }
        });
    });
};

export default socketActions;