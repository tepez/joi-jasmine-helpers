import * as Joi from 'joi'
import * as JoiJasmineHelpers from '.'


describe('custom matchers', () => {
    JoiJasmineHelpers.addMatchers();

    it('toPassValidation', () => {
        const schema = Joi.number().integer();
        expect(schema).toPassValidation(100);
        expect(schema).toPassValidation('100');

        expect(schema).toPassValidation(100, 100);
        expect(schema).toPassValidation('100', 100);

        expect(schema).toPassValidation('100', 100, {
            convert: true,
        });
    });

    it('toFailValidation', () => {
        const schema = Joi.number().integer();
        expect(schema).toFailValidation('xxx');
        expect(schema).toFailValidation('xxx', '"value" must be a number');
        expect(schema).toFailValidation('xxx', /^"value" must be a number$/);
        expect(schema).toFailValidation(10.5, /^"value" must be an integer$/);

        expect(schema).toFailValidation('100', '"value" must be a number', {
            convert: false,
        });
    });
});
