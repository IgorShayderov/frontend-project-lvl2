import _ from 'lodash';

export function stylish(diff) {
  function formatDeeper(data, depth = 1) {
    function stringify(value) {
      if (_.isPlainObject(value)) {
        const valueKeys = Object.keys(value);
        const hz = valueKeys.reduce((obj, key) => {
          const newObj = {
            ...obj,
            [key]: {
              firstValue: value[key],
              type: 'both-equal',
            },
          };

          return newObj;
        }, {});

        return formatDeeper(hz, depth + 1);
      }

      return `${value}`;
    }

    return Object.keys(data)
      .reduce((result, diffKey, diffIndex, diffsList) => {
        function getDiffStrByType() {
          const {
            type,
            firstValue,
            secondValue,
            children,
          } = data[diffKey];

          const indent = '    '.repeat(depth);
          const mathSignLineIndent = indent.slice(0, -2);

          switch (type) {
            case 'only-in-first':
              return `${mathSignLineIndent}- ${diffKey}: ${stringify(firstValue)}\n`;
            case 'only-in-second':
              return `${mathSignLineIndent}+ ${diffKey}: ${stringify(secondValue)}\n`;
            case 'nested':
              return `${indent}${diffKey}: ${formatDeeper(children, depth + 1)}\n`;
            case 'both-equal':
              return `${indent}${diffKey}: ${stringify(firstValue)}\n`;
            case 'changed':
              return `${mathSignLineIndent}- ${diffKey}: ${stringify(firstValue)}\n`
                 + `${mathSignLineIndent}+ ${diffKey}: ${stringify(secondValue)}\n`;
            default:
              throw new Error(`Unknown type ${type}`);
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
  }

  return formatDeeper(diff);
}
