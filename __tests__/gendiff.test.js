import path from 'path';
import { readFileSync } from 'fs';

import genDiff from '../src/main.js';

const dirname = process.cwd();
const getFixturePath = (filename) => path.join(dirname, '__fixtures__', filename);

describe.each([['stylish'], ['plain'], ['json']])('%s formatter', (formatter) => {
  const filepathOfExpected = getFixturePath(`${formatter}.txt`);
  const expected = readFileSync(filepathOfExpected, 'utf-8');

  test.each([['json'], ['yml']])('%s files', (extension) => {
    const filepath1 = getFixturePath(`file1.${extension}`);
    const filepath2 = getFixturePath(`file2.${extension}`);

    const result = genDiff(filepath1, filepath2, formatter);

    expect(result).toBe(expected);
  });
});
