const isRegExp = require('lodash.isregexp');



const testMessageMatcher = (messageMatcher) => {
    if (typeof messageMatcher !== 'undefined'
        && typeof messageMatcher !== 'string'
        && !isRegExp(messageMatcher)) {
            throw new Error('toFailValidation requires either a string or a RexExp')
    }
};

const compareErrorMessages = (error, messageMatcher) => {
    if (typeof messageMatcher === 'string') {
        return error.message === messageMatcher;
    } else {
        return messageMatcher.test(error.message);
    }
};

const schemaToString = (schema) => '<SCHEMA>';

exports.addMatchers = () => {
    jasmine.addMatchers({
        toPassValidation: (util) => {
            return {
                compare: (schema, value, expectedValue, validateOptions) => {
                    const validationResult = schema.validate(value, validateOptions);

                    if (validationResult.error) {
                        return {
                            pass: false,
                            message: `Expected schema ${schemaToString(schema)} to pass value "${value}" but it failed validation`
                        };
                    } else if (typeof expectedValue !== 'undefined' && !util.equals(validationResult.value, expectedValue)) {
                        return {
                            pass: false,
                            message: `Expected schema ${schemaToString(schema)} to pass value "${value}" with value ${jasmine.pp(expectedValue)} but it passed with ${jasmine.pp(validationResult.value)}`
                        };
                    }

                    return {
                        pass: true
                    }
                },
                negativeCompare: () => { throw new Error('Use toFailValidation instead'); }
            }
        },
        toFailValidation: () => {
            return {
                compare: (schema, value, messageMatcher, validateOptions) => {
                    testMessageMatcher(messageMatcher);

                    const validationResult = schema.validate(value, validateOptions);

                    if (!validationResult.error) {
                        return {
                            pass: false,
                            message: `Expected schema ${schemaToString(schema)} to fail value "${value}" but it passed`
                        };
                    } else if (typeof messageMatcher !== 'undefined' && !compareErrorMessages(validationResult.error, messageMatcher)) {
                        return {
                            pass: false,
                            message: `Expected schema ${schemaToString(schema)} to fail value "${value}" with message ${messageMatcher} but it failed with ${validationResult.error.message}`
                        };
                    }

                    return {
                        pass: true
                    }
                },
                negativeCompare: () => { throw new Error('Use toPassValidation instead'); }
            }
        }
    });
};

