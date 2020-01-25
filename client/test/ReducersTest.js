import * as types from '../actions/types';
import userReducer from '../reducers/user';
import gameReducer from '../reducers/game';
import {describe} from 'mocha';
import {expect} from 'chai';
import {ROWS_AMOUNT} from '../utils/createField';

describe('Reducers', function () {
    it('should return the initial state for user reducer', function () {
        expect(userReducer(undefined, {})).to.deep.equal(
            {
                nickname: ''
            }
        );

        expect(userReducer(undefined, undefined)).to.deep.equal(
            {
                nickname: ''
            }
        );
    });

    it('should handle SET_USER', function () {
        expect(userReducer({}, {
                type: types.SET_USER,
                user: 'Dornat'
            })
        ).to.deep.equal({
            nickname: 'Dornat'
        });

        expect(userReducer({
                nickname: 'Dornat'
            }, {
                type: types.SET_USER,
                user: 'Test User'
            })
        ).to.deep.equal({
            nickname: 'Test User'
        });
    });

    it('should return the initial state for game reducer', function () {
        expect(gameReducer(undefined, {})).to.deep.equal(
            {
                id: null,
                nextPiece: null,
                rowsAmount: ROWS_AMOUNT,
            }
        );

        expect(gameReducer(undefined, undefined)).to.deep.equal(
            {
                id: null,
                nextPiece: null,
                rowsAmount: ROWS_AMOUNT,
            }
        );
    });

    it('should handle CREATE_GAME', function () {
        expect(gameReducer({}, {
            type: types.CREATE_GAME,
            id: 'i89'
        })).to.deep.equal({
            id: 'i89',
            isLeader: true,
            isGameStarted: false,
            score: 0
        });
    });

    it('should handle JOIN_GAME', function () {
        expect(gameReducer({}, {
            type: types.JOIN_GAME,
            id: 'i89'
        })).to.deep.equal({
            id: 'i89',
            isLeader: false,
            isGameStarted: false,
            score: 0
        });
    });

    it('should handle START_GAME', function () {
        expect(gameReducer({}, {
            type: types.START_GAME
        })).to.deep.equal({
            isGameStarted: true,
        });
    });

    it('should handle SET_SCORE', function () {
        expect(gameReducer({}, {
            type: types.SET_SCORE,
            score: 42
        })).to.deep.equal({
            score: 42
        });
    });

    it('should handle SET_NEXT_PIECE', function () {
        expect(gameReducer({}, {
            type: types.SET_NEXT_PIECE,
            nextPiece: 42
        })).to.deep.equal({
            nextPiece: 42
        });
    });

    it('should handle SET_LEVEL', function () {
        expect(gameReducer({}, {
            type: types.SET_LEVEL,
            level: 42
        })).to.deep.equal({
            level: 42
        });
    });

    it('should handle REDUCE_ROWS_AMOUNT', function () {
        expect(gameReducer(undefined, {
            type: types.REDUCE_ROWS_AMOUNT,
            reductionAmount: 1
        })).to.deep.equal({
            id: null,
            nextPiece: null,
            rowsAmount: 19
        });
    });

    it('should handle RESET_ROWS_AMOUNT', function () {
        expect(gameReducer({
            rowsAmount: 42
        }, {
            type: types.RESET_ROWS_AMOUNT
        })).to.deep.equal({
            rowsAmount: ROWS_AMOUNT
        });
    });
});
