import {describe} from 'mocha';
import {assert} from 'chai';
import Player from '../src/entity/Player';
import Field from '../src/entity/Field';

describe('Player Tests', function () {
    it('should check if newly created player is a leader', function () {
        const player = new Player('testName');
        assert.equal(player.isLeader, true);
    });

    it('should check if player has field', function () {
        const player = new Player('testName');
        assert.instanceOf(player.field, Field);
    });

    it('should check if online status key is null', function () {
        const player = new Player('testName');
        assert.isNull(player.onlineStatusKey);
    });

    it('should set online status', function () {
        const player = new Player('testName', true, 'status');
        assert.equal('status', player.onlineStatusKey);
    });
});
