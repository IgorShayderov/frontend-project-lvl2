import { genDiff } from '../src/main';

describe('genDiff function', () => {
  test.each([
    ['similar property', { _: '_' }, { _: '_' }, '{\n   _: _\n}'],
    ['existing property', { _: '_' }, {}, '{\n + _: _\n}'],
    ['non-existing property', {}, { _: '_' }, '{\n - _: _\n}'],
    ['existing property with different value', { _: '__' }, { _: '_' }, '{\n + _: __\n - _: _\n}'],
  ])(
    'should show %s',
    (description, firstFile, secondFile, expected) => {
      const result = genDiff(firstFile, secondFile);

      expect(result).toBe(expected);
    },
  );
});
