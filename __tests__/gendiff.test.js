import genDiff from '../src/main';

describe('genDiff function', () => {
  describe('JSON files', () => {
    test('should same property', () => {
      const firstFile = {
        _: '_',
      };
      const secondFile = {
        _: '_',
      };

      const result = genDiff(firstFile, secondFile);

      expect(result).toBe(true);
    });

    test('should existing property', () => {
      expect(true).toBe(true);
    });

    test('should non-existing property', () => {
      expect(true).toBe(true);
    });
  });
});
