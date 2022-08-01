import plain from '../../src/formatters/plain.js';

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
});
