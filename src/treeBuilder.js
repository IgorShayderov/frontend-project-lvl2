import _ from 'lodash';

const areBothValuesObjects = (firstValue, secondValue) => {
  const isFirstValueObject = _.isPlainObject(firstValue);
  const isScondValueObject = _.isPlainObject(secondValue);

  return isFirstValueObject && isScondValueObject;
};

const buildTree = (firstStructure, secondStructure) => {
  const allKeys = _.union(Object.keys(firstStructure), (Object.keys(secondStructure)));

  return _.sortBy(allKeys).reduce((result, key) => {
    const firstValue = firstStructure[key];
    const secondValue = secondStructure[key];

    const diff = (() => {
      if (!_.has(secondStructure, key)) {
        return { type: 'deleted', firstValue, key };
      }

      if (!_.has(firstStructure, key)) {
        return { type: 'added', secondValue, key };
      }

      if (_.isEqual(firstValue, secondValue)) {
        return { type: 'unchanged', firstValue, key };
      }

      if (areBothValuesObjects(firstValue, secondValue)) {
        const children = buildTree(firstValue, secondValue);

        return { type: 'nested', children, key };
      }

      return {
        type: 'changed', firstValue, secondValue, key,
      };
    })();

    return { ...result, [key]: diff };
  }, {});
};

export default buildTree;
