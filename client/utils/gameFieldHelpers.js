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

export const fieldDebug = (field, message = null) => {
    let table = 'c\\r||';
    for (let j = 0; j < field[0].length; j++) {
        table += `${j}|`;
    }
    table += '\n';
    for (let i = 0; i < field.length; i++) {
        if (i < 10) {
            table += '  ';
        } else {
            table += ' ';
        }
        table += `${i}||`;
        for (let j = 0; j < field[i].length; j++) {
            table += `${field[i][j][0]}|`;
        }
        table += '\n';
    }
    if (message !== null) {
        console.log(message + '\n', table);
    } else {
        console.log(table);
    }
};

export const piecesDebug = (pieces, message = null) => {
    let object = '';

    for (let i = 0; i < pieces.length; i++) {
        object += `{${pieces[i].shape}}`;
    }
    if (message !== null) {
        console.log(message, object);
    } else {
        console.log(object);
    }
};