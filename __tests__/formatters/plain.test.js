import plain, { printValue } from '../../src/formatters/plain.js';

describe('plain formatter', () => {
  describe('should render certain output', () => {
    test('when property exists only in first file', () => {
      const diff = {
        _: {
          type: 'only-in-first',
          firstValue: '_',
        },
      };
      const result = plain(diff);
      const expected = "Property '_' was removed";

      expect(result).toBe(expected);
    });

    test('when property exists only in second file', () => {
      const diff = {
        _: {
          type: 'only-in-second',
          secondValue: '_',
        },
      };
      const result = plain(diff);
      const expected = "Property '_' was added with value: '_'";

      expect(result).toBe(expected);
    });

    test('when property exists only in second file but equals undefined', () => {
      const diff = {
        _: {
          type: 'only-in-second',
          secondValue: undefined,
        },
      };
      const result = plain(diff);
      const expected = '';

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
      const result = plain(diff);
      const expected = "Property '_.child1' was removed";

      expect(result).toBe(expected);
    });

    test('when properties are equal', () => {
      const diff = {
        _: {
          type: 'both-equal',
          secondValue: '_',
        },
      };
      const result = plain(diff);
      const expected = "Property '_' was added with value: '_'";

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
      const result = plain(diff);
      const expected = "Property '_' was updated. From '_' to '!'";

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
      plain(diff);
    }).toThrow();
  });
});

describe('printValue function', () => {
  test('should print null as string', () => {
    const expected = 'null';
    const result = printValue(null);

    expect(result).toBe(expected);
  });

  test('should print object as complex value', () => {
    const expected = '[complex value]';
    const result = printValue({});

    expect(result).toBe(expected);
  });

  test('should return string with quotes', () => {
    const expected = "'test'";
    const result = printValue('test');

    expect(result).toBe(expected);
  });

  test('should return other value as string', () => {
    const expected = 'true';
    const result = printValue(true);

    expect(result).toBe(expected);
  });
});
