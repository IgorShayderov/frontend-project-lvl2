import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import { parseYml, parseJSON } from './parsers.js';
import { formatDiff } from './formaters.js';

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

export function genDiff(firstFile, secondFile) {
  const allKeys = _.union(Object.keys(firstFile), (Object.keys(secondFile)));

  return allKeys.reduce((result, fileKey) => {
    const isExistsInFirstFile = Object.prototype.hasOwnProperty.call(firstFile, fileKey);
    const isExistsInSecondFile = Object.prototype.hasOwnProperty.call(secondFile, fileKey);
    const areValuesEqual = firstFile[fileKey] === secondFile[fileKey];

    return {
      ...result,
      [fileKey]: {
        isExistsInFirstFile,
        isExistsInSecondFile,
        areValuesEqual,
        firstFileValue: firstFile[fileKey],
        secondFileValue: secondFile[fileKey],
      },
    };
  }, {});
}

export function compareFiles(filepath1, filepath2) {
  const [firstFile, secondFile] = getFilesByPath(filepath1, filepath2);
  const diff = genDiff(firstFile, secondFile);

  return formatDiff(diff, 'stylish');
}
