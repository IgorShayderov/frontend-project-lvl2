import stylish from '../../src/formatters/stylish.js';

describe('stylish formatter', () => {
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

    test('when property exists only in first file and is object', () => {
      const diff = {
        _: {
          type: 'only-in-first',
          firstValue: {
            first: '_',
            second: '__',
          },
        },
      };
      const result = stylish(diff);
      const expected = '{\n  - _: {\n        first: _\n        second: __\n    }\n}';

      expect(result).toBe(expected);
    });
  });

  test('should throws error when type is unknown', () => {
    const diff = {
      _: {
        type: '_',
      },
    };

    expect(() => {
      stylish(diff);
    }).toThrow();
  });
});
