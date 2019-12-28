export const assembleCoordinatesForFillingFieldOnServer = piece => {
    const tetromino = piece.tetromino;
    let variableCoords = JSON.parse(JSON.stringify(piece.position)); // Important cloning of original object.
    let coords = [];

    for (let i = 0; i < tetromino.length; i++) {
        variableCoords.x = piece.position.x;
        for (let j = 0; j < tetromino[i].length; j++) {
            if (tetromino[i][j] !== 0) {
                coords.push([
                    variableCoords.y,
                    variableCoords.x
                ]);
            }
            variableCoords.x += 1;
        }
        variableCoords.y += 1;
    }

    return coords;
};