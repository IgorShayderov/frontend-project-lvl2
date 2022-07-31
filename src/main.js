import fs from 'fs';
import path from 'path';

import { parseData } from './parsers.js';
import { formatDiff } from './formatters/index.js';
import { buildTree } from './treeBuilder.js';

function getFilesByPath(...filepaths) {
  const workingDir = process.cwd();
  const files = filepaths.map((filepath) => {
    const fullPath = path.resolve(workingDir, filepath);
    const file = fs.readFileSync(fullPath);
    const fileExtension = path.extname(filepath);

    return parseData(file, fileExtension);
  });

  return files;
}

export function compareFiles(filepath1, filepath2) {
  const [firstFile, secondFile] = getFilesByPath(filepath1, filepath2);
  const diff = buildTree(firstFile, secondFile);

  return formatDiff(diff, 'stylish');
}
