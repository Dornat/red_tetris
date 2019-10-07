class Game {

    constructor(room, playerName) {
        this.room = room;
        this.playerName = playerName;

        let gameField = new GameField();
        this.player = new Player(playerName, gameField)
    }


}