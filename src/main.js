import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import { parseYml } from './parsers.js';

function getFilesByPath(...filepaths) {
  const workingDir = process.cwd();
  const files = filepaths.map((filepath) => {
    const fullPath = path.resolve(workingDir, filepath);
    const file = fs.readFileSync(fullPath);
    const fileExtension = path.extname(filepath);

    switch (fileExtension) {
      case '.json':
        return JSON.parse(file);
      case '.yml':
        return parseYml(file);
      default:
        throw new Error(`Unknown file extension - ${fileExtension}`);
    }
  });

  return files;
}

export function genDiff(firstFile, secondFile) {
  const allKeys = _.union(Object.keys(firstFile), (Object.keys(secondFile)));

  return allKeys.reduce((result, fileKey) => {
    const isExistsInFirstFile = Object.prototype.hasOwnProperty.call(firstFile, fileKey);
    const isExistsInSecondFile = Object.prototype.hasOwnProperty.call(secondFile, fileKey);
    const noEndingBraceStr = result.slice(0, result.length - 1);

    if (isExistsInFirstFile && isExistsInSecondFile) {
      if (firstFile[fileKey] === secondFile[fileKey]) {
        return `${noEndingBraceStr}   ${fileKey}: ${firstFile[fileKey]}\n}`;
      }

      return `${noEndingBraceStr} + ${fileKey}: ${firstFile[fileKey]}\n`
        + ` - ${fileKey}: ${secondFile[fileKey]}\n}`;
    }

    if (isExistsInFirstFile && !isExistsInSecondFile) {
      return `${noEndingBraceStr} + ${fileKey}: ${firstFile[fileKey]}\n}`;
    }

    return `${noEndingBraceStr} - ${fileKey}: ${secondFile[fileKey]}\n}`;
  }, '{\n}');
}

export function compareFiles(filepath1, filepath2) {
  const [firstFile, secondFile] = getFilesByPath(filepath1, filepath2);

  return genDiff(firstFile, secondFile);
}
