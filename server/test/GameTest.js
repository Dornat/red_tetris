import {describe} from 'mocha';
import {assert} from 'chai';
import Game from '../src/entity/Game';
import Player from '../src/entity/Player';

describe('Game Tests', function () {
    it('should check if the player is leader in newly created game', function () {
        let player = new Player('testName');
        let game = new Game(player);

        assert.equal(game.players[0].isLeader, true);
    });

    it('should add second player properly', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);

        assert.equal(game.players.length, 2);
    });

    it('should check if the second player got demoted from leader', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);

        assert.equal(game.players[1].isLeader, false);
    });

    it('should not add third player to the game', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let player3 = new Player('testName3');
        let game = new Game(player1);

        game.addPlayer(player2);
        game.addPlayer(player3);

        assert.equal(game.players.length, 2, 'the amount of players is two');
    });
});