import crypto from "crypto";
import Game from './Game';

class Room {
    /**
     * @param {Player} player
     */
    constructor(player) {
        this.id = crypto.randomBytes(4).toString('hex');
        this.players = [player];
        this.leader = player;
        this.game = null;
    }

    /**
     * Create new game instance.
     */
    instantiateAGame() {
        this.game = new Game(this.players);
    }

    /**
     * Update players array in game.
     *
     * @private
     */
    _updatePlayersInGame() {
        if (this.game) {
            this.game.players = this.players;
        }
    }

    /**
     * Room can have two players only, if there is more return false and do nothing. Also check if passed player is a
     * leader, if so demote passed player. Demotion is needed because we assume that the room is already has one player
     * when it was created and this player is a leader.
     *
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
        this._updatePlayersInGame();
        return true;
    }

    /**
     * Removes player from players array and promotes other player to leader if needed.
     *
     * @param {Player} player
     * @returns {boolean}
     */
    removePlayer(player) {
        let playerIndex = this.players.indexOf(player);
        if (playerIndex === -1) {
            return false;
        }
        this.players.splice(playerIndex, 1);
        if (player.isLeader && this.players.length) {
            this.promoteToLeader(this.players[0]);
        }
        this._updatePlayersInGame();
        return true;
    }

    /**
     * @param {Player} player
     */
    promoteToLeader(player) {
        const futureLeaderIndex = this.players.indexOf(player);
        if (futureLeaderIndex !== -1) {
            this.leader = player;
            player.isLeader = true;
        }
        // Demote previous leader.
        for (let i = 0; i < this.players.length; i++) {
            if (futureLeaderIndex !== i) {
                this.players[i].isLeader = false;
            }
        }
        this._updatePlayersInGame();
    }

    /**
     * Kicks player from room. Only the leader can kick his opponent.
     *
     * @returns {boolean}
     */
    kickPlayer() {
        if (this.players.length > 1) {
            for (let i = 0; i < this.players.length; i++) {
                if (!this.players[i].isLeader) {
                    this.removePlayer(this.players[i]);
                    this._updatePlayersInGame();
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Fetches player by nickname.
     *
     * @param {string} nickname
     */
    getPlayerByNickname(nickname) {
        return this.players.find(player => player.nickname === nickname);
    }

    /**
     * Fetches opponent using my nickname.
     *
     * @param myNickname
     * @returns {null|T}
     */
    getMeMyOpponentUsingMyNickname(myNickname) {
        if (this.players.length > 1) {
            return this.players.find((player) => player.nickname !== myNickname);
        } else {
            return null;
        }
    }
}

export default Room;