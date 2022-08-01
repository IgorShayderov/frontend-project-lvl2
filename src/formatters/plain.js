function printValue(value) {
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
}

export function plain(diff) {
  function formatDeeper(data, root = '') {
    return Object.keys(data)
      .reduce((result, key) => {
        const {
          type,
          firstValue,
          secondValue,
          children,
        } = data[key];

        const propPath = `${root}${key}`;

        switch (type) {
          case 'only-in-first':
            return `${result}Property '${propPath}' was removed\n`;
          case 'only-in-second':
          case 'both-equal':
            if (secondValue === undefined) {
              return '';
            }

            return `${result}Property '${propPath}' was added with value: `
                 + `${printValue(secondValue)}\n`;
          case 'nested':
            return `${result}${formatDeeper(children, `${propPath}.`)}`;
          case 'changed':
            return `${result}Property '${propPath}' was updated.`
                 + ` From ${printValue(firstValue)} to ${printValue(secondValue)}\n`;
          default:
            throw new Error(`Unknown type ${type}`);
        }
      }, '');
  }

  return formatDeeper(diff).slice(0, -1);
}
