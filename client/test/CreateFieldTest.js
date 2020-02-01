import {describe} from 'mocha';
import {expect} from 'chai';
import {createField, ROWS_AMOUNT} from '../utils/createField';

describe('Create Field Function', function () {
    it('should have proper field length', function () {
        expect(createField()).to.have.lengthOf(ROWS_AMOUNT);
        expect(createField(9)).to.have.length(9);

        const field = createField(9, 8);
        let innerFieldLength = 0;

        for (let i = 0; i < field.length; i++) {
            if (field[i].length !== innerFieldLength) {
                innerFieldLength = field[i].length;
            }
        }

        expect(innerFieldLength).to.equal(8);
    });
});
