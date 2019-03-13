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
        expect(spec.schema).toFailValidation(100);
    });

    it('negative', () => {
        expect(spec.schema).not.toFailValidation(100);
    });
});