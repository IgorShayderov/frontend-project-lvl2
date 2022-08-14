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

    return `${getSignLineIndent(depth)}+ ${key}: ${stringify(secondValue, depth, mapping)}\n`;
  },
  deleted: (node, depth) => {
    const { key, firstValue } = node;

    return `${getSignLineIndent(depth)}- ${key}: ${stringify(firstValue, depth, mapping)}\n`;
  },
  nested: (node, depth, formatChildren) => {
    const { key, children } = node;

    return `${getIndent(depth)}${key}: ${formatChildren(children, depth + 1)}\n`;
  },
  unchanged: (node, depth) => {
    const { key, firstValue } = node;

    return `${getIndent(depth)}${key}: ${stringify(firstValue, depth, mapping)}\n`;
  },
  changed: (node, depth) => {
    const { key, firstValue, secondValue } = node;

    return `${getSignLineIndent(depth)}- ${key}: ${stringify(firstValue, depth, mapping)}\n`
         + `${getSignLineIndent(depth)}+ ${key}: ${stringify(secondValue, depth, mapping)}\n`;
  },
};

const stylish = (diff) => {
  const formatDeeper = (data, depth = 1) => Object.keys(data)
    .reduce((result, diffKey, diffIndex, diffsList) => {
      const node = data[diffKey];
      const diffNode = mapping[node.type](node, depth, formatDeeper);
      const noEndingBraceStr = result.slice(0, result.length - 1);

      if (diffIndex === diffsList.length - 1) {
        const endBraceIndent = '    '.repeat(depth - 1);

        return `${noEndingBraceStr}${diffNode}${endBraceIndent}}`;
      }

      return `${noEndingBraceStr}${diffNode}}`;
    }, '{\n}');

  return formatDeeper(diff);
};

export default stylish;
