import _ from 'lodash';

export default function buildTree(firstStructure, secondStructure) {
  const allKeys = _.union(Object.keys(firstStructure), (Object.keys(secondStructure)));
  const sortedKeys = _.sortBy(allKeys);

  return sortedKeys.reduce((result, fileKey) => {
    const isExistsInFirst = _.has(firstStructure, fileKey);
    const isExistsInSecond = _.has(secondStructure, fileKey);

    const firstValue = firstStructure[fileKey];
    const secondValue = secondStructure[fileKey];

    const diff = (() => {
      if (isExistsInFirst && !isExistsInSecond) {
        return {
          type: 'only-in-first',
          firstValue,
        };
      }

      if (!isExistsInFirst && isExistsInSecond) {
        return {
          type: 'only-in-second',
          secondValue,
        };
      }

      if (isExistsInFirst && isExistsInSecond) {
        const areValuesEqual = _.isEqual(firstValue, secondValue);

        if (areValuesEqual) {
          return {
            type: 'both-equal',
            firstValue,
          };
        }

        const isFirstValueObject = _.isPlainObject(firstValue);
        const isScondValueObject = _.isPlainObject(secondValue);
        const areBothValuesObjects = isFirstValueObject && isScondValueObject;

        if (areBothValuesObjects) {
          return {
            type: 'nested',
            children: buildTree(firstValue, secondValue),
          };
        }
      }

      return {
        type: 'changed',
        firstValue,
        secondValue,
      };
    })();

    return {
      ...result,
      [fileKey]: diff,
    };
  }, {});
}
