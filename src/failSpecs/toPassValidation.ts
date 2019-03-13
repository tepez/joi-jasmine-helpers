import * as Joi from 'joi'
import { matchers } from '../matchers'

interface ISpec {
    schema: Joi.Schema
}

describe('toHaveBeenCalledTimes fails specs', () => {
    let spec: ISpec;
    afterEach((): void => spec = null);
    beforeEach(function (this: ISpec) {
        spec = this;
    });

    beforeEach(() => {
        jasmine.addMatchers(matchers);

        spec.schema = Joi.number().integer().required();
    });

    it('positive', () => {
        expect(spec.schema).toPassValidation(null);
        expect(spec.schema).toPassValidation('xxx');
        expect(spec.schema).toPassValidation('100', 100, { convert: false });
    });

    it('negative', () => {
        expect(spec.schema).not.toPassValidation(100);
    });
});