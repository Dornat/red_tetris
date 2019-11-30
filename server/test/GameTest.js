import {describe} from 'mocha';
import {assert} from 'chai';
import Game from '../src/entity/Game';
import Player from '../src/entity/Player';

describe('Game Tests', function () {
    it('should check if hashed gameId is there when you created a game', function () {
        let player = new Player('testName');
        let game = new Game(player);

        assert.isString(game.id);
    });

    it('should check if the players array exists after creating a game', function () {
        let player = new Player('testName');
        let game = new Game(player);

        assert.isArray(game.players);
    });

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

    it('should check if the second player got demoted from leader after adding him to the game', function () {
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

        assert.lengthOf(game.players, 2, 'the amount of players is two');
    });

    it('should remove player that not a leader successfully', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);
        game.removePlayer(player2);

        assert.lengthOf(game.players, 1, 'there is only one player');
    });

    it('should remove leader successfully', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);
        game.removePlayer(player1);

        assert.lengthOf(game.players, 1, 'there is only one player');
        assert.equal(game.players[0].isLeader, true, 'the last player is a leader');
    });

    it('should kick player successfully', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);
        game.kickPlayer();

        assert.lengthOf(game.players, 1, 'there is only one player');
        assert.equal(game.players[0].isLeader, true, 'the last player is a leader');
    });

    it('should promote opponent to leader when leader exits', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);
        game.exitFromGame(player1.nickname);

        assert.lengthOf(game.players, 1, 'there is only one player');
        assert.equal(game.players[0].isLeader, true, 'the last player is a leader');
    });

    it('should generate random array of pieces', function () {
        let player1 = new Player('testName1');
        let game = new Game(player1);

        let pieces = game.generatePieces(3);

        assert.isArray(pieces, 'lets assume that this array is perfectly random');
    });

    it('should get player by nickname', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);

        game.addPlayer(player2);

        let returned = game.getPlayerByNickname('testName1');
        let returned2 = game.getPlayerByNickname('testName2');
        let returnedFalse = game.getPlayerByNickname('testName');

        assert.equal(returned, player1, 'this player is The Chosen One');
        assert.equal(returned2, player2, 'this player is The Chosen One');
        assert.equal(returnedFalse, undefined, 'this player is not here');
    });

    it('should get opponent field', function () {
        let player1 = new Player('testName1');
        let player2 = new Player('testName2');
        let game = new Game(player1);
        game.addPlayer(player2);

        let coords = [[0, 0], [0, 1], [0, 2], [0, 3]];
        let preFilledMatrixWithCoords = [1, 1, 1, 1];

        player1.field.fillCoordinates(coords);

        let resultingPlayer = game.getMeMyOpponentByNickname('testName2');
        let badPlayer = game.getMeMyOpponentByNickname('testName1');

        assert.deepEqual(resultingPlayer.field.matrix[0].slice(0, 4), preFilledMatrixWithCoords);
        assert.notDeepEqual(badPlayer.field.matrix[0].slice(0, 4), preFilledMatrixWithCoords);
    });
});