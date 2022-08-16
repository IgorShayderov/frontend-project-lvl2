import fs from 'fs';
import path from 'path';

import parseData from './parsers.js';
import formatDiff from './formatters/index.js';
import buildTree from './treeBuilder.js';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const extractFormat = (filepath) => path.extname(filepath).slice(1);
const getData = (filepath) => {
  const file = fs.readFileSync(filepath, 'utf-8');

  return parseData(file, extractFormat(filepath));
};

const compareFiles = (filepath1, filepath2, format) => {
  const data1 = getData(buildFullPath(filepath1));
  const data2 = getData(buildFullPath(filepath2));

  const diff = buildTree(data1, data2);

  return formatDiff(diff, format || 'stylish');
};

export default compareFiles;
