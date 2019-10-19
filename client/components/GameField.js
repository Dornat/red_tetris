import React, {useState, useEffect} from 'react';
import Cell from './Cell';
import {COLUMN_AMOUNT, ROWS_AMOUNT} from "../utils/createField";
import {connect} from 'react-redux';
import tetrominoes from '../utils/TetrominoesScheme'

import {useField} from "../hooks/useField";
import {usePiece} from "../hooks/usePiece";

const GameField = (props) => {

    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    

    useEffect(() => {
        props.socket.emit('getNextPieces', props.game_id);
        props.socket.on('getNextPieces', (data) => {
            console.log(data);
        });

        // props.socket.on('gameStarted', (data) => {
        //     props.socket.emit('getNextPieces');
        // });

        // props.socket.on('getNextPieces', (data) => {
        //
        // });

    });

    return (
        <div className="flex_centered">
            <div className="field">
                {props.field.map(
                    row => row.map(
                        (cell, x) => <Cell key={x} type={cell[0]}/>
                    )
                )}
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