import {describe} from 'mocha';
import {assert} from 'chai';
import Player from '../src/entity/Player';
import Field from '../src/entity/Field';

describe('Player Tests', function () {
    it('should check if newly created player is a leader', function () {
        let player = new Player('testName');

        assert.equal(player.isLeader, true);
    });

    it('should check if player has field', function () {
        let player = new Player('testName');

        assert.instanceOf(player.field, Field);
    });
});
