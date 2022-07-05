import _ from 'lodash';

export function buildTree(firstStructure, secondStructure) {
  const allKeys = _.union(Object.keys(firstStructure), (Object.keys(secondStructure)));

  return allKeys.reduce((result, fileKey) => {
    const isExistsInFirstFile = Object.prototype.hasOwnProperty.call(firstStructure, fileKey);
    const isExistsInSecondFile = Object.prototype.hasOwnProperty.call(secondStructure, fileKey);

    const firstValue = firstStructure[fileKey];
    const secondValue = secondStructure[fileKey];

    const diff = (() => {
      if (isExistsInFirstFile && !isExistsInSecondFile) {
        return {
          type: 'only-in-first',
          firstValue,
        };
      }

      if (!isExistsInFirstFile && isExistsInSecondFile) {
        return {
          type: 'only-in-second',
          secondValue,
        };
      }

      if (isExistsInFirstFile && isExistsInSecondFile) {
        const areValuesEqual = _.isEqual(firstValue, secondValue);

        if (areValuesEqual) {
          return {
            type: 'both-equal',
            firstValue,
          };
        }

        const areBothValuesObjects = typeof firstValue === 'object' && typeof secondValue === 'object';

        if (areBothValuesObjects) {
          return {
            type: 'nested',
            firstValue: buildTree(firstValue, secondValue),
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
