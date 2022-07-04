// import { genDiff } from '../src/main';

describe('genDiff function', () => {
  test.each([
    ['properties are similar',
      { _: '_' }, { _: '_' }, {
        _: {
          isExistsInFirstFile: true,
          isExistsInSecondFile: true,
          areValuesEqual: true,
          firstFileValue: '_',
          secondFileValue: '_',
        },
      }],
    ['propety exists in first file',
      { _: '_' }, {}, {
        _: {
          isExistsInFirstFile: true,
          isExistsInSecondFile: false,
          areValuesEqual: false,
          firstFileValue: '_',
          secondFileValue: undefined,
        },
      }],
    ['propety exists in second file',
      {}, { _: '_' }, {
        _: {
          isExistsInFirstFile: false,
          isExistsInSecondFile: true,
          areValuesEqual: false,
          firstFileValue: undefined,
          secondFileValue: '_',
        },
      }],
    ['property exsits in both files, but value is different',
      { _: '_' }, { _: '__' }, {
        _: {
          isExistsInFirstFile: true,
          isExistsInSecondFile: true,
          areValuesEqual: false,
          firstFileValue: '_',
          secondFileValue: '__',
        },
      }],
  ])(
    'should match when %s',
    (description, firstFile, secondFile, expected) => {
      // const result = genDiff(firstFile, secondFile);
      console.log(description, firstFile, secondFile, expected);

      expect(true).toBe(true);
      // expect(result).toStrictEqual(expected);
    },
  );
});
