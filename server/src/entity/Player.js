import Field from './Field';

class Player {
    /**
     * @param {string} nickname
     * @param {boolean=} isLeader
     */
    constructor(nickname, isLeader) {
        if (typeof isLeader === "undefined") {
            isLeader = true;
        }

        this.nickname = nickname;
        this.isLeader = isLeader;
        this.field = new Field();
    }

    /**
     * @param {Field} field
     */
    setField(field) {
        this.field = field;
    }


    // TODO Не забыть вызвать при начале игры
    initScore() {
        this.score = 0;
    }

    /**
     * Уже посчитанные на фронте баллы
     * Example: 40 100 300 1200
     * @param {number} gamePoints
     */
    addToScore(gamePoints) {
        this.score += gamePoints;
    }
}

export default Player;