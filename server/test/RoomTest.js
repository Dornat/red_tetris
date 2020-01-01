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
        assert.instanceOf(room.game, Game, 'The created game in a room is actually a Game!')
    });

    it('should get player properly', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const baz = new Player('baz');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.deepEqual(room.getPlayer(foo), foo);
        assert.deepEqual(room.getPlayer(foo.nickname), foo);
        assert.deepEqual(room.getPlayer(bar), bar);
        assert.deepEqual(room.getPlayer(bar.nickname), bar);
        assert.throws(() => room.getPlayer(baz), Error, 'Player does not exist!');
        assert.throws(() => room.getPlayer('hello'), Error, 'Player does not exist!');
        assert.throws(() => room.getPlayer('undefined'), Error, 'Player does not exist!');
    });

    it('should get opponent by my nickname', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const baz = new Player('baz');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.deepEqual(room.getMeMyOpponentUsingMyNickname(foo.nickname), bar);
        assert.throws(() => room.getMeMyOpponentUsingMyNickname(baz.nickname), Error, 'Player does not exist!');
        room.removePlayer(bar);
        assert.throws(() => room.getMeMyOpponentUsingMyNickname(foo.nickname), Error, 'Opponent does not exist!');
    });

    it('should add player to room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.deepEqual(room.players, room.game.players);
        assert.isFalse(room.getPlayer(bar).isLeader);
        const baz = new Player('baz');
        assert.isFalse(room.addPlayer(baz));
        room.removePlayer(bar);
        assert.isFalse(room.addPlayer(foo));
    });

    it('should remove player from room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);
        room.removePlayer(foo);

        assert.deepEqual(room.players, room.game.players);
        assert.deepEqual(room.leader, bar)
    });

    it('should remove last player in game', function () {
        const foo = new Player('foo');
        const room = new Room(foo);
        room.instantiateAGame();
        room.removePlayer(foo);

        assert.isEmpty(room.players, 'should be empty');
        assert.isNull(room.leader, 'should be null');
    });

    it('should kick player from room and game', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);
        assert.isTrue(room.kickPlayer());
        assert.deepEqual(room.players, room.game.players);
        assert.notDeepEqual(room.players[0], bar, 'Shouldn\'t be bar, because he is not a leader.');
        assert.isFalse(room.kickPlayer());
    });

    it('should do leader reassignment', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);


        assert.isTrue(foo.isLeader);
        assert.isFalse(bar.isLeader);
        assert.deepEqual(room.leader, foo);
        room.reassignLeader(foo, bar);

        assert.isTrue(bar.isLeader);
        assert.isFalse(foo.isLeader);

        assert.deepEqual(room.players, room.game.players);
        assert.deepEqual(room.leader, bar);
        const tar = new Player('tar');
        assert.throws(() => room.reassignLeader(tar, bar), Error, 'Player does not exist!');
        assert.throws(() => room.reassignLeader(bar, tar), Error, 'Player does not exist!');
    });

    it('should promote player to leader', function () {
        const foo = new Player('foo');
        const bar = new Player('bar');
        const tar = new Player('tar');
        const room = new Room(foo);
        room.instantiateAGame();
        room.addPlayer(bar);

        assert.isFalse(bar.isLeader);
        room.promoteToLeader(bar);
        assert.isTrue(bar.isLeader);
        assert.throws(() => room.promoteToLeader(tar), Error, 'Player does not exist!');
    });
});
