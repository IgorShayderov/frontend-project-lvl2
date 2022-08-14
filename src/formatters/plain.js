export const stringifyValue = (value) => {
  const valueType = typeof value;

  if (value === null) {
    return 'null';
  }

  switch (valueType) {
    case 'string':
      return `'${value}'`;
    case 'object':
      return '[complex value]';
    default:
      return `${value}`;
  }
};

const formatDeeper = (data, root = '') => Object.keys(data)
  .reduce((result, key) => {
    const {
      type, firstValue, secondValue, children,
    } = data[key];
    const propPath = `${root}${key}`;

    switch (type) {
      case 'added':
        return `${result}Property '${propPath}' was added with value: ${stringifyValue(secondValue)}\n`;
      case 'deleted':
        return `${result}Property '${propPath}' was removed\n`;
      case 'unchanged':
        return result;
      case 'nested':
        return `${result}${formatDeeper(children, `${propPath}.`)}`;
      case 'changed':
        return `${result}Property '${propPath}' was updated.`
             + ` From ${stringifyValue(firstValue)} to ${stringifyValue(secondValue)}\n`;
      default:
        throw new Error(`Unknown type ${type}`);
    }
  }, '');

const plain = (diff) => formatDeeper(diff).slice(0, -1);

export default plain;
