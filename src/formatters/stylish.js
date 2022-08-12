import _ from 'lodash';

const stylish = (diff) => {
  const formatDeeper = (data, depth = 1) => {
    const stringify = (value) => {
      if (_.isPlainObject(value)) {
        const valueKeys = Object.keys(value);
        const objAsDiff = valueKeys.reduce((obj, key) => {
          const newObj = {
            ...obj,
            [key]: {
              firstValue: value[key],
              type: 'unchanged',
            },
          };

          return newObj;
        }, {});

        return formatDeeper(objAsDiff, depth + 1);
      }

      return `${value}`;
    };

    return Object.keys(data)
      .reduce((result, diffKey, diffIndex, diffsList) => {
        function getDiffStrByType() {
          const indent = '    '.repeat(depth);
          const mathSignLineIndent = indent.slice(0, -2);
          const diffNode = data[diffKey];

          switch (diffNode.type) {
            case 'added':
              return `${mathSignLineIndent}- ${diffKey}: ${stringify(diffNode.firstValue)}\n`;
            case 'deleted':
              return `${mathSignLineIndent}+ ${diffKey}: ${stringify(diffNode.secondValue)}\n`;
            case 'nested':
              return `${indent}${diffKey}: ${formatDeeper(diffNode.children, depth + 1)}\n`;
            case 'unchanged':
              return `${indent}${diffKey}: ${stringify(diffNode.firstValue)}\n`;
            case 'changed':
              return `${mathSignLineIndent}- ${diffKey}: ${stringify(diffNode.firstValue)}\n`
                   + `${mathSignLineIndent}+ ${diffKey}: ${stringify(diffNode.secondValue)}\n`;
            default:
              throw new Error(`Unknown type ${diffNode.type}`);
          }
        }

        const noEndingBraceStr = result.slice(0, result.length - 1);
        const isLastDiff = diffIndex === diffsList.length - 1;

        if (isLastDiff) {
          const endBraceIndent = '    '.repeat(depth - 1);

          return `${noEndingBraceStr}${getDiffStrByType()}${endBraceIndent}}`;
        }

        return `${noEndingBraceStr}${getDiffStrByType()}}`;
      }, '{\n}');
  };

  return formatDeeper(diff);
};

export default stylish;
