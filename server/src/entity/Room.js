import crypto from "crypto";

class Room {

    constructor(player) {
        this.id = crypto.randomBytes(4).toString('hex');
        this.players = [player];
        this.leader = player;
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
     * Returns player by its nickname
     * @param {string} nickname
     */
    getPlayerByNickname(nickname) {
        return this.players.find(player => player.nickname === nickname);
    }
}

export default Room;