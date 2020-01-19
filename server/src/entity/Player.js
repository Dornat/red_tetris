import Field from './Field';
import Score from './Score';

class Player {
    /**
     * @param {string} nickname
     * @param {boolean} isLeader
     * @param {string|null} onlineStatusKey
     */
    constructor(nickname, isLeader = true, onlineStatusKey = null) {
        this.nickname = nickname;
        this.isLeader = isLeader;
        this.field = new Field();
        this.score = new Score();
        this.level = 1;
        this.onlineStatusKey = onlineStatusKey;
    }
}

export default Player;