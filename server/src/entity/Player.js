class Player {

    constructor(nickname, isLeader) {

        if (typeof isLeader === "undefined") {
            isLeader = true;
        }

        this.nickname = nickname;
        this.isLeader = isLeader;
    }

    setField(field)
    {
        this.field = field;
    }

    // TODO Не забыть вызвать при начале игры
    initScore()
    {
        this.score = 0;
    }

    // Уже посчитанные на фронте баллы
    // 40 100 300 1200
    addToScore(gamePoints)
    {
        this.score += gamePoints;
    }
}