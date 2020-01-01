import crypto from 'crypto';
import Game from './Game';
import Player from './Player';

class Room {
    /**
     * @param {Player} player
     */
    constructor(player) {
        this.id = crypto.randomBytes(4).toString('hex');
        this.players = {}; // In JS we can't store key => value pairs in arrays.
        this.players[player.nickname] = player;
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
     * Room can have two players only, if there is more return false and do nothing. Also check if passed player is a
     * leader, if so demote passed player. Demotion is needed because we assume that the room is already has one player
     * when it was created and this player is a leader.
     *
     * @param {Player} player
     */
    addPlayer(player) {
        if (Object.keys(this.players).length > 1) {
            return false;
        } else if (!Room.isPlayerUnique(this.players, player.nickname)) {
            return false;
        }
        if (player.isLeader) {
            player.isLeader = false;
        }
        this.players[player.nickname] = player;
        return true;
    }

    /**
     * Checks if given nickname doesn't exist (is unique) in players array.
     *
     * @param players
     * @param nickname
     * @returns {boolean}
     */
    static isPlayerUnique(players, nickname) {
        return nickname in players === false;
    }

    /**
     * Removes player from players array and promotes other player to leader if needed.
     *
     * @param {Player|string} player
     * @returns {boolean}
     * @throws Error
     * @throws TypeError
     */
    removePlayer(player) {
        const playerToRemove = this.getPlayer(player);
        if (playerToRemove.isLeader) {
            delete this.players[playerToRemove.nickname];
            const nickname = Object.keys(this.players)[0];
            if (typeof nickname === 'undefined') { // There are no players left.
                this.leader = null;
            } else {
                this.promoteToLeader(this.players[nickname]);
            }
        } else {
            delete this.players[playerToRemove.nickname];
        }
        return true;
    }

    /**
     * Check if player is present in room.
     *
     * @param {Player|string} player
     * @returns {boolean}
     * @private
     */
    _isPlayerExists(player) {
        if (player instanceof Player && player.nickname in this.players) {
            return true;
        } else return typeof player === 'string' && player in this.players;
    }

    /**
     * Handles promotion of the player. It doesn't know whether an opponent exists, that's why it won't demote other
     * leader.
     *
     * @param {Player} player
     */
    promoteToLeader(player) {
        if (!this._isPlayerExists(player)) {
            throw new Error('Player does not exist!');
        }
        player.isLeader = true;
        this.leader = this.players[player.nickname];
    }

    /**
     * Reassigns leader role from one player to another.
     *
     * @param {Player} from
     * @param {Player} to
     */
    reassignLeader(from, to) {
        if (!this._isPlayerExists(from) || !this._isPlayerExists(to)) {
            throw new Error('Player does not exist!');
        }
        from.isLeader = false;
        this.promoteToLeader(to);
    }

    /**
     * Kicks player from room. Only the leader can kick his opponent.
     *
     * @returns {boolean}
     */
    kickPlayer() {
        try {
            const opponent = this.getMeMyOpponentUsingMyNickname(this.leader.nickname);
            this.removePlayer(opponent);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Gets player in players array using Player instance or nickname.
     *
     * @param {Player|string} player
     * @returns {Player}
     * @throws Error
     * @throws TypeError
     */
    getPlayer(player) {
        if (this._isPlayerExists(player)) {
            if (player instanceof Player) {
                return this.players[player.nickname];
            } else if (typeof player === 'string') {
                return this.players[player];
            }
        }
        throw new Error('Player does not exist!');
    }

    /**
     * Fetches opponent using my nickname.
     *
     * @param {string} myNickname
     * @returns {Player}
     */
    getMeMyOpponentUsingMyNickname(myNickname) {
        if (this._isPlayerExists(myNickname)) {
            if (Object.keys(this.players).length > 1) {
                const playerNames = Object.keys(this.players);
                for (let i = 0; i < playerNames.length; i++) {
                    if (playerNames[i] !== myNickname) {
                        return this.players[playerNames[i]];
                    }
                }
            } else {
                throw new Error('Opponent does not exist!');
            }
        }
        throw new Error('Player does not exist!');
    }
}

export default Room;