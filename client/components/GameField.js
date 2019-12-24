import EnemyField from './EnemyField';
import Field from './Field';
import GameStats from './GameStats';
import NextPieceField from './NextPieceField';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {checkCollision} from '../utils/checkCollision';
import {connect} from 'react-redux';
import {createField} from '../utils/createField';
import {createGameAction, startGameAction, setScoreAction, setPiecesAction} from '../actions/gameActions';
import {useField} from '../hooks/useField';
import {useInterval} from '../hooks/useInterval';
import {usePiece} from '../hooks/usePiece';

const GameField = (props) => {
    const DROPTIME_MULTIPLIER = 142;
    const DROPTIME_BASE = 1000;

    const [piecesBuffer, setPiecesBuffer] = useState([{shape: 0}]);
    const [pieces, setPieces] = useState([{shape: 0}]);
    const [isGameStarted, setGameStarted] = useState(false);
    const [gameLevel, setGameLevel] = useState(null);
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [piece, updatePiecePosition, resetPiece, pieceRotate] = usePiece(0);
    const [field, setField] = useField(piece, resetPiece, pieces, piecesBuffer, setPieces, props);
    const [opponentField, setOpponentField] = useState(createField());

    const movePiece = direction => {
        if (!checkCollision(piece, field, {x: direction, y: 0})) {
            updatePiecePosition({x: direction, y: 0});
        }
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
            console.log('piecesBuffer', piecesBuffer, piecesBuffer.length);
            if (piecesBuffer.length === 1) {
                socket.emit('generatePieces', props.roomId); // Inject pieces with new dose from server.
            } else {
                updatePiecePosition({x: 0, y: 0, collided: true});
            }

            const coords = assembleCoordinatesForFillingFieldOnServer(piece);
            console.log('reached updatePlayerField');
            socket.emit('updatePlayerField', {roomId: props.roomId, nickname: props.user, coords: coords});
        }
    };

    const assembleCoordinatesForFillingFieldOnServer = piece => {
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

    const keyReleased = (e) => {
        if (!gameOver) {
            if (e.keyCode === 40) {
                setDropTime(assembleDropTime());
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

    const assembleDropTime = () => {
        let dropTime = DROPTIME_BASE - (gameLevel * DROPTIME_MULTIPLIER);
        if (dropTime < 42) {
            dropTime = 42;
        }
        return dropTime;
    };

    const socket = props.socket;
    const roomId = props.roomId;

    useEffect(() => {
        if (pieces.length === 5) { // Draw piece only for first piece in pieces array and only when array is full.
            updatePiecePosition({x: 0, y: 0, collided: true}); // True is important here.
        }
    }, [pieces]); // This fires every time when pieces are updated.

    useEffect(() => {
        if (pieces.length === 0 || pieces[0].shape === 0) {
            setPieces(piecesBuffer);
        }
    }, [piecesBuffer]);

    useEffect(() => {
        socket.on('gameStarted', (response) => {
            if (response.roomId === roomId) {
                setGameLevel(1);
                setGameStarted(true);
                setDropTime(assembleDropTime());
                props.createGameAction(response.gameId);
                props.startGameAction();
                socket.emit('generatePieces', props.roomId);
                socket.on('getPieces', (data) => {
                    console.log('data.pieces', data.pieces);
                    if (piecesBuffer[0].shape === 0) {
                        setPiecesBuffer(data.pieces);
                    } else {
                        setPiecesBuffer([...piecesBuffer, ...data.pieces]);
                    }
                });
            }
        });

        /**
         * When the piece is placed then updated data is sent for every player in game. So the logic that lies in this
         * method handles proper update of score and opponent field.
         */
        socket.on('sendUpdatedGameData', (data) => {
            console.log('in sendUpdatedGameData, data', data);
            if (data.myNickName === props.user) {
                props.setScoreAction(data.score);
            }
            if (data.myNickName !== props.user) {
                redrawOpponentField(data.field);
            }
            setGameLevel(data.level);
        });
    }, []);

    const redrawOpponentField = (matrix) => {
        console.log('matrix', matrix);
        let newField = createField();
        console.log('newField', newField);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newField[i][j] = matrix[i][j] === 1 ? ['J', 'filled'] : [0, 'empty'];
            }
        }

        setOpponentField(newField);
    };

    useEffect(() => {
    }, [props.score]);

    useEffect(() => {
        setDropTime(assembleDropTime());
    }, [gameLevel]); // this fires every time when game level is changed

    useInterval(() => {
        drop();
    }, dropTime);


    return (
        <div tabIndex="0" className="game-field__wrap flex_centered" onKeyDown={e => move(e)} onKeyUp={keyReleased}
             ref={props.gameFieldRef}>
            <div className="game-field__area">
                <div className="game-field__body">
                    <div className="game-field__col">
                        <GameStats score={props.score || 0} level={gameLevel}/>
                    </div>
                    <div className="game-field__col field__border">
                        <Field field={field}/>
                    </div>
                    <div className="game-field__col">
                        <NextPieceField/>
                        <EnemyField field={opponentField}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        createGameAction: (id) => {
            dispatch(createGameAction(id));
        },
        startGameAction: () => {
            dispatch(startGameAction());
        },
        setScoreAction: (score) => {
            dispatch(setScoreAction(score));
        },
        setPiecesAction: (pieces) => {
            dispatch(setPiecesAction(pieces));
        }
    };
};

const mapStateToProps = (state) => {
    return {
        score: state.game.score || null,
        user: state.user.nickname,
        roomId: state.room.id
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameField);

GameField.propTypes = {
    roomId: PropTypes.string,
    user: PropTypes.string,
    score: PropTypes.number,
    createGameAction: PropTypes.func,
    startGameAction: PropTypes.func,
    setScoreAction: PropTypes.func,
    setPiecesAction: PropTypes.func,
    socket: PropTypes.object,
    history: PropTypes.object,
    gameFieldRef: PropTypes.object,
};