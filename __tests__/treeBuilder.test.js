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
    ['both properties are objects',
      { _: { prop1: '_' } }, { _: { prop2: '__' } }, {
        _: {
          type: 'nested',
          children: {
            prop1: {
              firstValue: '_',
              type: 'only-in-first',
            },
            prop2: {
              secondValue: '__',
              type: 'only-in-second',
            },
          },
        },
      },
    ],
  ])(
    'should match when %s',
    (_description, firstStructure, secondStructure, expected) => {
      const result = buildTree(firstStructure, secondStructure);

      expect(result).toStrictEqual(expected);
    },
  );
});
