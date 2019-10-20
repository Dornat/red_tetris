import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import {COLUMN_AMOUNT, createField, ROWS_AMOUNT} from "../utils/createField";
import {connect} from 'react-redux';
import tetrominoes from '../utils/TetrominoesScheme'
import Field from './Field';

import {useField} from "../hooks/useField";
import {usePiece} from "../hooks/usePiece";
import {checkCollision} from "../utils/checkCollision";

const GameField = (props) => {

    const [pieces, setPieces] = useState('L');

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [piece, updatePiecePosition, resetPiece] = usePiece('L');
    const [field, setField] = useField(piece, resetPiece);

    console.log('re-render');

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
        updatePiecePosition({x: 0, y: 1, collided: false});
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

    useEffect(() => {
        startGame();
        // props.socket.emit('generatePieces', {id: props.game_id});
        // props.socket.on('getPieces', (data) => {
        //     console.log(pieces);
        //     if (pieces.length === 0 || pieces[0] === '0') {
        //         console.log(data.pieces);
        //         setPieces(data.pieces);
        //         console.log(pieces);
        //     }
        //     console.log(pieces[0].shape);
        //     // usePiece(pieces[0].shape)
        // });

        // props.socket.on('gameStarted', (data) => {
        //     props.socket.emit('getNextPieces');
        // });

        // props.socket.on('getNextPieces', (data) => {
        //
        // });

    }, []);


    return (
        <div tabIndex="0" className="flex_centered" onKeyDown={e => move(e)}>
            <div className="field">
                <Field field={field}/>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        game_id: state.game.id
    }
};

export default connect(mapStateToProps, null)(GameField);