import _ from 'lodash';

const indent = (depth) => '    '.repeat(depth).slice(0, -2);

const stringify = (data, depth, mapping) => {
  if (_.isPlainObject(data)) {
    const output = Object.entries(data)
      .map(([key, value]) => mapping
        .unchanged({ key, firstValue: value }, depth + 1));

    return `{\n${output.join('')}${indent(depth)}  }`;
  }

  return `${data}`;
};

const mapping = {
  added: (node, depth) => {
    const addedValue = stringify(node.secondValue, depth, mapping);

    return `${indent(depth)}+ ${node.key}: ${addedValue}\n`;
  },
  deleted: (node, depth) => {
    const deletedValue = stringify(node.firstValue, depth, mapping);

    return `${indent(depth)}- ${node.key}: ${deletedValue}\n`;
  },
  nested: (node, depth, formatChildren) => {
    const children = formatChildren(node.children, depth + 1);

    return `${indent(depth)}  ${node.key}: ${children}\n`;
  },
  unchanged: (node, depth) => {
    const unchangedValue = stringify(node.firstValue, depth, mapping);

    return `${indent(depth)}  ${node.key}: ${unchangedValue}\n`;
  },
  changed: (node, depth) => {
    const { key, firstValue, secondValue } = node;

    return `${indent(depth)}- ${key}: ${stringify(firstValue, depth, mapping)}\n`
         + `${indent(depth)}+ ${key}: ${stringify(secondValue, depth, mapping)}\n`;
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
