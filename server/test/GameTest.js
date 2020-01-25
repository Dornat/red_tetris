import Game from '../src/entity/Game';
import Player from '../src/entity/Player';
import Room from '../src/entity/Room';
import {assert} from 'chai';
import {describe} from 'mocha';

describe('Game Tests', function () {
    it('should properly over the game', function () {
        const player = new Player('testName');
        const room = new Room(player);
        room.instantiateAGame();

        assert.isFalse(room.game.over);
        room.game.setOver();
        assert.isTrue(room.game.over);
    });

    it('should check if the game was started', function () {
        const player = new Player('testName');
        const room = new Room(player);
        room.instantiateAGame();
        assert.isFalse(room.game.isGameStarted);
        room.game.start();
        assert.isTrue(room.game.isGameStarted);
    });

    it('should generate pieces', function () {
        const pieces = Game.generatePieces(10);
        assert.isArray(pieces);
        assert.lengthOf(pieces, 10);
    });

    it('should return proper swept rows', function () {
        const player = new Player('testName');
        const game = new Game([player]);
        const coordsI = [[19, 0], [19, 1], [19, 2], [19, 3]];
        const coordsL = [[19, 4], [19, 5], [19, 6], [18, 6]];
        const coordsT = [[19, 7], [19, 8], [19, 9], [18, 8]];

        game.managePiecePlacement(coordsI, player);
        game.managePiecePlacement(coordsL, player);
        assert.isTrue(player.score.quantity === 0);
        const sweptRows = game.managePiecePlacement(coordsT, player);
        assert.equal(1, sweptRows);
        assert.isTrue(player.score.quantity > 0);
    });

    it('should increase level', function () {
        const player = new Player('testName');
        const game = new Game([player]);
        const coordsI = [[19, 0], [19, 1], [19, 2], [19, 3]];
        const coordsL = [[19, 4], [19, 5], [19, 6], [18, 6]];
        const coordsT = [[19, 7], [19, 8], [19, 9], [18, 8]];

        player.score.quantity = 1000;
        game.managePiecePlacement(coordsI, player);
        game.managePiecePlacement(coordsL, player);
        assert.isTrue(game.level === 1);
        game.managePiecePlacement(coordsT, player);
        assert.isTrue(game.level > 1);
    });
});