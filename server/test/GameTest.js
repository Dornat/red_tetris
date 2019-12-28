import {describe} from 'mocha';
import {assert} from 'chai';
import Game from '../src/entity/Game';
import Player from '../src/entity/Player';
import Room from '../src/entity/Room';

// TODO Write more tests. Especially for piece management (for a lot of cases).
describe('Game Tests', function () {
    it('should properly over the game', function () {
        const player = new Player('testName');
        const room = new Room(player);
        room.instantiateAGame();

        assert.isFalse(room.game.over);
        room.game.setOver();
        assert.isTrue(room.game.over);
    });
});