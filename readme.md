# joi-jasmine-helpers
> Custom matchers for writing unit test for [joi](https://github.com/hapijs/joi) schemas and extensions

[![npm version](https://badge.fury.io/js/joi-jasmine-helpers.svg)](http://badge.fury.io/js/joi-jasmine-helpers)
[![Build Status](https://secure.travis-ci.org/tepez/joi-jasmine-helpers.svg?branch=master)](http://travis-ci.org/tepez/joi-jasmine-helpers)

## Usage


```js
const Joi = require('joi');
const JoiJasmineHelpers = require('..');


beforeEach(() => {
   JoiJasmineHelpers.addMatchers();
});

const schema = Joi.number().integer();

it('toPassValidation', () => {
    expect(schema).toPassValidation(100);
    expect(schema).toPassValidation('100');

    expect(schema).toPassValidation(100, 100);
    expect(schema).toPassValidation('100', 100);

    expect(schema).toPassValidation(100, 100, { convert: true });
});

it('toFailValidation', () => {
    expect(schema).toFailValidation('xxx');
    expect(schema).toFailValidation('xxx', '"value" must be a number');
    expect(schema).toFailValidation('xxx', /^"value" must be a number$/);
    expect(schema).toFailValidation(10.5, /^"value" must be an integer$/);

    expect(schema).toFailValidation('100', '"value" must be a number', { convert: false });
});
```