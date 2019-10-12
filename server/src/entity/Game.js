class Game {

    constructor(player) {

        // Генерация id
        // Проверка на уникальность id
        this.id = 1;


        this.players = [player];
        this.leader = player;

        // Возможно что-то еще
    }

    addPlayer(player) {

        // Проверка не больше двух игроков
        this.player.push(player);
    }

    removePlayer(player) {
        // Удаление пользователя из массива пользователей
    }

    promoteToLeader(player)
    {
        // проверка игрок принадлежит игре
        this.leader = player;
    }


    // enableLevelSystem(level)
    // {
    //
    // }

    // TODO ??
    // startGame()
    // {
    //
    // }
    //
    // restartGame()
    // {
    //
    // }


}