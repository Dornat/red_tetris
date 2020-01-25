import * as gameActions from '../actions/gameActions';
import * as roomActions from '../actions/roomActions';
import * as types from '../actions/types';
import * as userActions from '../actions/userActions';
import {expect} from 'chai';
import {describe} from 'mocha';

describe('Actions', function () {
    it('should create an action for setting user', function () {
        const user = 'Guest';
        const expectedAction = {
            type: types.SET_USER,
            user
        };
        expect(userActions.setUser(user)).to.deep.equal(expectedAction);
    });

    it('should create an action for for creating a game', function () {
        const id = 'id89';
        const expectedAction = {
            type: types.CREATE_GAME,
            id: id
        };
        expect(gameActions.createGameAction(id)).to.deep.equal(expectedAction);
    });

    it('should create an action for joining a game', function () {
        const id = 'id89';
        const expectedAction = {
            type: types.JOIN_GAME,
            id: id
        };
        expect(gameActions.joinGameAction(id)).to.deep.equal(expectedAction);
    });

    it('should create an action for starting a game', function () {
        const expectedAction = {
            type: types.START_GAME,
        };
        expect(gameActions.startGameAction()).to.deep.equal(expectedAction);
    });

    it('should create an action for setting a score', function () {
        const score = 1000;
        const expectedAction = {
            type: types.SET_SCORE,
            score
        };
        expect(gameActions.setScoreAction(score)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting next piece', function () {
        const nextPiece = 'piece';
        const expectedAction = {
            type: types.SET_NEXT_PIECE,
            nextPiece
        };
        expect(gameActions.setNextPieceAction(nextPiece)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting level', function () {
        const level = 2;
        const expectedAction = {
            type: types.SET_LEVEL,
            level
        };
        expect(gameActions.setLevelAction(level)).to.deep.equal(expectedAction);
    });

    it('should create an action for reducing rows amount', function () {
        const reductionAmount = 1;
        const expectedAction = {
            type: types.REDUCE_ROWS_AMOUNT,
            reductionAmount
        };
        expect(gameActions.reduceRowsAmountAction(reductionAmount)).to.deep.equal(expectedAction);
    });

    it('should create an action for resetting rows amount', function () {
        const expectedAction = {
            type: types.RESET_ROWS_AMOUNT
        };
        expect(gameActions.resetRowsAmountAction()).to.deep.equal(expectedAction);
    });

    it('should create an action for creating a room', function () {
        const id = 'id98';
        const isLeader = true;
        const expectedAction = {
            type: types.CREATE_ROOM,
            id,
            isLeader
        };
        expect(roomActions.createRoomAction(id, isLeader)).to.deep.equal(expectedAction);
        expect(roomActions.createRoomAction(id)).to.deep.equal(expectedAction);
    });

    it('should create an action for joining a room', function () {
        const id = 'id98';
        const expectedAction = {
            type: types.JOIN_ROOM,
            id
        };
        expect(roomActions.joinRoomAction(id)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting a room', function () {
        const roomId = 'id98';
        const expectedAction = {
            type: types.SET_ROOM,
            roomId
        };
        expect(roomActions.setRoomAction(roomId)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting a leader', function () {
        const isLeader = true;
        const expectedAction = {
            type: types.SET_LEADER,
            isLeader
        };
        expect(roomActions.setLeaderAction(isLeader)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting an opponent', function () {
        const opponent = 'opponent';
        const expectedAction = {
            type: types.SET_OPPONENT,
            opponent
        };
        expect(roomActions.setOpponentAction(opponent)).to.deep.equal(expectedAction);
    });

    it('should create an action for removing an opponent', function () {
        const expectedAction = {
            type: types.REMOVE_OPPONENT
        };
        expect(roomActions.removeOpponentAction()).to.deep.equal(expectedAction);
    });

    it('should create an action for setting modal', function () {
        const modal = 'modal';
        const expectedAction = {
            type: types.SET_MODAL,
            modal
        };
        expect(roomActions.setModalAction(modal)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting music', function () {
        const musicSound = 'sound';
        const expectedAction = {
            type: types.SET_MUSIC,
            musicSound
        };
        expect(roomActions.setMusicAction(musicSound)).to.deep.equal(expectedAction);
    });

    it('should create an action for setting music track', function () {
        const musicTrackName = 'boscage';
        const expectedAction = {
            type: types.SET_MUSIC_TRACK,
            musicTrackName
        };
        expect(roomActions.setMusicTrackAction(musicTrackName)).to.deep.equal(expectedAction);
    });
});
