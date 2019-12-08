import {describe} from 'mocha';
import {assert} from 'chai';
import Game from '../src/entity/Game';
import Player from '../src/entity/Player';
import Room from '../src/entity/Room';

describe('Room Tests', function () {
    it('should create the room properly', function () {
        const player = new Player('testName');
        const room = new Room(player);
        assert.isObject(room, 'Amazing! The room is an object!');
    });

    it('should instantiate a new game', function () {
        const player = new Player('testName');
        const room = new Room(player);
        room.instantiateAGame();

        assert.notEqual(room.id, room.game.id);
        assert.isObject(room.game, 'The created game in a room is actually a Game!')
    });

    it('should add player to room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.deepEqual(room.players, room.game.players);
    });

    it('should remove player from room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);
        room.removePlayer(foo);

        assert.deepEqual(room.players, room.game.players);
    });

    it('should kick player from room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);
        room.kickPlayer();

        assert.deepEqual(room.players, room.game.players);
        assert.notDeepEqual(room.players[0], bar, 'Shouldn\'t be bar, because he is not a leader.');
    });

    it('should promote player to leader properly', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.isTrue(foo.isLeader);
        assert.isFalse(bar.isLeader);
        assert.deepEqual(room.leader, foo);
        room.promoteToLeader(bar);

        assert.isTrue(bar.isLeader);
        assert.isFalse(foo.isLeader);

        assert.deepEqual(room.players, room.game.players);
        assert.deepEqual(room.leader, bar);
    });

    it('should get player by nickname', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.deepEqual(bar, room.getPlayerByNickname('bar'));
        assert.deepEqual(foo, room.getMeMyOpponentUsingMyNickname('bar'))
    });
});
