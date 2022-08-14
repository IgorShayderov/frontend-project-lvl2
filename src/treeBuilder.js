import _ from 'lodash';

const buildTree = (firstStructure, secondStructure) => {
  const allKeys = _.union(Object.keys(firstStructure), (Object.keys(secondStructure)));
  const sortedKeys = _.sortBy(allKeys);

  return sortedKeys.reduce((result, key) => {
    const isExistsInFirst = _.has(firstStructure, key);
    const isExistsInSecond = _.has(secondStructure, key);

    const firstValue = firstStructure[key];
    const secondValue = secondStructure[key];

    const diff = (() => {
      if (isExistsInFirst && !isExistsInSecond) {
        return {
          type: 'deleted',
          firstValue,
          key,
        };
      }

      if (!isExistsInFirst && isExistsInSecond) {
        return {
          type: 'added',
          secondValue,
          key,
        };
      }

      if (isExistsInFirst && isExistsInSecond) {
        const areValuesEqual = _.isEqual(firstValue, secondValue);

        if (areValuesEqual) {
          return {
            type: 'unchanged',
            firstValue,
            key,
          };
        }

        const isFirstValueObject = _.isPlainObject(firstValue);
        const isScondValueObject = _.isPlainObject(secondValue);
        const areBothValuesObjects = isFirstValueObject && isScondValueObject;

        if (areBothValuesObjects) {
          return {
            type: 'nested',
            children: buildTree(firstValue, secondValue),
            key,
          };
        }
      }

      return {
        type: 'changed',
        firstValue,
        secondValue,
        key,
      };
    })();

    return {
      ...result,
      [key]: diff,
    };
  }, {});
};

export default buildTree;
