import { stylish } from '../src/formatters/stylish.js';

describe('formatters', () => {
  describe('stylish', () => {
    describe('should render certain output', () => {
      test('when property exists only in first file', () => {
        const diff = {
          _: {
            type: 'only-in-first',
            firstValue: '_',
          },
        };
        const result = stylish(diff);
        const expected = '{\n  - _: _\n}';

        expect(result).toBe(expected);
      });

      test('when property exists only in second file', () => {
        const diff = {
          _: {
            type: 'only-in-second',
            secondValue: '_',
          },
        };
        const result = stylish(diff);
        const expected = '{\n  + _: _\n}';

        expect(result).toBe(expected);
      });

      test('when property is nested', () => {
        const diff = {
          _: {
            type: 'nested',
            children: {
              child1: {
                type: 'only-in-first',
                firstValue: '_',
              },
            },
          },
        };
        const result = stylish(diff);
        const expected = '{\n    _: {\n      - child1: _\n    }\n}';

        expect(result).toBe(expected);
      });

      test('when properties are equal', () => {
        const diff = {
          _: {
            type: 'both-equal',
            firstValue: '_',
          },
        };
        const result = stylish(diff);
        const expected = '{\n    _: _\n}';

        expect(result).toBe(expected);
      });

      test('when propeties are different', () => {
        const diff = {
          _: {
            type: 'changed',
            firstValue: '_',
            secondValue: '!',
          },
        };
        const result = stylish(diff);
        const expected = '{\n  - _: _\n  + _: !\n}';

        expect(result).toBe(expected);
      });
    });
  });
});
