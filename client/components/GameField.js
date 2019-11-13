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
        if (!checkCollision(piece, field, {x: 0, y: 1})) {
            updatePiecePosition({x: 0, y: 1, collided: false});
        } else {
            console.log('I\'m in else');
            console.log(pieces.length);
            if (pieces.length === 0) {
                console.log(props.game_id);
                socket.emit('generatePieces', {id: props.game_id});
                socket.on('getPieces', (data) => {
                    setPieces(data.pieces);
                    updatePiecePosition({x: 0, y: 0, collided: true});
                });
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

    socket.on('gameStarted', (response) => {
        if (response.game_id === game_id) {
            setGameStarted(true);
            props.startGameAction();
            console.log('gameStarted socket');
            socket.emit('generatePieces', {id: response.game_id});
            socket.on('getPieces', (data) => {
                setPieces(data.pieces);
                console.log('pieces in gameStarted socket', pieces);
                // updatePiecePosition({x: 0, y: 0, collided: false});
                // resetPiece(pieces[0].shape);
                console.log('piece in gameStarted socket', piece);
            });
        }
    });
    
    useEffect(() => {
        console.log('useEffect');
        resetPiece(pieces[0].shape);
        console.log(piece);
        // const socket = props.socket;
        // const game_id = props.game_id;
        //
        // socket.on('gameStarted', (response) => {
        //     if (response.game_id === game_id) {
        //         setGameStarted(true);
        //         props.startGameAction();
        //         console.log('gameStarted socket');
        //         socket.emit('generatePieces', {id: response.game_id});
        //         socket.on('getPieces', (data) => {
        //             console.log(pieces);
        //             console.log(data.pieces);
        //             setPieces('hello');
        //             console.log(pieces);
        //         });
        //     }
        // });
        // startGame();
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

    }, [pieces]);


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