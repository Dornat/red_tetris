import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import {COLUMN_AMOUNT, createField, ROWS_AMOUNT} from "../utils/createField";
import {connect} from 'react-redux';
import tetrominoes from '../utils/TetrominoesScheme'
import Field from './Field';

import {useField} from "../hooks/useField";
import {usePiece} from "../hooks/usePiece";
import {checkCollision} from "../utils/checkCollision";
import {startGameAction} from "../actions/gameActions";

const GameField = (props) => {

    const [pieces, setPieces] = useState([{shape: 0}]);
    const [isGameStarted, setGameStarted] = useState(false);

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [piece, updatePiecePosition, resetPiece] = usePiece(0);
    const [field, setField] = useField(piece, resetPiece, pieces);

    // console.log('re-render');

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
            if (pieces.length === 0) {
                socket.emit('generatePieces', {id: props.game_id});
            } else {
                updatePiecePosition({x: 0, y: 0, collided: true});
            }
        }
    };

    const dropPiece = () => {
        drop();
    };

    const move = (e) => {
        if (e.keyCode === 72 || e.keyCode === 37) {
            movePiece(-1);
        } else if (e.keyCode === 76 || e.keyCode === 39) {
            movePiece(1);
        } else if (e.keyCode === 74 || e.keyCode === 40) {
            dropPiece();
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
                props.startGameAction();
                socket.emit('generatePieces', {id: response.game_id});
                socket.on('getPieces', (data) => {
                    setPieces(data.pieces);
                });
            }
        });
    }, []);

    return (
        <div tabIndex="0" className="flex_centered" onKeyDown={e => move(e)}>
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