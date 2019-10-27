import crypto from 'crypto';
import Player from './Player';
import Piece from './Piece';

class Game {
    /**
     * @param {Player} player
     */
    constructor(player) {
        this.id = crypto.randomBytes(4).toString('hex');

        this.players = [player];
        this.leader = player;

        // Возможно что-то еще
        this.isGameStarted = false;
    }

    startGame() {
        if (this.isGameStarted === false) {
            this.isGameStarted = true;
        }
    }

    /**
     * Two players only, if more return false and do nothing
     * Also checks if passed player is a leader, if so demote player
     * @param {Player} player
     */
    addPlayer(player) {
        if (this.players.length > 1) {
            return false
        }

        if (player.isLeader) {
            player.isLeader = false;
        }
        this.players.push(player);
        return true;
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        let playerIndex = this.players.indexOf(player);
        this.players.splice(playerIndex, 1);
        if (player.isLeader && this.players.length) {
            this.promoteToLeader(this.players[0]);
        }
        console.log("RETURNING TRUE");
        return true;
    }

    /**
     * Only leaders can kick players
     * @returns {boolean}
     */
    kickPlayer() {
        if (this.players.length > 1) {
            for (let i = 0; i < this.players.length; i++) {
                if (!this.players[i].isLeader) {
                    this.removePlayer(this.players[i]);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param {Player} player
     */
    promoteToLeader(player) {
        if (this.players.indexOf(player) !== -1) {
            this.leader = player;
            player.isLeader = true;
        }
    }

    /**
     * Remove player from the game
     * @param {string} playerName
     * @returns {boolean}
     */
    exitFromGame(playerName) {

        let success = false;

        this.players.forEach((player) => {
            if (player.nickname === playerName) {
                success = this.removePlayer(player);
            }
        });
        return success;
    }

    /**
     * Generates array with random pieces
     * @param {int} numberOfPieces
     * @returns {array}
     */
    generatePieces(numberOfPieces) {
        let pieces = [];
        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push(new Piece());
        }

        return pieces;
    }



    // enableLevelSystem(level) {
    //
    // }

    // TODO ??
    // startGame() {
    //
    // }
    //
    // restartGame() {
    //
    // }
}

export default Game;