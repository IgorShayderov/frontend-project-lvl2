import _ from 'lodash';

const getIndent = (depth) => '    '.repeat(depth);
const getSignLineIndent = (depth) => getIndent(depth).slice(0, -2);

const stringify = (data, depth, mapping) => {
  if (_.isPlainObject(data)) {
    const output = Object.entries(data)
      .map(([key, value]) => mapping
        .unchanged({ key, firstValue: value }, depth + 1));

    return `{\n${output.join('')}${getIndent(depth)}}`;
  }

  return `${data}`;
};

const mapping = {
  added: (node, depth) => {
    const { key, secondValue } = node;
    const stringifiedValue = stringify(secondValue, depth, mapping);

    return `${getSignLineIndent(depth)}+ ${key}: ${stringifiedValue}\n`;
  },
  deleted: (node, depth) => {
    const { key, firstValue } = node;
    const stringifiedValue = stringify(firstValue, depth, mapping);

    return `${getSignLineIndent(depth)}- ${key}: ${stringifiedValue}\n`;
  },
  nested: (node, depth, formatChildren) => {
    const { key, children } = node;

    return `${getIndent(depth)}${key}: ${formatChildren(children, depth + 1)}\n`;
  },
  unchanged: (node, depth) => {
    const { key, firstValue } = node;
    const stringifiedValue = stringify(firstValue, depth, mapping);

    return `${getIndent(depth)}${key}: ${stringifiedValue}\n`;
  },
  changed: (node, depth) => {
    const { key, firstValue, secondValue } = node;
    const stringifiedValue1 = stringify(firstValue, depth, mapping);
    const stringifiedValue2 = stringify(secondValue, depth, mapping);

    return `${getSignLineIndent(depth)}- ${key}: ${stringifiedValue1}\n`
         + `${getSignLineIndent(depth)}+ ${key}: ${stringifiedValue2}\n`;
  },
};

const stylish = (diff) => {
  const formatDeeper = (data, depth = 1) => Object.keys(data)
    .reduce((result, diffKey, diffIndex, diffsList) => {
      const node = data[diffKey];
      const diffNode = mapping[node.type](node, depth, formatDeeper);
      const noEndingBraceStr = result.slice(0, result.length - 1);
      const isLastDiff = diffIndex === diffsList.length - 1;

      if (isLastDiff) {
        const endBraceIndent = '    '.repeat(depth - 1);

        return `${noEndingBraceStr}${diffNode}${endBraceIndent}}`;
      }

      return `${noEndingBraceStr}${diffNode}}`;
    }, '{\n}');

  return formatDeeper(diff);
};

export default stylish;
