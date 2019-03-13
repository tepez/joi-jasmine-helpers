import { executeSpecFile } from '@tepez/jasmine-misc-matchers'
import * as Joi from 'joi'
import * as JoiJasmineHelpers from '.'


describe('custom matchers', () => {
    JoiJasmineHelpers.addMatchers();

    describe('toPassValidation', () => {
        it('success specs', () => {
            const schema = Joi.number().integer();
            expect(schema).toPassValidation(100);
            expect(schema).toPassValidation('100');

            expect(schema).toPassValidation(100, 100);
            expect(schema).toPassValidation('100', 100);

            expect(schema).toPassValidation('100', 100, {
                convert: true,
            });
        });

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toPassValidation.ts');

            expect(specs.map((spec) => spec.failedExpectations)).toEqual([
                [
                    {
                        matcherName: 'toPassValidation',
                        message: 'Expected schema <SCHEMA> to pass value "null" but it failed validation with message ["value" must be a number]',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: null,
                        actual: jasmine.anything() as any,
                    },
                    {
                        matcherName: 'toPassValidation',
                        message: 'Expected schema <SCHEMA> to pass value "xxx" but it failed validation with message ["value" must be a number]',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: 'xxx',
                        actual: jasmine.anything() as any,
                    },
                    {
                        matcherName: 'toPassValidation',
                        message: 'Expected schema <SCHEMA> to pass value "100" but it failed validation with message ["value" must be a number]',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: ['100', 100, { convert: false }] as any,
                        actual: jasmine.anything() as any,
                    },

                    {
                        matcherName: 'toPassValidation',
                        message: 'Expected schema <SCHEMA> to pass value "100" with value 105 but it passed with 100',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: [100, 105],
                        actual: jasmine.anything() as any,
                    },
                ],
                [
                    {
                        matcherName: '',
                        message: 'Error: Use toFailValidation instead of not.toPassValidation',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: '',
                        actual: '',
                    },
                ],
            ]);
        });
    });

    describe('toFailValidation', () => {
        it('success specs', () => {
            const schema = Joi.number().integer();
            expect(schema).toFailValidation('xxx');
            expect(schema).toFailValidation('xxx', '"value" must be a number');
            expect(schema).toFailValidation('xxx', /^"value" must be a number$/);
            expect(schema).toFailValidation(10.5, /^"value" must be an integer$/);

            expect(schema).toFailValidation('100', '"value" must be a number', {
                convert: false,
            });
        });

        it('fail specs', async () => {
            const specs = await executeSpecFile('./src/failSpecs/toFailValidation.ts');

            expect(specs.map((spec) => spec.failedExpectations)).toEqual([
                [
                    {
                        matcherName: 'toFailValidation',
                        message: 'Expected schema <SCHEMA> to fail value "100" but it passed',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: 100 as any,
                        actual: jasmine.anything() as any,
                    },
                    {
                        matcherName: 'toFailValidation',
                        message: 'Expected schema <SCHEMA> to fail value "10.5" with message [xxx] but it failed with message ["value" must be an integer]',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: [10.5, 'xxx'],
                        actual: jasmine.anything() as any,
                    },
                ],
                [
                    {
                        matcherName: '',
                        message: 'Error: Use toPassValidation instead of not.toFailValidation',
                        stack: jasmine.anything() as any,
                        passed: false,
                        expected: '',
                        actual: '',
                    },
                ],
            ]);
        });
    });
});
