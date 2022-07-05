import fs from 'fs';
import path from 'path';

import { parseYml, parseJSON } from './parsers.js';
import { formatDiff } from './formaters.js';
import { buildTree } from './treeBuilder.js';

function getFilesByPath(...filepaths) {
  const workingDir = process.cwd();
  const files = filepaths.map((filepath) => {
    const fullPath = path.resolve(workingDir, filepath);
    const file = fs.readFileSync(fullPath);
    const fileExtension = path.extname(filepath);

    switch (fileExtension) {
      case '.json':
        return parseJSON(file);
      case '.yml':
        return parseYml(file);
      default:
        throw new Error(`Unknown file extension - ${fileExtension}`);
    }
  });

  return files;
}

export function compareFiles(filepath1, filepath2) {
  const [firstFile, secondFile] = getFilesByPath(filepath1, filepath2);
  const diff = buildTree(firstFile, secondFile);

  console.log(diff, '\ndiff!!!\n');

  return formatDiff(diff, 'stylish');
}
