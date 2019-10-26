export const checkCollision = (piece, field, {x: moveX, y: moveY}) => {
    for (let y = 0; y < piece.tetromino.length; y++) {
        for (let x = 0; x < piece.tetromino[y].length; x++) {
            // check if we are on tetromino cell
            if (piece.tetromino[y][x] !== 0) {
                // check if we are in field boundaries
                if (!field[y + piece.position.y + moveY] ||
                    !field[y + piece.position.y + moveY][x + piece.position.x + moveX] ||
                    field[y + piece.position.y + moveY][x + piece.position.x + moveX][1] !== 'empty') {
                    return true;
                }
            }
        }
    }

};