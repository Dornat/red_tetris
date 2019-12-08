import crypto from 'crypto';
import Piece from './Piece';
import Player from './Player';

const LEVEL_MEDIAN = 1000;

class Game {
    /**
     * Accepts an array of players passed from Room.
     *
     * @param {array} players
     */
    constructor(players) {
        this.id = crypto.randomBytes(4).toString('hex');
        this.level = 1;
        this.isGameStarted = false;
        this.players = players;
    }

    startGame() {
        if (this.isGameStarted === false) {
            this.isGameStarted = true;
        }
    }

    /**
     * Generates array with random pieces.
     *
     * @param {int} numberOfPieces
     * @returns {array}
     */
    static generatePieces(numberOfPieces) {
        let pieces = [];
        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push(new Piece());
        }

        return pieces;
    }

    /**
     * Manages peace placement, fills coordinates for appropriate player field, sweeps field rows, increases player
     * score, increases game level.
     *
     * @param {array} coordinates
     * @param {Player} player
     * @returns {number}
     */
    managePiecePlacement(coordinates, player) {
        const sweptRows = player.field.fillCoordinates(coordinates);
        if (sweptRows) {
            player.score.increaseScore(sweptRows, this.level);
        }
        this._manageLevel();
        return sweptRows;
    }

    /**
     * Calculates sum of scores for all players and then intelligently increases game level depending on result.
     *
     * @private
     */
    _manageLevel() {
        let accumulatedScore = 0;
        for (let i = 0; i < this.players.length; i++) {
            accumulatedScore += this.players[i].score.quantity;
        }

        if ((accumulatedScore / LEVEL_MEDIAN) > this.level) {
            this.level += 1;
        }
    }
}

export default Game;