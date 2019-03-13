import isRegExp = require('lodash.isregexp');
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import { Schema, ValidationOptions } from 'joi'

export type MessageMatcher = string | RegExp

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toPassValidation<SrcValueType, ExpectedValueType>(
                value: SrcValueType,
                expectedValue?: ExpectedValueType,
                validateOptions?: ValidationOptions,
            ): void

            toFailValidation<SrcValueType>(
                value: SrcValueType,
                messageMatcher?: MessageMatcher,
                validateOptions?: ValidationOptions,
            ): void
        }
    }
}


function schemaToString(_schema: Schema): string {
    return '<SCHEMA>';
}

export const matchers: CustomMatcherFactories = {
    toPassValidation: (util) => {
        return {
            compare: (schema: Schema, srcValue: any, expectedValue?: any, validateOptions?: ValidationOptions) => {
                const { value: actualValue, error: validationError } = schema.validate(srcValue, validateOptions);

                if (validationError) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to pass value "${srcValue}" but it failed validation with message [${validationError.message}]`,
                    };
                } else if (typeof expectedValue !== 'undefined' && !util.equals(actualValue, expectedValue)) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to pass value "${srcValue}" with value ${jasmine.pp(expectedValue)} but it passed with ${jasmine.pp(actualValue)}`,
                    };
                }

                return {
                    pass: true,
                }
            },

            negativeCompare: () => {
                throw new Error('Use toFailValidation instead of not.toPassValidation');
            },
        }
    },

    toFailValidation: () => {
        function testMessageMatcher(messageMatcher: MessageMatcher): void {
            if (typeof messageMatcher !== 'undefined'
                && typeof messageMatcher !== 'string'
                && !isRegExp(messageMatcher)) {
                throw new Error('toFailValidation requires either a string or a RexExp')
            }
        }

        function compareErrorMessages(error: Error, messageMatcher: MessageMatcher): boolean {
            if (typeof messageMatcher === 'string') {
                return error.message === messageMatcher;
            } else {
                return messageMatcher.test(error.message);
            }
        }

        return {
            compare: (schema: Schema, srcValue: any, messageMatcher?: MessageMatcher, validateOptions?: ValidationOptions) => {
                testMessageMatcher(messageMatcher);

                const { error: validationError } = schema.validate(srcValue, validateOptions);

                if (!validationError) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to fail value "${srcValue}" but it passed`,
                    };
                } else if (typeof messageMatcher !== 'undefined' && !compareErrorMessages(validationError, messageMatcher)) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to fail value "${srcValue}" with message [${messageMatcher}] but it failed with message [${validationError.message}]`,
                    };
                }

                return {
                    pass: true,
                }
            },

            negativeCompare: () => {
                throw new Error('Use toPassValidation instead of not.toFailValidation');
            },
        }
    },
};

/**
 * Add the custom matchers in the current Jasmine scope
 */
export function addMatchers(): void {
    beforeEach(() => {
        jasmine.addMatchers(matchers);
    })
}