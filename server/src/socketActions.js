import Player from './entity/Player';
import Game from './entity/Game';
import Room from './entity/Room';
import ScoreService from './service/ScoreService';

const GENERATE_PIECES_AMOUNT = 1000;

const logDate = () => {
    return (new Date()).toISOString().slice(0, -5);
};

const socketActions = (io, rooms, onlineStatuses, players) => {
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
                onlineStatuses[socket.id] = nickname;
            } else {
                for (let roomId in rooms) {
                    if (rooms.hasOwnProperty(roomId)) {
                        try {
                            const player = rooms[roomId].getPlayer(nickname);
                            /**
                             * If room is created but the game is not started we can join created room and remove from
                             * this room player with the same nickname (if this player is online).
                             */
                            if (rooms[roomId].game === null || (!rooms[roomId].game.isGameStarted && !rooms[roomId].game.over)) {
                                io.in(roomId).emit('leftGame', {player: nickname});
                                socket.emit('roomCreated', roomId);
                                socket.join(roomId);
                                onlineStatuses[socket.id] = nickname;
                                return;
                            } else {
                                /**
                                 * If the game exists and maybe already started we need to find if the player that is
                                 * playing the game is online or not. If the player is online then we emit occupied else
                                 * the room was abandoned and we can remove it and create the new one.
                                 */
                                for (let status in onlineStatuses) {
                                    if (onlineStatuses.hasOwnProperty(status)) {
                                        if (onlineStatuses[status] === player.nickname) {
                                            socket.emit('playerNameOccupied');
                                            return;
                                        }
                                    }
                                }
                                delete rooms[roomId];
                                console.log(`[${logDate()}] Room '${roomId}' was removed from global rooms array`);
                                const room = new Room(player);
                                rooms[room.id] = room;
                                console.log(`[${logDate()}] Room '${room.id}' was added to global rooms array`);
                                socket.emit('roomCreated', room.id);
                                socket.join(room.id);
                                onlineStatuses[socket.id] = nickname;
                                return;
                            }
                        } catch (e) {
                            // Do nothing.
                        }
                    }
                }
                socket.emit('playerNameOccupied');
            }
        });

        /**
         * Checks if somebody can join the room.
         */
        socket.on('canJoinRoom', (roomId) => {
            if (
                /** Room exists */
                typeof rooms[roomId] !== 'undefined'
                /** Game does not exist */
                && (!rooms[roomId].game ||
                /** or game isn't started (might be) */
                !rooms[roomId].game.isGameStarted)
            ) {
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

        /**
         * Joins player to specific room in socket.io.
         */
        socket.on('join', (roomId, nickname = 'Guest') => {
            const room = rooms[roomId];
            socket.join(roomId);
            onlineStatuses[socket.id] = nickname;
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
                const pieces = Game.generatePieces(GENERATE_PIECES_AMOUNT);
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

                if (game.over) {
                    io.in(data.roomId).emit('gameOver');
                    console.log(`[${logDate()}] The game in room '${data.roomId}' is over`);
                    delete rooms[data.roomId];
                    console.log(`[${logDate()}] Room '${room.id}' was removed from global rooms array`);
                    return;
                }

                const player = players[data.nickname];
                const cheater = game.managePiecePlacement(data.coords, player);

                if (cheater === null) {
                    console.log('\u001b[31mfireInTheHoleTheCheaterIsHere\u001b[0m');
                    console.log('player.field', data.coords);
                    console.log('player.field', player.field);
                    io.in(data.roomId).emit('fireInTheHoleTheCheaterIsHere');
                }
                if (player.nickname === 'dornat') {
                    console.log('\u001b[31mdornat.field\u001b[0m', player.field);
                }

                io.in(data.roomId).emit('sendUpdatedGameData', {
                    myNickName: player.nickname,
                    score: player.score.quantity,
                    level: game.level,
                    field: player.field.matrix
                });
            }
        });

        /**
         * When player sweeps rows the opponent field needs to be reduced
         */
        socket.on('reduceOpponentField', (roomId, nickname, rowsCleared) => {
            const room = rooms[roomId];
            try {
                const opponent = room.getMeMyOpponentUsingMyNickname(nickname);
                for (let i = 0; i < rowsCleared; i++) {
                    opponent.field.destroyRow();
                }
                io.in(roomId).emit('reduceOpponentField', nickname, rowsCleared);
            } catch (e) {
                // Opponent doesn't exist. Do nothing.
            }
        });

        /**
         * Makes the game over on server and notifies players about it.
         *
         * @param roomId
         */
        socket.on('gameOver', (roomId) => {
            const room = rooms[roomId];
            room.game.setOver();
            io.in(roomId).emit('gameOver');
        });

        socket.on('addScoreResult', (nickname, score) => {
            const promise = ScoreService.addScoreResult({nickname, score});

            promise.then(() => {
                socket.emit('scoreResultAdded');
            });
        });

        socket.on('getScoreResults', ({count, page}) => {
            const promise = ScoreService.getScoreResults({count, page});

            promise.then(({page, returned, items, total, pages}) => {
                socket.emit('scoreResults', {
                    page: page,
                    returned: returned,
                    items: items,
                    total: total,
                    pages: pages
                });
            });
        });

        socket.on('disconnect', () => {
            delete onlineStatuses[socket.id];
        });
    });
};

export default socketActions;