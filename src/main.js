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

export function genDiff(firstStructure, secondStructure) {
  const allKeys = _.union(Object.keys(firstStructure), (Object.keys(secondStructure)));

  return allKeys.reduce((result, fileKey) => {
    const isExistsInFirstFile = Object.prototype.hasOwnProperty.call(firstStructure, fileKey);
    const isExistsInSecondFile = Object.prototype.hasOwnProperty.call(secondStructure, fileKey);

    const firstValue = firstStructure[fileKey];
    const secondValue = secondStructure[fileKey];

    const diff = (() => {
      if (isExistsInFirstFile && !isExistsInSecondFile) {
        return {
          type: 'only-in-first',
          firstValue,
        };
      }

      if (!isExistsInFirstFile && isExistsInSecondFile) {
        return {
          type: 'only-in-second',
          secondValue,
        };
      }

      if (isExistsInFirstFile && isExistsInSecondFile) {
        const areValuesEqual = _.isEqual(firstValue, secondValue);

        if (areValuesEqual) {
          return {
            type: 'both-equal',
            firstValue,
          };
        }

        const areBothValuesObjects = typeof firstValue === 'object' && typeof secondValue === 'object';

        if (areBothValuesObjects) {
          return {
            type: 'nested',
            firstValue: genDiff(firstValue, secondValue),
          };
        }
      }

      return {
        type: 'changed',
        firstValue,
        secondValue,
      };
    })();

    return {
      ...result,
      [fileKey]: diff,
    };
  }, {});
}

export function compareFiles(filepath1, filepath2) {
  const [firstFile, secondFile] = getFilesByPath(filepath1, filepath2);
  const diff = genDiff(firstFile, secondFile);

  // console.log(diff, '\ndiff!!!\n');

  return formatDiff(diff, 'stylish');
}
