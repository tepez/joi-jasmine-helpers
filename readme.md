# joi-jasmine-helpers
> Custom matchers for writing unit test in Jasmine for [hapijs/joi](https://github.com/hapijs/joi) schemas and extensions

[![npm version](https://badge.fury.io/js/%40tepez%2Fjoi-jasmine-helpers.svg)](https://badge.fury.io/js/%40tepez%2Fjoi-jasmine-helpers)
[![Build Status](https://secure.travis-ci.org/tepez/joi-jasmine-helpers.svg?branch=master)](http://travis-ci.org/tepez/joi-jasmine-helpers)

## Install

```
npm install --save @tepez/joi-jasmine-helpers
```

## Compatibility

| Version |  [Joi](https://github.com/sideway/joi) |
| ------- |  ------------------------------------- |
| `0.2.x`  |  `14 joi`                             |

## Usage

```js
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
```
