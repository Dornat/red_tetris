import Field from './Field';
import Score from './Score';

class Player {
    /**
     * @param {string} nickname
     * @param {boolean} isLeader
     */
    constructor(nickname, isLeader = true) {
        if (typeof isLeader === "undefined") {
            isLeader = true;
        }

        this.nickname = nickname;
        this.isLeader = isLeader;
        this.field = new Field();
        this.score = new Score();
        this.level = 1;
        this.online = true;
    }
}

export default Player;