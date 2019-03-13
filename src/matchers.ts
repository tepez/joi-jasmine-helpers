import isRegExp = require('lodash.isregexp');
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import { Schema, ValidationOptions } from 'joi'

export type MessageMatcher = string | RegExp

declare global {
    namespace jasmine {
        interface Matchers<T> {
            toPassValidation(value: any, expectedValue?: any, validateOptions?: ValidationOptions): void

            toFailValidation(value: any, messageMatcher?: MessageMatcher, validateOptions?: ValidationOptions): void
        }
    }
}


function schemaToString(_schema: Schema): string {
    return '<SCHEMA>';
}

export const matchers: CustomMatcherFactories = {
    toPassValidation: (util) => {
        return {
            compare: (schema: Schema, value: any, expectedValue?: any, validateOptions?: ValidationOptions) => {
                const validationResult = schema.validate(value, validateOptions);

                if (validationResult.error) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to pass value "${value}" but it failed validation`,
                    };
                } else if (typeof expectedValue !== 'undefined' && !util.equals(validationResult.value, expectedValue)) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to pass value "${value}" with value ${jasmine.pp(expectedValue)} but it passed with ${jasmine.pp(validationResult.value)}`,
                    };
                }

                return {
                    pass: true,
                }
            },

            negativeCompare: () => {
                throw new Error('Use toFailValidation instead');
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
            compare: (schema: Schema, value: any, messageMatcher?: MessageMatcher, validateOptions?: ValidationOptions) => {
                testMessageMatcher(messageMatcher);

                const validationResult = schema.validate(value, validateOptions);

                if (!validationResult.error) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to fail value "${value}" but it passed`,
                    };
                } else if (typeof messageMatcher !== 'undefined' && !compareErrorMessages(validationResult.error, messageMatcher)) {
                    return {
                        pass: false,
                        message: `Expected schema ${schemaToString(schema)} to fail value "${value}" with message ${messageMatcher} but it failed with ${validationResult.error.message}`,
                    };
                }

                return {
                    pass: true,
                }
            },

            negativeCompare: () => {
                throw new Error('Use toPassValidation instead');
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