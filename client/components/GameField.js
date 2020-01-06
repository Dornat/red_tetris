import EnemyField from './EnemyField';
import Field from './Field';
import GameStats from './GameStats';
import NextPieceField from './NextPieceField';
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {assembleCoordinatesForFillingFieldOnServer, piecesDebug} from '../utils/gameFieldHelpers';
import {checkCollision} from '../utils/checkCollision';
import {connect} from 'react-redux';
import {createField} from '../utils/createField';
import {useField} from '../hooks/useField';
import {useInterval} from '../hooks/useInterval';
import {usePiece} from '../hooks/usePiece';
import {
    createGameAction,
    startGameAction,
    setScoreAction,
    setNextPieceAction,
    setLevelAction
} from '../actions/gameActions';

const GameField = (props) => {
    const DROP_TIME_BASE = 725;
    const DROP_TIME_MULTIPLIER = 0.85;
    const GENERATE_PIECES_AMOUNT = 1000;

    const [piecesBuffer, setPiecesBuffer] = useState([{shape: 0}]);
    const [pieces, setPieces] = useState([{shape: 0}]);
    const [isGameStarted, setGameStarted] = useState(false);
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [piece, updatePiecePosition, resetPiece, pieceRotate] = usePiece(0);
    const [field, setField] = useField(piece, resetPiece, pieces, piecesBuffer, setPieces, props.setNextPieceAction);
    const [opponentField, setOpponentField] = useState(createField());

    const movePiece = direction => {

        if (!checkCollision(piece, field, {x: direction, y: 0})) {
            updatePiecePosition({x: direction, y: 0});
        }
    };

    /**
     *
     * @param y
     */
    const drop = (y = null) => {
        if (!checkCollision(piece, field, {x: 0, y: y ? y : 1})) {
            updatePiecePosition({x: 0, y: y ? y : 1, collided: false});
        } else {
            setDropTime(assembleDropTime());
            if (piece.position.y < 1) {
                setGameOver(true);
                setDropTime(null);
                props.socket.emit('gameOver', props.roomId);
                return;
            }
            if (piecesBuffer.length === 1) {
                piecesDebug(piecesBuffer, 'in if (piecesBuffer.length == 1), piecesBuffer');
                props.socket.emit('generatePieces', props.roomId); // Inject pieces with new dose from server.
            } else {
                updatePiecePosition({x: 0, y: 0, collided: true});
                // Maybe we need to move this two lines outside of else statement.
                const coords = assembleCoordinatesForFillingFieldOnServer(piece);
                console.log('coords', coords);
                props.socket.emit('updatePlayerField', {roomId: props.roomId, nickname: props.user, coords: coords});
            }
        }
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

    const dropPieceInAvailableSpot = () => {
        let y = 1;
        for (;;) {
            if (!checkCollision(piece, field, {x: 0, y: y})) {
                y++;
            } else {
                break;
            }
        }
        drop(y - 1);
    };

    const move = (e) => {
        if (!gameOver) {
            if (e.keyCode === 72 || e.keyCode === 37) {
                movePiece(-1);
            } else if (e.keyCode === 76 || e.keyCode === 39) {
                movePiece(1);
            } else if (e.keyCode === 74 || e.keyCode === 40) {
                dropPiece();
            } else if (e.keyCode === 38 || e.keyCode === 75) {
                pieceRotate(field, 1);
            } else if (e.keyCode === 32) {
                // setDropTime(1);
                dropPieceInAvailableSpot();
            }
        }
    };

    const assembleDropTime = (level = null) => {
        const l = level ? level : (props.level ? props.level : 1);
        return DROP_TIME_BASE * Math.pow(DROP_TIME_MULTIPLIER, l) + l;
    };

    useEffect(() => {
        // TODO CAUTION! There is a bug here somewhere.
        if (pieces.length === GENERATE_PIECES_AMOUNT) { // Draw piece only for the first piece in pieces array and only when array is full.
            console.log('in useEffect with if(pieces.length === GENERATE_PIECES_AMOUNT)');
            updatePiecePosition({x: 0, y: 0, collided: true}); // True is important here. Why?
        }
    }, [pieces]); // This fires every time when pieces are updated.

    useEffect(() => {
        if (pieces.length === 0 || pieces[0].shape === 0) {
            setPieces(piecesBuffer.slice(0, GENERATE_PIECES_AMOUNT));
        }
    }, [piecesBuffer]);

    useEffect(() => {
        props.socket.on('gameStarted', (response) => {
            if (response.roomId === props.roomId) {
                props.setLevelAction(1);
                props.setScoreAction(0);
                setGameStarted(true);
                props.createGameAction(response.gameId);
                props.startGameAction();
                setDropTime(assembleDropTime());
                props.socket.emit('generatePieces', props.roomId);
            }
        });

        props.socket.on('getPieces', (data) => {
            if (piecesBuffer[0].shape === 0) {
                setPiecesBuffer(data.pieces);
            } else {
                setPiecesBuffer([...piecesBuffer, ...data.pieces]);
            }
        });

        /**
         * When the piece is placed then updated data is sent for every player in game. So the logic that lies in this
         * method handles proper update of score, level and opponent field.
         */
        props.socket.on('sendUpdatedGameData', (data) => {
            if (data.myNickName === props.user) {
                props.setScoreAction(data.score);
            }
            if (data.myNickName !== props.user) {
                redrawOpponentField(data.field);
            }
            props.setLevelAction(data.level);
            setDropTime(assembleDropTime(data.level));
        });

        props.socket.on('gameOver', () => {
            setGameOver(true);
            setDropTime(null);
        });

        return () => {
            props.socket.removeAllListeners();
            props.setScoreAction(0);
            props.setLevelAction(1);
            props.setNextPieceAction(null);
        };
    }, []);

    const redrawOpponentField = (matrix) => {
        let newField = createField();
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newField[i][j] = matrix[i][j] === 1 ? ['J', 'filled'] : [0, 'empty'];
            }
        }

        setOpponentField(newField);
    };

    useInterval(() => {
        drop();
    }, dropTime);


    return (
        <div tabIndex="0" className="game-field__wrap flex_centered" onKeyDown={e => move(e)} onKeyUp={keyReleased}
             ref={props.gameFieldRef}>
            <div className="game-field__area">
                <div className="game-field__body">
                    <div className="game-field__col">
                        {isGameStarted ? <GameStats/> : ''}
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

const mapStateToProps = (state) => {
    return {
        user: state.user.nickname,
        roomId: state.room.id,
        isLeader: state.room.isLeader,
        score: state.game.score,
        level: state.game.level
    };
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
        setNextPieceAction: (nextPiece) => {
            dispatch(setNextPieceAction(nextPiece));
        },
        setLevelAction: (level) => {
            dispatch(setLevelAction(level));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameField);

GameField.propTypes = {
    roomId: PropTypes.string,
    user: PropTypes.string,
    isLeader: PropTypes.bool,
    score: PropTypes.number,
    level: PropTypes.number,
    createGameAction: PropTypes.func,
    startGameAction: PropTypes.func,
    setScoreAction: PropTypes.func,
    setNextPieceAction: PropTypes.func,
    setLevelAction: PropTypes.func,
    socket: PropTypes.object,
    history: PropTypes.object,
    gameFieldRef: PropTypes.object,
};