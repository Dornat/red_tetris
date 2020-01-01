const SCORE_BASE = 42;

class Score {

    constructor() {
        this.quantity = 0;
    }

    increaseScore(numberOfLinesCleared, level) {
        this.quantity = this.quantity + ((SCORE_BASE * (level + 1)) * numberOfLinesCleared);
    }
}

export default Score;