import {describe} from 'mocha';
import {assert} from 'chai';
import Score from '../src/entity/Score';

describe('Score Tests', function () {
    it('should create score with 0 value in it', function () {
        let score = new Score();

        assert.equal(0, score.quantity);
    });

    it('should increase score at least once', function () {
        let score = new Score();

        score.increaseScore(1, 1);
        assert.equal(84, score.quantity);
        
        score.increaseScore(1, 1);
        assert.equal(168, score.quantity);
    });
});
