import {describe} from 'mocha';
import {assert} from 'chai';
import Player from '../src/entity/Player';
import Field from '../src/entity/Field';

describe('Field Tests', function () {
    it('should check if the matrix is an array', function () {
        let field = new Field();

        assert.isArray(field.matrix);
    });

    it('should fill coordinates properly', function () {
        let field = new Field();
        let coords = [[0, 0], [0, 1], [0, 2], [0, 3]];
        let prefilledMatrixWithCoords = [1, 1, 1, 1];

        field.fillCoordinates(coords);

        assert.deepEqual(field.matrix[0].slice(0, 4), prefilledMatrixWithCoords)
    });

    it('should not fill coordinates than fill them', function () {
        let field = new Field();

        let coords = [[-1, 0], [0, 1], [0, 2], [0, 3]];
        let prefilledMatrixWithCoords = [1, 1, 1, 1];
        field.fillCoordinates(coords);
        assert.notDeepEqual(field.matrix[0].slice(0, 4), prefilledMatrixWithCoords, 'check for not fillable out of bound coords');

        let coords2 = [[0, 0], [0, 1], [0, 2], [0, 3]];
        let prefilledMatrixWithCoords2 = [1, 1, 1, 1];
        field.fillCoordinates(coords2);
        assert.deepEqual(field.matrix[0].slice(0, 4), prefilledMatrixWithCoords2, 'check for fillable');

        let coords3 = [[1, 1], [1, 1], [1, 2], [1, 3]];
        let prefilledMatrixWithCoords3 = [1, 1, 1, 1];
        field.fillCoordinates(coords3);
        assert.notDeepEqual(field.matrix[1].slice(0, 4), prefilledMatrixWithCoords3, 'check for duplicate coords');

        let coords4 = [[0, 3], [0, 4], [0, 5], [0, 6]];
        let prefilledMatrixWithCoords4 = [0, 0, 0, 0];
        field.fillCoordinates(coords4);
        assert.notDeepEqual(field.matrix[0].slice(4, 9), prefilledMatrixWithCoords4, 'check for duplicate coords');
    });

    it('should destroy rows successfully and properly', function () {
        let field = new Field();
        let coords = [[1, 0], [1, 1], [1, 2], [1, 3]];
        let prefilledMatrixWithCoords = [1, 1, 1, 1];

        let rowAmount = field.rowAmount;
        let columnAmount = field.columnAmount;

        field.fillCoordinates(coords);
        field.destroyRow();
        assert.deepEqual(field.matrix[0].slice(0, 4), prefilledMatrixWithCoords)

        assert.notEqual(field.rowAmount, rowAmount);
        assert.equal(field.columnAmount, columnAmount);
    });

    it('should sweep the row', function () {
        let field = new Field();
        let coordsI = [[19, 0], [19, 1], [19, 2], [19, 3]];
        let coordsL = [[18, 6], [19, 4], [19, 5], [19, 6]];
        let coordsT = [[18, 8], [19, 7], [19, 8], [19, 9]];

        field.fillCoordinates(coordsI);
        field.fillCoordinates(coordsL);
        field.fillCoordinates(coordsT);

        assert.deepEqual(field.matrix[field.matrix.length - 1], [0, 0, 0, 0, 0, 0, 1, 0, 1, 0]);
    });
});
