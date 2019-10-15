import tetrominoes from '../constants/Tetrominoes'

class Piece {
    constructor() {
        // Generation of random shape.
        let randomNum = Math.floor(Math.random() * tetrominoes.length);
        this.shape = tetrominoes[randomNum];
    }
}

export default Piece;