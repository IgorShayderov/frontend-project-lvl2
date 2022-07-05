import { buildTree } from '../src/treeBuilder.js';

describe('buildTree function', () => {
  test.each([
    ['properties are similar',
      { _: '_' }, { _: '_' }, {
        _: {
          type: 'both-equal',
          firstValue: '_',
        },
      }],
    ['propety exists in first file',
      { _: '_' }, {}, {
        _: {
          type: 'only-in-first',
          firstValue: '_',
        },
      }],
    ['propety exists in second file',
      {}, { _: '_' }, {
        _: {
          type: 'only-in-second',
          secondValue: '_',
        },
      }],
    ['property exsits in both files, but value is different',
      { _: '_' }, { _: '__' }, {
        _: {
          type: 'changed',
          firstValue: '_',
          secondValue: '__',
        },
      }],
  ])(
    'should match when %s',
    (_description, firstStructure, secondStructure, expected) => {
      const result = buildTree(firstStructure, secondStructure);

      expect(result).toStrictEqual(expected);
    },
  );
});
