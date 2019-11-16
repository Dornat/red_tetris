import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import {COLUMN_AMOUNT, createField, ROWS_AMOUNT} from "../utils/createField";
import {connect} from 'react-redux';
import tetrominoes from '../utils/TetrominoesScheme'
import Field from './Field';

import {useField} from "../hooks/useField";
import {usePiece} from "../hooks/usePiece";
import {useInterval} from "../hooks/useInterval";
import {checkCollision} from "../utils/checkCollision";
import {startGameAction} from "../actions/gameActions";

const GameField = (props) => {

    const [pieces, setPieces] = useState([{shape: 0}]);
    const [isGameStarted, setGameStarted] = useState(false);

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [piece, updatePiecePosition, resetPiece, pieceRotate] = usePiece(0);
    const [field, setField] = useField(piece, resetPiece, pieces);

    const movePiece = direction => {
        if (!checkCollision(piece, field, {x: direction, y: 0})) {
            updatePiecePosition({x: direction, y: 0});
        }
    };

    const startGame = () => {
        // reset everything
        setField(createField());
        resetPiece('T');
    };

    const drop = () => {
        if (!checkCollision(piece, field, {x: 0, y: 1})) {
            updatePiecePosition({x: 0, y: 1, collided: false});
        } else {
            if (piece.position.y < 1) {
                console.log('GAME OVER!!!');
                setGameOver(true);
                setDropTime(null);
            }
            if (pieces.length === 0) {
                socket.emit('generatePieces', {id: props.game_id}); // inject pieces with new dose from server
            } else {
                updatePiecePosition({x: 0, y: 0, collided: true});
            }

            const coords = assembleCoordinatesForFillingFieldOnServer(piece);
            socket.emit('updatePlayerField', {id: props.game_id, nickname: props.user, coords: coords});
        }
    };

    const assembleCoordinatesForFillingFieldOnServer = piece => {
        const tetromino = piece.tetromino;
        let variableCoords = JSON.parse(JSON.stringify(piece.position)); // important cloning of original object
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

    const keyReleased = (e) => {
        if (!gameOver) {
            if (e.keyCode === 40) {
                setDropTime(1000);
            }
        }
    };

    const dropPiece = () => {
        setDropTime(null);
        drop();
    };

    const move = (e) => {
        if (!gameOver) {
            if (e.keyCode === 72 || e.keyCode === 37) {
                movePiece(-1);
            } else if (e.keyCode === 76 || e.keyCode === 39) {
                movePiece(1);
            } else if (e.keyCode === 74 || e.keyCode === 40) {
                dropPiece();
            } else if (e.keyCode === 38) {
                pieceRotate(field, 1);
            }
        }
    };

    const socket = props.socket;
    const game_id = props.game_id;

    useEffect(() => {
        if (pieces.length === 5) { // draw piece only for first piece in pieces array and only when array is full
            updatePiecePosition({x: 0, y: 0, collided: true}); // true is important here
        }
    }, [pieces]); // this fires every time when pieces array is refreshed

    useEffect(() => {
        socket.on('gameStarted', (response) => {
            if (response.game_id === game_id) {
                setGameStarted(true);
                setDropTime(1000);
                props.startGameAction();
                socket.emit('generatePieces', {id: response.game_id});
                socket.on('getPieces', (data) => {
                    setPieces(data.pieces);
                });
            }
        });
    }, []);

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <div tabIndex="0" className="flex_centered" onKeyDown={e => move(e)} onKeyUp={keyReleased}>
            <div className="field">
                <Field field={field}/>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        startGameAction: () => {
            dispatch(startGameAction())
        }
    }
};

export default connect(null, mapDispatchToProps)(GameField);